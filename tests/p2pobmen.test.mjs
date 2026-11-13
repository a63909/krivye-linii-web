import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// Run the actual Next route handlers with Node's TypeScript support.
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") return nextResolve(new URL("./next-server.mjs", import.meta.url).href, context);
  try { return nextResolve(specifier, context); } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
    throw error;
  }
} });
const { POST: processDeals, GET: cronDeals } = await import("../app/api/p2pobmen/process-deals/route.ts");
const { POST: webhook } = await import("../app/api/yookassa/webhook/route.ts");
const { GET: readiness } = await import("../app/api/p2pobmen/status/route.ts");
const { deferred } = await import("./next-server.mjs");
const { dealAmount, createPaymentForDeal } = await import("../app/lib/p2pobmen-payments.ts");
const { verifiedPayment } = await import("../app/lib/yookassa.ts");
const { beginLogin, completeLogin } = await import("../app/lib/p2pobmen.ts");

const dealId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const chatId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const userId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const paymentId = "01234567-1234-1234-1234-012345678901";
const originalFetch = globalThis.fetch;
let scenario;
let calls;
let sequence = 0;
function jwt(label, expires = Math.floor(Date.now() / 1000) + 3600) {
  return `test.${Buffer.from(JSON.stringify({ exp: expires, label })).toString("base64url")}.signature`;
}

beforeEach(() => {
  process.env.P2POBMEN_USERNAME = `test-seller-${++sequence}`;
  process.env.P2POBMEN_PASSWORD = "test-password";
  process.env.P2POBMEN_AUTH_TOKEN = jwt(sequence);
  process.env.PAYMENT_ADMIN_TOKEN = "test-admin";
  process.env.CRON_SECRET = "test-cron";
  process.env.P2POBMEN_PROCESS_TOKEN = "test-process-only";
  deferred.length = 0;
  process.env.PAYMENT_SIGNING_SECRET = "test-signing";
  process.env.YOOKASSA_SHOP_ID = "1515932";
  process.env.YOOKASSA_SECRET_KEY = "test-provider-key";
  process.env.PAYMENT_SITE_URL = "https://web.curvedlines.ru";
  scenario = {
    deal: { id: dealId, number: "123", state: "NEW", createdAt: new Date(Date.now() - 60_000).toISOString(), amount: "920.01", amountCurrency: { id: "69d8bf73-f963-4aae-8825-f0c500ab9c8c", name: "RUB", code: null }, chat: { id: chatId }, dealWithTrustedUser: false },
    payments: [], chatMessages: [],
    payment: { id: paymentId, payment_method: { type: "sbp" }, status: "pending", paid: false, test: false, recipient: { account_id: "1515932" }, amount: { value: "920.01", currency: "RUB" },
      metadata: { source: "p2pobmen", order_id: `p2p-${dealId}`, expected_amount: "920.01", deal_id: dealId, chat_id: chatId },
      confirmation: { confirmation_url: "https://yoomoney.ru/checkout/test" } },
  };
  calls = [];
  globalThis.fetch = async (url, options) => {
    const body = options?.body ? JSON.parse(options.body) : undefined;
    calls.push({ url, options, body });
    if (String(url).startsWith("https://api.yookassa.ru/v3/")) {
      if (scenario.providerFails) return new Response("unavailable", { status: 503 });
      if (options?.method === "GET" && String(url).includes("payments?")) {
        if (scenario.listFails) return new Response("unavailable", { status: 503 });
        const cursor = new URL(url).searchParams.get("cursor") || "";
        return Response.json(scenario.listPages?.[cursor] || { items: scenario.listItems || scenario.payments });
      }
      if (options?.method === "POST") {
        if (!scenario.payments.some(payment => payment.id === scenario.payment.id)) scenario.payments.push(structuredClone(scenario.payment));
        if (scenario.providerResponseLost) throw new Error("fixture response lost");
      }
      return Response.json(scenario.payment);
    }
    assert.match(String(url), /^https:\/\/p2pobmen\.com\/api\/app\//);
    if (!["AuthLogIn", "LoginByCode", "AuthRefreshToken"].includes(body.operationName)) assert.equal(options.headers.Authorization, `JWT ${scenario.refreshedToken || process.env.P2POBMEN_AUTH_TOKEN}`);
    switch (body.operationName) {
      case "AuthLogIn": return Response.json({ data: { auth: { login: { token: scenario.twoFactor ? null : process.env.P2POBMEN_AUTH_TOKEN, twoFactorIsUsed: scenario.twoFactor || false, challengeId: scenario.twoFactor ? "email-challenge" : null } } } });
      case "LoginByCode": {
        assert.deepEqual(body.variables, { code: "123456", challengeId: "email-challenge" });
        return Response.json({ data: { auth: { loginWithCode: scenario.badCode ? null : { token: process.env.P2POBMEN_AUTH_TOKEN } } } });
      }
      case "AuthRefreshToken": return Response.json({ data: { auth: { refreshToken: scenario.refreshFails ? null : { token: scenario.refreshedToken } } } });
      case "AuthGetUser": return Response.json({ data: { auth: { currentUser: { guid: userId } } } });
      case "DealsSallerListLoad": {
        assert.deepEqual(body.variables.filter, { state: scenario.expectedFirst === 1 ? ["NEW"] : ["NEW", "ACCEPTED"], userIdSeller: userId, isDeleted: false });
        scenario.advanceTime?.();
        assert.equal(body.variables.first, scenario.expectedFirst || 15);
        return Response.json({ data: { exchange: { deal: { getDeals: { edges: (scenario.deals || [scenario.deal]).map(node => ({ node })) } } } } });
      }
      case "SellerDealAccept": {
        if (scenario.acceptSkipped) return Response.json({ data: { exchange: { deal: { acceptDeal: { result: { __typename: "ValidateAcceptDealNode" } } } } } });
        scenario.deal.state = "ACCEPTED";
        return Response.json({ data: { exchange: { deal: { acceptDeal: { result: { ...scenario.deal, __typename: "DealNode" } } } } } });
      }
      case "ChatCreateMessage": {
        if (scenario.chatFails) throw new Error("network failure");
        scenario.chatMessages.push({ message: body.variables.input.message, user: { guid: userId }, isDeleted: false, isSystem: false });
        if (scenario.chatResponseLost) throw new Error("fixture response lost");
        return Response.json({ data: { chat: { createChatMessage: { id: "message-1" } } } });
      }
      case "ChatLoad": return Response.json({ data: { chat: { getChat: { chatMessages: {
        edges: scenario.chatMessages.map(node => ({ node })), pageInfo: { hasNextPage: scenario.incompleteChat || false, hasPreviousPage: false }
      } } } } });
      case "P2pGetDeal": {
        assert.deepEqual(body.variables.filter, { id: dealId, userIdSeller: userId, isDeleted: false });
        return Response.json({ data: { exchange: { deal: { getDeal: scenario.missingDeal ? null : scenario.latestDeal || scenario.deal } } } });
      }
      case "PaidSellerDealAccept": {
        if (scenario.confirmFails) return Response.json({ errors: [{ message: "private error" }] });
        if (scenario.confirmNull) return Response.json({ data: { exchange: { deal: { confirmPaymentRecieve: null } } } });
        scenario.deal.state = "CLOSED";
        return Response.json({ data: { exchange: { deal: { confirmPaymentRecieve: scenario.deal } } } });
      }
      default: throw new Error(`Unexpected operation ${body.operationName}`);
    }
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

function request(method = "POST", token = "test-admin") {
  return new Request("https://web.curvedlines.ru/api/p2pobmen/process-deals", { method, headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
function notification(event = "payment.succeeded", extra = {}) {
  return new Request("https://web.curvedlines.ru/api/yookassa/webhook", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "notification", event, object: { id: paymentId, ...extra } }) });
}
function paid() { scenario.payment.status = "succeeded"; scenario.payment.paid = true; scenario.deal.state = "PAID"; }
function mutations(name) { return calls.filter(call => call.body?.operationName === name); }

test("manual and cron authorization are checked before any external request", async () => {
  for (const req of [request("POST", ""), request("POST", "wrong"), request("POST", "test-cron"), request("GET", "wrong")]) {
    assert.equal((await processDeals(req)).status, 401);
  }
  assert.equal(calls.length, 0);
  scenario.deals = [];
  assert.equal((await cronDeals(request("GET", "test-cron"))).status, 200);
});

test("NEW seller deal is accepted, billed for exact RUB amount, and receives its SBP link", async () => {
  const response = await processDeals(request());
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.processed, 1);
  assert.equal(result.results[0].status, "ok");
  const provider = calls.find(call => call.url === "https://api.yookassa.ru/v3/payments");
  assert.deepEqual(provider.body.amount, { value: "920.01", currency: "RUB" });
  assert.equal(provider.body.capture, true);
  assert.equal(provider.body.payment_method_data.type, "sbp");
  assert.deepEqual(provider.body.metadata, scenario.payment.metadata);
  assert.equal(provider.body.metadata.order_id, `p2p-${dealId}`);
  const chat = mutations("ChatCreateMessage")[0];
  assert.equal(chat.body.variables.input.chatId, chatId);
  assert.match(chat.body.variables.input.message, /920\.01 ₽/);
  assert.match(chat.body.variables.input.message, /https:\/\/yoomoney\.ru\/checkout\/test/);
  assert.ok(calls.indexOf(mutations("SellerDealAccept")[0]) < calls.indexOf(provider));
  assert.ok(calls.indexOf(provider) < calls.indexOf(chat));
});

test("external cron gets a quick acknowledgment and work runs after the response", async () => {
  const req = new Request("https://web.curvedlines.ru/api/p2pobmen/process-deals", {
    method: "POST", headers: { Authorization: "Bearer test-process-only", "X-P2P-Run-Mode": "background" },
  });
  const response = await processDeals(req);
  assert.equal(response.status, 202);
  assert.deepEqual(await response.json(), { queued: true });
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(calls.filter(call => call.url.includes("yookassa")).length, 0);
  assert.equal(deferred.length, 1);
  await deferred.shift()();
  assert.equal(mutations("SellerDealAccept").length, 1);
  assert.equal(mutations("ChatCreateMessage").length, 1);
});

test("readiness validates configuration and session without accepting or charging", async () => {
  scenario.expectedFirst = 1;
  assert.equal((await readiness(request("GET", "wrong"))).status, 401);
  assert.equal((await readiness(request("GET", "test-process-only"))).status, 200);
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(calls.filter(call => call.url.includes("yookassa")).length, 0);
});

test("an expired session fails before acknowledging the external cron request", async () => {
  process.env.P2POBMEN_AUTH_TOKEN = jwt("expired-background", 1);
  scenario.refreshFails = true;
  const response = await processDeals(new Request("https://web.curvedlines.ru/api/p2pobmen/process-deals", {
    method: "POST", headers: { Authorization: "Bearer test-process-only", "X-P2P-Run-Mode": "background" },
  }));
  assert.equal(response.status, 503);
  assert.equal(deferred.length, 0);
  assert.equal(mutations("SellerDealAccept").length, 0);
});

test("missing payment configuration never accepts a real deal", async () => {
  delete process.env.YOOKASSA_SECRET_KEY;
  assert.equal((await processDeals(request())).status, 503);
  assert.equal(calls.length, 0);
});

test("amount parsing never rounds, and invalid currency/chat/trusted deals remain unaccepted", async () => {
  assert.equal(dealAmount({ ...scenario.deal, amount: "00920,0100" }), "920.01");
  for (const amount of [null, "", "0", "-1", "NaN", "1e3", "920.019", "1000000000"]) assert.throws(() => dealAmount({ ...scenario.deal, amount }));
  scenario.deals = [
    { ...scenario.deal, amountCurrency: { code: "USD" } },
    { ...scenario.deal, chat: null },
    { ...scenario.deal, dealWithTrustedUser: true },
    { ...scenario.deal, amount: "920.019" },
  ];
  const response = await processDeals(request());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).results.length, 4);
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(calls.filter(call => call.url.includes("yookassa")).length, 0);
});

test("an acceptance race cannot create a payment or a chat message", async () => {
  scenario.acceptSkipped = true;
  const response = await processDeals(request());
  assert.equal((await response.json()).results[0].status, "accept_skipped");
  assert.equal(calls.filter(call => call.url.includes("yookassa")).length, 0);
  assert.equal(mutations("ChatCreateMessage").length, 0);
});

test("same full deal ID uses stable payment payload and provider idempotency key", async () => {
  await createPaymentForDeal(scenario.deal);
  await createPaymentForDeal(scenario.deal);
  assert.equal(calls[0].options.headers["Idempotence-Key"], calls[1].options.headers["Idempotence-Key"]);
  assert.deepEqual(calls[0].body, calls[1].body);
});

test("provider mismatches are rejected before posting a payment link", async () => {
  scenario.payment.metadata.deal_id = userId;
  const response = await processDeals(request());
  assert.equal(response.status, 502);
  assert.equal(mutations("ChatCreateMessage").length, 0);
});

test("a chat failure is visible with payment ID and accepted state for manual recovery", async () => {
  scenario.chatFails = true;
  const response = await processDeals(request());
  assert.equal(response.status, 502);
  const { results } = await response.json();
  assert.equal(results[0].paymentId, paymentId);
  assert.equal(results[0].acceptedState, "ACCEPTED");
  assert.equal(results[0].status, "error");
});

test("cron requires a confirmed session and never sends a fresh email login challenge", async () => {
  delete process.env.P2POBMEN_AUTH_TOKEN;
  assert.equal((await processDeals(request())).status, 503);
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(calls.length, 0);
});

test("first login preserves the email challenge and submits its code with that challenge", async () => {
  scenario.twoFactor = true;
  const login = await beginLogin("seller", "private-password");
  assert.deepEqual(login, { twoFactorIsUsed: true, challengeId: "email-challenge" });
  assert.equal(await completeLogin(login.challengeId, " 123456 "), process.env.P2POBMEN_AUTH_TOKEN);
  scenario.badCode = true;
  await assert.rejects(completeLogin(login.challengeId, "123456"), /Код недействителен/);
  assert.equal(mutations("SellerDealAccept").length, 0);
});

test("an expired session is refreshed without password login or another email code", async () => {
  process.env.P2POBMEN_AUTH_TOKEN = jwt("expired", 1);
  scenario.refreshedToken = jwt("renewed");
  scenario.deals = [];
  assert.equal((await processDeals(request())).status, 200);
  assert.equal(mutations("AuthRefreshToken").length, 1);
  assert.equal(mutations("AuthLogIn").length, 0);
  process.env.P2POBMEN_AUTH_TOKEN = jwt("expired-again", 2);
  scenario.refreshFails = true;
  assert.equal((await processDeals(request())).status, 503);
  assert.equal(mutations("AuthLogIn").length, 0);
});

test("verified succeeded payment confirms an ordinary seller's deal and duplicate delivery is safe", async () => {
  paid();
  assert.equal((await webhook(notification())).status, 200);
  assert.equal(scenario.deal.state, "CLOSED");
  assert.equal((await webhook(notification())).status, 200);
  assert.equal(mutations("PaidSellerDealAccept").length, 1);
  assert.equal(calls.filter(call => call.url.includes(`/payments/${paymentId}`)).length, 2);
});

test("confirmation errors and null results return a failure so YooKassa can retry", async () => {
  paid(); scenario.confirmFails = true;
  assert.equal((await webhook(notification())).status, 502);
  scenario.confirmFails = false; scenario.confirmNull = true;
  assert.equal((await webhook(notification())).status, 503);
  scenario.confirmNull = false;
  assert.equal((await webhook(notification())).status, 200);
});

test("forged success notification, canceled payments, and unpaid payments never confirm", async () => {
  assert.equal((await webhook(notification("payment.succeeded", { status: "succeeded", paid: true }))).status, 409);
  scenario.payment.status = "canceled";
  assert.equal((await webhook(notification("payment.canceled"))).status, 200);
  scenario.payment.status = "succeeded";
  assert.equal((await webhook(notification())).status, 409);
  assert.equal(mutations("PaidSellerDealAccept").length, 0);
});

test("payment must match the live seller deal, amount, chat, and valid state", async () => {
  paid();
  for (const changed of [{ amount: "920.02" }, { chat: { id: userId } }, { amountCurrency: { code: "USD" } }, { state: "CANCELLED" }, { dealWithTrustedUser: true }]) {
    const previous = { ...scenario.deal };
    Object.assign(scenario.deal, changed);
    assert.notEqual((await webhook(notification())).status, 200);
    scenario.deal = previous;
  }
  scenario.missingDeal = true;
  assert.notEqual((await webhook(notification())).status, 200);
  assert.equal(mutations("PaidSellerDealAccept").length, 0);
});

test("p2p metadata is required, other site sources stay rejected, and normal payments still work", async () => {
  paid();
  await assert.rejects(verifiedPayment(paymentId));
  delete scenario.payment.metadata.deal_id;
  assert.equal((await webhook(notification())).status, 400);
  scenario.payment.metadata = { source: "unknown", order_id: "other", expected_amount: "920.01" };
  assert.equal((await webhook(notification())).status, 400);
  scenario.payment.metadata.source = "curvedlines-web";
  assert.equal((await webhook(notification())).status, 200);
  assert.equal(mutations("PaidSellerDealAccept").length, 0);
});

test("malformed webhook input and unrelated events do not call external APIs", async () => {
  for (const body of ["null", "[]", "{"]) {
    assert.equal((await webhook(new Request("https://example.com", { method: "POST", body }))).status, 400);
  }
  assert.equal((await webhook(notification("refund.succeeded"))).status, 200);
  assert.equal(calls.length, 0);
});

function paymentPosts() { return calls.filter(call => call.url === "https://api.yookassa.ru/v3/payments" && call.options.method === "POST"); }

test("the live RUB directory record with code null bills 107 RUB, not the 1 USD room amount", async () => {
  scenario.deal.amount = "107.00";
  scenario.deal.amountLot = "1.00";
  scenario.deal.amountLotCurrency = { name: "USD", code: "fiat" };
  assert.equal(scenario.deal.amountCurrency.code, null);
  scenario.payment.amount.value = "107.00";
  scenario.payment.metadata.expected_amount = "107.00";
  const response = await processDeals(request());
  assert.equal(response.status, 200);
  assert.deepEqual(paymentPosts()[0].body.amount, { value: "107.00", currency: "RUB" });
  assert.match(mutations("ChatCreateMessage")[0].body.variables.input.message, /107\.00 ₽/);
  assert.match(mutations("DealsSallerListLoad")[0].body.query, /amountCurrency \{ id name code \}/);
});

test("a RUB label or ISO-looking code cannot substitute for the ruble's verified directory ID", async () => {
  for (const currency of [
    { id: userId, name: "RUB", code: "RUB" },
    { id: "69d8bf73-f963-4aae-8825-f0c500ab9c8c", name: "USD", code: "RUB" },
    { name: "RUB", code: null },
    { code: "RUB" },
  ]) {
    scenario.deal.amountCurrency = currency;
    assert.equal((await processDeals(request())).status, 502);
  }
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(paymentPosts().length, 0);
});

test("an 8-second initial listing no longer silently skips a NEW deal", async () => {
  const now = Date.now, start = now();
  let clock = start;
  Date.now = () => clock;
  scenario.advanceTime = () => { clock += 8_000; };
  try {
    const response = await processDeals(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).results[0].status, "ok");
    assert.equal(mutations("SellerDealAccept").length, 1);
    assert.equal(paymentPosts().length, 1);
    assert.equal(mutations("ChatCreateMessage").length, 1);
  } finally { Date.now = now; }
});

test("a genuinely exhausted budget defers work visibly without accepting a deal", async () => {
  const now = Date.now, start = now();
  let clock = start;
  Date.now = () => clock;
  scenario.advanceTime = () => { clock += 24_000; };
  try {
    const response = await processDeals(request());
    assert.equal(response.status, 503);
    const result = await response.json();
    assert.equal(result.processed, 0);
    assert.equal(result.remaining, 1);
    assert.equal(result.results[0].status, "deferred");
    assert.equal(mutations("SellerDealAccept").length, 0);
    assert.equal(paymentPosts().length, 0);
  } finally { Date.now = now; }
});

test("background deferral is logged as deferred, never as scheduled run complete", async () => {
  const now = Date.now, warn = console.warn, info = console.info;
  let clock = now();
  const logs = [];
  Date.now = () => clock;
  console.warn = (...args) => logs.push(args);
  console.info = (...args) => logs.push(args);
  scenario.advanceTime = () => { clock += 24_000; };
  try {
    const response = await processDeals(new Request("https://web.curvedlines.ru/api/p2pobmen/process-deals", {
      method: "POST", headers: { Authorization: "Bearer test-process-only", "X-P2P-Run-Mode": "background" },
    }));
    assert.equal(response.status, 202);
    await deferred.shift()();
    assert.equal(logs.length, 1);
    assert.equal(logs[0][0], "[p2pobmen] scheduled run deferred");
    assert.equal(logs[0][1].remaining, 1);
  } finally { Date.now = now; console.warn = warn; console.info = info; }
});

test("a billing failure after acceptance is resumed on the next run with the identical key and body", async () => {
  scenario.providerFails = true;
  assert.equal((await processDeals(request())).status, 502);
  assert.equal(scenario.deal.state, "ACCEPTED");
  scenario.providerFails = false;
  const response = await processDeals(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).results[0].status, "recovered");
  assert.equal(mutations("SellerDealAccept").length, 1);
  const attempts = paymentPosts();
  assert.equal(attempts.length, 2);
  assert.equal(attempts[0].options.headers["Idempotence-Key"], attempts[1].options.headers["Idempotence-Key"]);
  assert.deepEqual(attempts[0].body, attempts[1].body);
  assert.equal(mutations("ChatCreateMessage").length, 1);
});

test("chat failure reuses the existing payment and subsequent runs do not spam the same seller link", async () => {
  scenario.chatFails = true;
  assert.equal((await processDeals(request())).status, 502);
  scenario.chatFails = false;
  const recovered = await processDeals(request());
  assert.equal(recovered.status, 200);
  assert.equal((await recovered.json()).results[0].status, "recovered");
  const repeated = await processDeals(request());
  assert.equal((await repeated.json()).results[0].status, "already_sent");
  assert.equal(paymentPosts().length, 1);
  assert.equal(mutations("SellerDealAccept").length, 1);
  assert.equal(mutations("ChatCreateMessage").length, 2); // failed delivery + successful retry
  assert.equal(scenario.chatMessages.length, 1);
});

test("a lost billing response is recovered by GET without another creation request", async () => {
  scenario.providerResponseLost = true;
  assert.equal((await processDeals(request())).status, 502);
  assert.equal(scenario.payments.length, 1);
  scenario.providerResponseLost = false;
  assert.equal((await processDeals(request())).status, 200);
  assert.equal(paymentPosts().length, 1);
  assert.equal(scenario.chatMessages.length, 1);
});

test("a lost chat acknowledgment does not send the already delivered message again", async () => {
  scenario.chatResponseLost = true;
  assert.equal((await processDeals(request())).status, 502);
  assert.equal(scenario.chatMessages.length, 1);
  scenario.chatResponseLost = false;
  const response = await processDeals(request());
  assert.equal((await response.json()).results[0].status, "already_sent");
  assert.equal(mutations("ChatCreateMessage").length, 1);
  assert.equal(paymentPosts().length, 1);
});

test("a manually accepted fresh deal is billed without accepting it again", async () => {
  scenario.deal.state = "ACCEPTED";
  const response = await processDeals(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).results[0].status, "recovered");
  assert.equal(mutations("SellerDealAccept").length, 0);
  assert.equal(paymentPosts().length, 1);
});

test("old, unknown, ambiguous-timezone and future deal dates cannot create a payment", async () => {
  scenario.deal.state = "ACCEPTED";
  for (const createdAt of [null, "invalid", new Date(Date.now() - 24 * 60 * 60_000).toISOString(), new Date(Date.now() + 60_000).toISOString(), new Date().toISOString().slice(0, -1)]) {
    scenario.deal.createdAt = createdAt;
    assert.equal((await processDeals(request())).status, 502);
  }
  assert.equal(paymentPosts().length, 0);
  assert.equal(mutations("ChatCreateMessage").length, 0);
});

test("an older accepted deal can reuse a verified existing payment, without creating another", async () => {
  scenario.deal.state = "ACCEPTED";
  scenario.deal.createdAt = new Date(Date.now() - 25 * 60 * 60_000).toISOString();
  scenario.payments = [structuredClone(scenario.payment)];
  assert.equal((await processDeals(request())).status, 200);
  assert.equal(paymentPosts().length, 0);
  assert.equal(scenario.chatMessages.length, 1);
});

test("existing successful payment suppresses billing and chat; webhook confirmation remains separate", async () => {
  scenario.deal.state = "ACCEPTED";
  scenario.payments = [structuredClone(scenario.payment)];
  scenario.payment.status = "succeeded";
  scenario.payment.paid = true;
  const response = await processDeals(request());
  assert.equal((await response.json()).results[0].status, "already_paid");
  assert.equal(paymentPosts().length, 0);
  assert.equal(mutations("ChatCreateMessage").length, 0);
  assert.equal(mutations("PaidSellerDealAccept").length, 0);
});

test("failed or incomplete payment lookup never falls through to a new creation request", async () => {
  scenario.deal.state = "ACCEPTED";
  scenario.listFails = true;
  assert.equal((await processDeals(request())).status, 502);
  scenario.listFails = false;
  scenario.listPages = { "": { items: [], next_cursor: "repeat" }, repeat: { items: [], next_cursor: "repeat" } };
  assert.equal((await processDeals(request())).status, 502);
  scenario.listPages = { "": { items: [], next_cursor: "one" }, one: { items: [], next_cursor: "two" }, two: { items: [], next_cursor: "three" } };
  assert.equal((await processDeals(request())).status, 502);
  assert.equal(paymentPosts().length, 0);
});

test("ambiguous or mismatched existing payments block recovery without creating a replacement", async () => {
  scenario.deal.state = "ACCEPTED";
  const valid = structuredClone(scenario.payment);
  scenario.payments = [valid, { ...valid, id: userId }];
  assert.equal((await processDeals(request())).status, 502);
  for (const change of [
    { amount: { value: "1.00", currency: "RUB" } },
    { recipient: { account_id: "another-shop" } },
    { test: true },
    { payment_method: { type: "bank_card" } },
    { metadata: { ...valid.metadata, chat_id: userId } },
  ]) {
    scenario.payments = [{ ...valid, ...change }];
    assert.equal((await processDeals(request())).status, 502);
  }
  assert.equal(paymentPosts().length, 0);
  assert.equal(mutations("ChatCreateMessage").length, 0);
});

test("expired, canceled and unsafe payment links never generate a second payment or message", async () => {
  scenario.deal.state = "ACCEPTED";
  const valid = structuredClone(scenario.payment);
  scenario.payments = [valid];
  for (const change of [
    { expires_at: new Date(Date.now() - 1000).toISOString() },
    { status: "canceled" },
    { confirmation: { confirmation_url: "https://example.com/wrong" } },
  ]) {
    scenario.payment = { ...valid, ...change };
    assert.equal((await processDeals(request())).status, 502);
  }
  assert.equal(paymentPosts().length, 0);
  assert.equal(mutations("ChatCreateMessage").length, 0);
});

test("buyer text cannot impersonate delivery of a seller's payment link", async () => {
  assert.equal((await processDeals(request())).status, 200);
  scenario.chatMessages[0].user.guid = "dddddddd-dddd-dddd-dddd-dddddddddddd";
  const response = await processDeals(request());
  assert.equal((await response.json()).results[0].status, "recovered");
  assert.equal(paymentPosts().length, 1);
  assert.equal(mutations("ChatCreateMessage").length, 2);
});

test("a state change after the scheduler snapshot suppresses payment recovery", async () => {
  scenario.deal.state = "ACCEPTED";
  scenario.latestDeal = { ...scenario.deal, state: "CLOSED" };
  const response = await processDeals(request());
  assert.equal((await response.json()).results[0].status, "state_changed");
  assert.equal(calls.filter(call => call.url.includes("yookassa")).length, 0);
});

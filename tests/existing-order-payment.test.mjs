import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") return nextResolve(new URL("./next-server.mjs", import.meta.url).href, context);
  try { return nextResolve(specifier, context); } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
    throw error;
  }
} });
const { findExistingOrderPayment, parseOrderReference, resolvePaymentEntry } = await import("../app/lib/existing-order-payment.ts");
const { GET: activePayment } = await import("../app/api/pay/active/route.ts");
const dealId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const otherId = "dddddddd-dddd-dddd-dddd-dddddddddddd";
const paymentId = "01234567-1234-1234-1234-012345678901";
const chatId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const userId = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const originalFetch = globalThis.fetch;
let scenario;
let calls;
let sequence = 0;
function deal(id = dealId, amount = "1200.00") {
  return { id, number: id === dealId ? "123" : "124", state: "ACCEPTED", amount, amountCurrency: { id: "69d8bf73-f963-4aae-8825-f0c500ab9c8c", name: "RUB", code: null }, chat: { id: chatId }, dealWithTrustedUser: false };
}
function payment(id = dealId, amount = "1200.00") {
  return { id: paymentId, status: "pending", paid: false, test: false, recipient: { account_id: "1515932" },
    amount: { value: amount, currency: "RUB" }, payment_method: { type: "sbp" },
    metadata: { source: "p2pobmen", order_id: `p2p-${id}`, expected_amount: amount, deal_id: id, chat_id: chatId },
    confirmation: { confirmation_url: `https://yoomoney.ru/checkout?orderId=${paymentId}` } };
}
beforeEach(() => {
  process.env.P2POBMEN_AUTH_TOKEN = `test.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, sequence: ++sequence })).toString("base64url")}.signature`;
  process.env.YOOKASSA_SHOP_ID = "1515932";
  process.env.YOOKASSA_SECRET_KEY = "test-only-key";
  calls = [];
  scenario = { deals: { [dealId]: deal() }, payments: [payment()] };
  globalThis.fetch = async (url, options = {}) => {
    url = String(url);
    const body = options.body ? JSON.parse(options.body) : undefined;
    calls.push({ url, options, body });
    if (url.startsWith("https://api.yookassa.ru/v3/")) {
      assert.equal(options.method, "GET", "lookup must never create, capture or refund a payment");
      assert.equal(options.body, undefined);
      if (url.includes("/payments?")) {
        const query = new URL(url).searchParams;
        assert.equal(query.get("limit"), "100");
        assert.ok(query.get("created_at.gte"));
        return Response.json(scenario.list ? scenario.list(query.get("cursor")) : { items: scenario.payments });
      }
      return Response.json(scenario.payments[0]);
    }
    assert.match(url, /^https:\/\/p2pobmen\.com\/api\/app\//);
    assert.match(body.query, /^query /, "lookup must not accept or confirm deals, or send chat messages");
    if (body.operationName === "AuthGetUser") return Response.json({ data: { auth: { currentUser: { guid: userId } } } });
    if (body.operationName === "DealsSallerListLoad") {
      assert.deepEqual(body.variables.filter, { state: ["ACCEPTED", "PAID"], userIdSeller: userId, isDeleted: false });
      assert.equal(body.variables.first, 2);
      const nodes = scenario.active ? scenario.active() : Object.values(scenario.deals).filter(item => ["ACCEPTED", "PAID"].includes(item.state));
      return Response.json({ data: { exchange: { deal: { getDeals: { edges: nodes.slice(0, 2).map(node => ({ node })) } } } } });
    }
    assert.equal(body.operationName, "P2pGetDeal");
    assert.equal(body.variables.filter.userIdSeller, userId);
    return Response.json({ data: { exchange: { deal: { getDeal: scenario.deals[body.variables.filter.id] || null } } } });
  };
});
afterEach(() => { globalThis.fetch = originalFetch; });

test("accepts unguessable references and rejects short numbers and foreign or ambiguous URLs before I/O", async () => {
  assert.deepEqual(parseOrderReference(`p2p-${dealId}`), { kind: "deal", id: dealId });
  assert.deepEqual(parseOrderReference(`https://p2pobmen.com/deals/${dealId}`), { kind: "deal", id: dealId });
  assert.deepEqual(parseOrderReference(`https://yoomoney.ru/checkout?orderId=${paymentId}`), { kind: "payment", id: paymentId });
  for (const input of ["", "123", "https://evil.test/" + dealId, `https://p2pobmen.com.evil.test/${dealId}`,
    `http://p2pobmen.com/${dealId}`, `https://p2pobmen.com/${dealId}?other=${otherId}`, "x".repeat(1201)]) {
    await assert.rejects(findExistingOrderPayment(input));
  }
  assert.equal(calls.length, 0);
});

test("loads exactly 1200 RUB from the selected order and reuses its existing SBP payment", async () => {
  const result = await findExistingOrderPayment(dealId);
  assert.equal(result.amount, "1200.00");
  assert.equal(result.orderLabel, "123");
  assert.equal(result.state, "pending");
  assert.equal(result.confirmationUrl, scenario.payments[0].confirmation.confirmation_url);
  assert.ok(calls.some(call => call.body?.operationName === "P2pGetDeal"));
  assert.ok(calls.some(call => call.url.includes("/payments?")));
});

test("an unsupported platform currency is a blocked 409, not a generic retrying 503", async () => {
  scenario.deals[dealId].amountCurrency = { id: otherId, name: "USD", code: "fiat" };
  const response = await activePayment(new Request("https://web.curvedlines.ru/api/pay/active"));
  assert.equal(response.status, 409);
  const data = await response.json();
  assert.equal(data.state, "blocked");
  assert.equal(data.retryable, false);
  assert.equal(calls.some(call => call.url.includes("yookassa")), false);
});

test("two simultaneous buyers are bound to their own orders instead of the latest active order", async () => {
  scenario.deals[otherId] = deal(otherId, "1800.25");
  scenario.payments.push({ ...payment(otherId, "1800.25"), id: "12345678-1234-1234-1234-012345678901" });
  const [first, second] = await Promise.all([findExistingOrderPayment(dealId), findExistingOrderPayment(otherId)]);
  assert.equal(first.amount, "1200.00");
  assert.equal(first.orderLabel, "123");
  assert.equal(second.amount, "1800.25");
  assert.equal(second.orderLabel, "124");
});

test("a provider link is fetched by ID and checked against the seller's own deal", async () => {
  const result = await findExistingOrderPayment(`https://yoomoney.ru/checkout?orderId=${paymentId}`);
  assert.equal(result.amount, "1200.00");
  assert.equal(calls.filter(call => call.url.includes("/payments?")).length, 0);
  assert.ok(calls.some(call => call.url.endsWith(`/payments/${paymentId}`)));
  scenario.deals = {};
  await assert.rejects(findExistingOrderPayment(`https://yoomoney.ru/checkout?orderId=${paymentId}`), /Заявка не найдена/);
});

test("paid, closed, canceled, expired or not-yet-created payments never offer a second charge", async () => {
  scenario.payments[0].status = "succeeded"; scenario.payments[0].paid = true;
  assert.equal((await findExistingOrderPayment(dealId)).state, "paid");
  scenario.deals[dealId].state = "CANCELLED";
  assert.equal((await findExistingOrderPayment(dealId)).state, "closed");
  scenario.deals[dealId].state = "ACCEPTED";
  scenario.payments = [{ ...payment(), expires_at: "2000-01-01T00:00:00.000Z" }];
  assert.equal((await findExistingOrderPayment(dealId)).confirmationUrl, undefined);
  scenario.payments = [{ ...payment(), status: "canceled" }];
  assert.equal((await findExistingOrderPayment(dealId)).confirmationUrl, undefined);
  scenario.payments = [];
  assert.equal((await findExistingOrderPayment(dealId)).state, "waiting");
  scenario.deals[dealId].state = "NEW";
  calls.length = 0;
  assert.equal((await findExistingOrderPayment(dealId)).state, "waiting");
  assert.equal(calls.some(call => call.url.includes("yookassa")), false);
});

test("amount, shop, chat, currency, metadata and payment method mismatches fail closed", async () => {
  const original = payment();
  for (const invalid of [
    { ...original, amount: { value: "1.00", currency: "RUB" } },
    { ...original, recipient: { account_id: "another-shop" } },
    { ...original, test: true },
    { ...original, payment_method: { type: "bank_card" } },
    { ...original, amount: { value: "1200.00", currency: "USD" } },
    { ...original, metadata: { ...original.metadata, chat_id: otherId } },
    { ...original, metadata: { ...original.metadata, expected_amount: "1.00" } },
    { ...original, metadata: { ...original.metadata, order_id: "wrong" } },
    { ...original, confirmation: { confirmation_url: "https://evil.test/pay" } },
  ]) {
    scenario.payments = [invalid];
    await assert.rejects(findExistingOrderPayment(dealId));
  }
});

test("pagination is followed, while duplicate payments or incomplete scans never pick a payment at random", async () => {
  scenario.list = cursor => cursor ? { items: scenario.payments } : { items: [], next_cursor: "page-2" };
  assert.equal((await findExistingOrderPayment(dealId)).state, "pending");
  scenario.payments.push({ ...payment(), id: "12345678-1234-1234-1234-012345678901" });
  await assert.rejects(findExistingOrderPayment(dealId), /несколько платёжных/);
  scenario.list = cursor => ({ items: [payment()], next_cursor: cursor ? cursor + "x" : "p" });
  calls.length = 0;
  await assert.rejects(findExistingOrderPayment(dealId), /однозначно/);
  assert.equal(calls.filter(call => call.url.includes("/payments?")).length, 3);
});

test("the permanent link resolves the only accepted deal to its existing 107 RUB payment without manual ID", async () => {
  scenario.deals[dealId] = deal(dealId, "107.00");
  scenario.payments = [payment(dealId, "107.00")];
  const result = await resolvePaymentEntry();
  assert.equal(result.state, "ready");
  assert.equal(result.confirmationUrl, scenario.payments[0].confirmation.confirmation_url);
  assert.equal(calls.filter(call => call.body?.operationName === "DealsSallerListLoad").length, 2);
});

test("no accepted deal waits for the existing processor without billing or accepting anything", async () => {
  scenario.deals[dealId].state = "NEW";
  const result = await resolvePaymentEntry();
  assert.equal(result.state, "waiting");
  assert.equal(result.retryable, true);
  assert.equal(result.confirmationUrl, undefined);
  assert.equal(calls.some(call => call.url.includes("yookassa")), false);
});

test("two simultaneous accepted deals block the shared link without choosing either buyer", async () => {
  scenario.deals[otherId] = deal(otherId, "1800.00");
  const result = await resolvePaymentEntry();
  assert.equal(result.state, "blocked");
  assert.equal(result.retryable, false);
  assert.equal(result.confirmationUrl, undefined);
  assert.equal(calls.some(call => call.url.includes("yookassa")), false);
  assert.equal(calls.some(call => call.body?.operationName === "P2pGetDeal"), false);
});

test("the shared link rechecks concurrency before redirecting if another deal appears during lookup", async () => {
  let reads = 0;
  scenario.active = () => ++reads === 1 ? [deal()] : [deal(), deal(otherId)];
  const result = await resolvePaymentEntry();
  assert.equal(result.state, "blocked");
  assert.equal(result.confirmationUrl, undefined);
});

test("a payment that is not ready or already received cannot redirect or start a new charge", async () => {
  scenario.payments = [];
  assert.equal((await resolvePaymentEntry()).state, "waiting");
  scenario.payments = [{ ...payment(), status: "succeeded", paid: true }];
  const paid = await resolvePaymentEntry();
  assert.equal(paid.state, "blocked");
  assert.equal(paid.confirmationUrl, undefined);
  assert.match(paid.message, /Оплата получена/);
});

test("the readiness endpoint is uncached and read-only, and malformed references stop before I/O", async () => {
  const request = ref => new Request(`https://web.curvedlines.ru/api/pay/active${ref || ""}`);
  const response = await activePayment(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).state, "ready");
  scenario.deals[otherId] = deal(otherId);
  assert.equal((await activePayment(request())).status, 409);
  calls.length = 0;
  assert.equal((await activePayment(request("?ref=123"))).status, 400);
  assert.equal((await activePayment(request(`?ref=${dealId}&ref=${otherId}`))).status, 400);
  assert.equal(calls.length, 0);
});

test("a personal reference continues to resolve its own deal when several deals are active", async () => {
  scenario.deals[otherId] = deal(otherId, "1800.00");
  const result = await resolvePaymentEntry(dealId);
  assert.equal(result.state, "ready");
  assert.equal(calls.some(call => call.body?.operationName === "DealsSallerListLoad"), false);
});

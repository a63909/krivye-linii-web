import test from "node:test";
import assert from "node:assert/strict";
import { consultationInvoice, createPayment, normalizeAmount, signInvoice, verifyInvoice, requireInternalAuth, signPaymentId, verifyPaymentId, receiptCookie, verifiedPayment } from "../app/lib/yookassa.ts";

process.env.PAYMENT_SIGNING_SECRET = "test-only-signing-secret-do-not-use-in-production";
process.env.PAYMENT_ADMIN_TOKEN = "test-only-admin-token";
process.env.YOOKASSA_SHOP_ID = "1515932";
process.env.YOOKASSA_SECRET_KEY = "test-only-provider-key";
const id = "01234567-1234-1234-1234-012345678901";
const input = { orderId: "consult-920", amount: "920", description: "Онлайн-консультация" };
const payment = { id, status: "pending", paid: false, test: false, recipient: { account_id: "1515932" }, amount: { value: "920.00", currency: "RUB" }, metadata: { source: "curvedlines-web", order_id: input.orderId, expected_amount: "920.00" }, confirmation: { confirmation_url: "https://yoomoney.ru/checkout" } };

test("amounts are exact and invalid or below-minimum values are rejected", () => {
  assert.equal(normalizeAmount("920,01"), "920.01");
  for (const value of [920, "499.99", "-1", "700000.01", "1e4", "920.001", "NaN"]) assert.throws(() => normalizeAmount(value));
});
test("public consultation fixes the server price and reuses the same unexpired invoice", () => {
  const first = consultationInvoice();
  assert.equal(first.invoice.amount, "500.00");
  assert.deepEqual(consultationInvoice(first.token), first);
  const differentService = signInvoice({ orderId: "consult-other", amount: "920", description: "Другая услуга" });
  assert.equal(consultationInvoice(differentService.token).invoice.amount, "500.00");
  const malformed = Buffer.from('{"amount":"1"}').toString("base64url") + ".invalid";
  assert.equal(consultationInvoice(malformed).invoice.amount, "500.00");
});
test("only the administrator can issue payment links", () => {
  assert.throws(() => requireInternalAuth(new Request("https://example.com")), /Нет доступа/);
  assert.doesNotThrow(() => requireInternalAuth(new Request("https://example.com", { headers: { authorization: "Bearer test-only-admin-token" } })));
});
test("invoice amount cannot be changed and expired links cannot start payment", () => {
  const now = 1_700_000_000_000;
  const { token, invoice } = signInvoice(input, now);
  assert.deepEqual(verifyInvoice(token, now + 1), invoice);
  const [payload, signature] = token.split(".");
  const modified = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, "base64url").toString()), amount: "1.00" })).toString("base64url");
  assert.throws(() => verifyInvoice(`${modified}.${signature}`, now + 1), /Неверная ссылка/);
  assert.throws(() => verifyInvoice(token, now + 30 * 60_000), /Срок ссылки истёк/);
});
test("payment cookies are signed and separate orders do not overwrite each other", () => {
  assert.equal(verifyPaymentId(signPaymentId(id)), id);
  assert.throws(() => verifyPaymentId(signPaymentId(id).replace(id, "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")));
  assert.notEqual(receiptCookie("first"), receiptCookie("second"));
});
test("provider receives the approved amount and repeat requests use the same idempotency key", async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return Response.json(payment); };
  try {
    const { invoice } = signInvoice(input);
    await createPayment(invoice); await createPayment(invoice);
    assert.equal(calls[0].options.headers["Idempotence-Key"], calls[1].options.headers["Idempotence-Key"]);
    const sent = JSON.parse(calls[0].options.body);
    assert.deepEqual(sent.amount, { value: "920.00", currency: "RUB" });
    assert.equal(sent.payment_method_data.type, "sbp");
    assert.equal(sent.capture, true);
    assert.equal(sent.confirmation.return_url, "https://web.curvedlines.ru/pay/result?order=consult-920");
  } finally { globalThis.fetch = previous; }
});
test("payment status is re-fetched and mismatched amount, shop and test mode are rejected", async () => {
  const previous = globalThis.fetch;
  try {
    for (const invalid of [{ ...payment, amount: { value: "1.00", currency: "RUB" } }, { ...payment, recipient: { account_id: "other" } }, { ...payment, test: true }, { ...payment, id: "different" }]) {
      globalThis.fetch = async () => Response.json(invalid);
      await assert.rejects(verifiedPayment(id));
    }
    globalThis.fetch = async () => Response.json({ ...payment, status: "succeeded", paid: true });
    assert.equal((await verifiedPayment(id)).status, "succeeded");
  } finally { globalThis.fetch = previous; }
});

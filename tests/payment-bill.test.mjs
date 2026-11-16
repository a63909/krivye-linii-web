import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { PDFDocument, PDFName, PDFDict, PDFString } from "pdf-lib";

registerHooks({ resolve(specifier, context, nextResolve) {
  try { return nextResolve(specifier, context); } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return nextResolve(`${specifier}.ts`, context);
    throw error;
  }
} });
const { paymentBill } = await import("../app/lib/payment-bill.ts");
const id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const chatId = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";
const paymentId = "01234567-1234-1234-1234-012345678901";
const deal = { id, number: "D1097367", state: "ACCEPTED", amount: "495.00", amountCurrency: { id: "69d8bf73-f963-4aae-8825-f0c500ab9c8c", name: "RUB", code: null }, chat: { id: chatId }, dealWithTrustedUser: false };
function payment() {
  return { id: paymentId, status: "pending", paid: false, test: false, recipient: { account_id: "1515932" },
    amount: { value: "495.00", currency: "RUB" }, payment_method: { type: "sbp" },
    metadata: { source: "p2pobmen", order_id: `p2p-${id}`, expected_amount: "495.00", deal_id: id, chat_id: chatId } };
}
process.env.YOOKASSA_SHOP_ID = "1515932";
process.env.PAYMENT_SITE_URL = "https://web.curvedlines.ru";

test("the bill is a valid small PDF with a real link annotation bound to its verified payment", async () => {
  const bill = await paymentBill(deal, payment());
  assert.equal(bill.name, "Оплатить-D1097367.pdf");
  assert.equal(bill.contentType, "application/pdf");
  assert.ok(bill.bytes.length < 150_000);
  const document = await PDFDocument.load(bill.bytes);
  assert.equal(document.getPageCount(), 1);
  assert.equal(document.getTitle(), "Оплата сделки D1097367");
  assert.equal(document.catalog.get(PDFName.of("OpenAction")), undefined);
  const annotations = document.getPages()[0].node.Annots();
  assert.equal(annotations.size(), 1);
  const annotation = document.context.lookup(annotations.get(0), PDFDict);
  assert.equal(annotation.get(PDFName.of("Subtype")).toString(), "/Link");
  const action = annotation.lookup(PDFName.of("A"), PDFDict);
  assert.equal(action.get(PDFName.of("S")).toString(), "/URI");
  assert.equal(action.lookup(PDFName.of("URI"), PDFString).decodeText(), `https://web.curvedlines.ru/pay/sbp/${paymentId}`);
});

test("mismatched payments and unsafe bill names cannot produce a payment document", async () => {
  await assert.rejects(paymentBill(deal, { ...payment(), amount: { value: "1.00", currency: "RUB" } }));
  await assert.rejects(paymentBill({ ...deal, number: "../../another-order" }, payment()));
  await assert.rejects(paymentBill(deal, { ...payment(), metadata: { ...payment().metadata, chat_id: id } }));
});

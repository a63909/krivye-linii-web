import { PDFDocument, PDFName, PDFString, StandardFonts, rgb } from "pdf-lib";
import template from "./payment-bill-template.json" with { type: "json" };
import type { ChatAttachment, DealNode } from "./p2pobmen";
import { personalPaymentUrl, validateDealPayment } from "./p2pobmen-recovery";
import { PaymentError, type Payment } from "./yookassa";

export function paymentBillName(deal: DealNode) {
  const label = deal.number || deal.id;
  if (!/^[a-z0-9_-]{1,64}$/i.test(label)) throw new PaymentError("Некорректный номер сделки для счёта", 409);
  return `Оплатить-${label}.pdf`;
}

export async function paymentBill(deal: DealNode, payment: Payment): Promise<ChatAttachment> {
  validateDealPayment(payment, deal);
  const name = paymentBillName(deal);
  const label = deal.number || deal.id;
  const link = personalPaymentUrl(payment);
  const document = await PDFDocument.load(template.base64);
  const page = document.getPages()[0];
  const font = await document.embedFont(StandardFonts.Helvetica);
  const bold = await document.embedFont(StandardFonts.HelveticaBold);
  page.drawText(label, { x: 32, y: 424, size: Math.min(19, 354 / bold.widthOfTextAtSize(label, 1)), font: bold, color: rgb(.1, .12, .1) });
  page.drawText(payment.amount.value.replace(".", ","), { x: 32, y: 334, size: 35, font: bold, color: rgb(.1, .12, .1) });
  page.drawText(link, { x: 32, y: 70, size: Math.min(7.6, 354 / font.widthOfTextAtSize(link, 1)), font, color: rgb(.2, .3, .2) });
  const annotation = document.context.register(document.context.obj({
    Type: "Annot", Subtype: "Link", Rect: [32, 250, 388, 308], Border: [0, 0, 0],
    A: { S: "URI", URI: PDFString.of(link) },
  }));
  page.node.set(PDFName.of("Annots"), document.context.obj([annotation]));
  document.setTitle(`Оплата сделки ${label}`);
  return { name, contentType: "application/pdf", bytes: await document.save() };
}

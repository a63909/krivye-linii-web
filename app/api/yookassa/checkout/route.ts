import { NextResponse } from "next/server";
import { createPayment, paymentError, PaymentError, receiptCookie, signPaymentId, siteOrigin, verifyInvoice } from "../../../lib/yookassa";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    if (request.headers.get("origin") !== siteOrigin()) throw new PaymentError("Обновите страницу оплаты", 403);
    const form = await request.formData();
    const invoice = verifyInvoice(String(form.get("invoice") || ""));
    const payment = await createPayment(invoice);
    const destination = payment.status === "succeeded" ? `${siteOrigin()}/pay/result?order=${encodeURIComponent(invoice.orderId)}` : payment.confirmation?.confirmation_url;
    if (!destination || !["yoomoney.ru", "yookassa.ru", new URL(siteOrigin()).hostname].includes(new URL(destination).hostname) || new URL(destination).protocol !== "https:") throw new PaymentError("Не удалось открыть оплату", 502);
    const response = NextResponse.redirect(destination, 303);
    response.cookies.set(receiptCookie(invoice.orderId), signPaymentId(payment.id), { httpOnly: true, secure: true, sameSite: "lax", path: "/pay", maxAge: 30 * 24 * 3600 });
    return response;
  } catch (error) {
    const e = paymentError(error);
    return new Response(e.message, { status: e.status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }
}

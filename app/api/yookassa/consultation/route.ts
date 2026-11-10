import { NextRequest, NextResponse } from "next/server";
import { consultationInvoice, paymentError, PaymentError, siteOrigin } from "../../../lib/yookassa";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    if (request.headers.get("origin") !== siteOrigin()) throw new PaymentError("Обновите страницу и повторите попытку", 403);
    // Price is assigned here. No client-provided amount or description is read.
    const { token } = consultationInvoice(request.cookies.get("consultation_invoice")?.value);
    const response = NextResponse.redirect(`${siteOrigin()}/pay/${token}`, 303);
    response.cookies.set("consultation_invoice", token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 30 * 60 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const e = paymentError(error);
    return new Response(e.message, { status: e.status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }
}

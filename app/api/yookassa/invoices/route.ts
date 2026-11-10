import { NextResponse } from "next/server";
import { paymentError, requireInternalAuth, signInvoice, siteOrigin } from "../../../lib/yookassa";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    requireInternalAuth(request);
    let input: unknown;
    try { input = await request.json(); } catch { return NextResponse.json({ error: "Некорректные данные" }, { status: 400 }); }
    const { invoice, token } = signInvoice(input);
    return NextResponse.json({ orderId: invoice.orderId, amount: invoice.amount, expiresAt: invoice.expiresAt, paymentUrl: `${siteOrigin()}/pay/${token}` }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { const e = paymentError(error); return NextResponse.json({ error: e.message }, { status: e.status }); }
}

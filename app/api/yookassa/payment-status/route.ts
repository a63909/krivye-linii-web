import { NextResponse } from "next/server";
import { paymentError, requireInternalAuth, verifiedPayment } from "../../../lib/yookassa";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    requireInternalAuth(request);
    const payment = await verifiedPayment(new URL(request.url).searchParams.get("paymentId") || "");
    return NextResponse.json({ paymentId: payment.id, orderId: payment.metadata?.order_id, amount: payment.amount.value, status: payment.status, paid: payment.status === "succeeded" && payment.paid }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { const e = paymentError(error); return NextResponse.json({ error: e.message }, { status: e.status }); }
}

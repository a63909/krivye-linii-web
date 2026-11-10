import { NextResponse } from "next/server";
import { paymentError, verifiedPayment } from "../../../lib/yookassa";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    let body: { type?: string; event?: string; object?: { id?: string } };
    try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
    if (body.type !== "notification" || !["payment.succeeded", "payment.canceled"].includes(body.event || "")) return NextResponse.json({ ok: true });
    // The notification payload is untrusted. Always re-fetch from YooKassa.
    const payment = await verifiedPayment(body.object?.id || "");
    if (body.event !== `payment.${payment.status}` || (payment.status === "succeeded" && !payment.paid)) return NextResponse.json({ ok: false }, { status: 409 });
    // YooKassa is the payment register. No fulfillment or email is triggered here,
    // so duplicate deliveries are safe. Result page reads the current API status.
    console.info("[yookassa] verified status", { paymentId: payment.id, orderId: payment.metadata?.order_id, status: payment.status });
    return NextResponse.json({ ok: true });
  } catch (error) { const e = paymentError(error); return NextResponse.json({ ok: false }, { status: e.status }); }
}

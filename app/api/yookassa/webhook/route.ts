import { NextResponse } from "next/server";
import { paymentError, verifiedPayment } from "../../../lib/yookassa";
import { p2pError } from "../../../lib/p2pobmen";
import { confirmPaidDeal } from "../../../lib/p2pobmen-payments";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    let body: { type?: string; event?: string; object?: { id?: string } } | null;
    try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ ok: false }, { status: 400 });
    if (body.type !== "notification" || !["payment.succeeded", "payment.canceled"].includes(body.event || "")) return NextResponse.json({ ok: true });
    // The notification payload is untrusted. Always re-fetch from YooKassa.
    const payment = await verifiedPayment(body.object?.id || "", "webhook");
    if (body.event !== `payment.${payment.status}` || (payment.status === "succeeded" && !payment.paid)) return NextResponse.json({ ok: false }, { status: 409 });
    console.info("[yookassa] verified status", { paymentId: payment.id, orderId: payment.metadata?.order_id, status: payment.status, source: payment.metadata?.source });
    if (payment.status === "succeeded" && payment.paid && payment.metadata?.source === "p2pobmen") {
      // Propagate failures: only a successful acknowledgment stops YooKassa retries.
      try {
        const deal = await confirmPaidDeal(payment);
        console.info("[p2pobmen] confirmPaymentRecieve", { dealId: deal.id, resultState: deal.state });
      } catch (error) {
        console.error("[p2pobmen] confirmation failed", { paymentId: payment.id, dealId: payment.metadata.deal_id });
        throw error;
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const p2p = p2pError(error), payment = paymentError(error);
    return NextResponse.json({ ok: false }, { status: p2p.status === 500 ? payment.status : p2p.status });
  }
}

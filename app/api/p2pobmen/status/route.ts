import { NextResponse } from "next/server";
import { getMyDeals, p2pError, requireP2pSession } from "../../../lib/p2pobmen";
import { requireProcessAuth } from "../../../lib/p2pobmen-auth";
import { paymentError, requirePaymentConfiguration } from "../../../lib/yookassa";

export const runtime = "nodejs";

// Authenticated, read-only readiness check. Never accepts deals or creates payments.
export async function GET(request: Request) {
  try {
    requireProcessAuth(request);
    requirePaymentConfiguration();
    requireP2pSession();
    await getMyDeals(["NEW"], 1);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const p2p = p2pError(error), payment = paymentError(error);
    const result = p2p.status === 500 ? payment : p2p;
    return NextResponse.json({ ok: false, error: result.message }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  }
}

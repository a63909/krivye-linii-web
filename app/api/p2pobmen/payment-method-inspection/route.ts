import { NextResponse } from "next/server";
import { inspectOwnPaymentMethodReferences } from "../../../lib/p2pobmen";
import { inspectionAllowed } from "../../../lib/p2pobmen-inspection-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
  if (!inspectionAllowed(request)) return NextResponse.json({ error: "Not found" }, { status: 404, headers });
  try {
    return NextResponse.json(await inspectOwnPaymentMethodReferences(), { headers });
  } catch {
    // Never return provider errors, credentials, URLs, bank details or personal data.
    return NextResponse.json({ error: "Не удалось выполнить проверку реквизитов" }, { status: 502, headers });
  }
}

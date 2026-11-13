import { NextResponse } from "next/server";
import { resolvePaymentEntry } from "../../../lib/existing-order-payment";
import { PaymentError } from "../../../lib/yookassa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  try {
    const query = new URL(request.url).searchParams;
    if (query.getAll("ref").length > 1) throw new PaymentError("Не удалось определить заявку.");
    const result = await resolvePaymentEntry(query.get("ref")?.trim() || undefined);
    return NextResponse.json(result, { status: result.state === "blocked" ? 409 : 200, headers });
  } catch (error) {
    const status = error instanceof PaymentError ? error.status : 503;
    const message = error instanceof PaymentError ? error.message : "Не удалось загрузить платёж. Повторите попытку позже или обратитесь к продавцу.";
    return NextResponse.json({ state: "blocked", retryable: status >= 500, message }, { status, headers });
  }
}

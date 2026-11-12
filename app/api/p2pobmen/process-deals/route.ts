import { NextResponse } from "next/server";
import { acceptDeal, getMyDeals, p2pError, sendChatMessage } from "../../../lib/p2pobmen";
import { createPaymentForDeal, validateDeal } from "../../../lib/p2pobmen-payments";
import { constantEqual, paymentError, requireInternalAuth, requirePaymentConfiguration } from "../../../lib/yookassa";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const deadline = Date.now() + 55_000;
  try {
    const cronSecret = process.env.CRON_SECRET;
    const isCron = request.method === "GET" && cronSecret && constantEqual(request.headers.get("authorization") || "", `Bearer ${cronSecret}`);
    if (!isCron) requireInternalAuth(request);
    // Refuse to accept real deals when the payment side is not configured.
    requirePaymentConfiguration();

    const deals = await getMyDeals(["NEW"], 15);
    const results: Array<Record<string, unknown>> = [];
    for (const deal of deals) {
      // Allow re-login (16s), accept (8s), YooKassa (15s), and chat (8s).
      if (Date.now() + 48_000 > deadline) break;
      const item: Record<string, unknown> = { dealId: deal.id, number: deal.number, state: deal.state };
      try {
        // Validate before accepting: an invalid deal must remain NEW for manual handling.
        if (deal.state !== "NEW") { item.status = "accept_skipped"; results.push(item); continue; }
        const amount = validateDeal(deal);
        const accepted = await acceptDeal(deal.id);
        if (!accepted || accepted.id !== deal.id || accepted.state !== "ACCEPTED") {
          item.status = "accept_skipped";
          results.push(item);
          continue;
        }
        item.acceptedState = accepted.state;
        if (validateDeal(accepted) !== amount || accepted.chat?.id !== deal.chat?.id) throw new Error("Данные сделки изменились при принятии");
        const payment = await createPaymentForDeal(accepted);
        item.paymentId = payment.id;
        if (payment.status !== "pending" || !payment.confirmation?.confirmation_url) throw new Error("ЮKassa не вернула ссылку ожидающего платежа");
        const url = new URL(payment.confirmation.confirmation_url);
        if (url.protocol !== "https:") throw new Error("Некорректная ссылка оплаты");
        await sendChatMessage(accepted.chat!.id,
          `💳 Оплата по сделке #${deal.number || deal.id}\nСумма: ${amount} ₽\n\n` +
          `Перейдите по ссылке и оплатите через СБП:\n${url.toString()}\n\n` +
          "После оплаты сделка будет подтверждена автоматически.");
        Object.assign(item, { status: "ok", payUrl: url.toString(), amount });
      } catch (error) {
        item.status = "error";
        item.error = error instanceof Error ? error.message : "Ошибка обработки сделки";
        console.error("[p2pobmen] processing failed", { dealId: deal.id, paymentId: item.paymentId, acceptedState: item.acceptedState });
      }
      results.push(item);
    }
    const failed = results.some(item => item.status === "error");
    return NextResponse.json({ processed: results.length, remaining: deals.length - results.length, results }, {
      status: failed ? 502 : 200, headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const p2p = p2pError(error), payment = paymentError(error);
    const result = p2p.status === 500 ? payment : p2p;
    return NextResponse.json({ error: result.message }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  }
}

// Vercel Cron invokes GET and supplies Authorization: Bearer <CRON_SECRET>.
export async function GET(request: Request) { return POST(request); }

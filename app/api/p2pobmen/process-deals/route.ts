import { after, NextResponse } from "next/server";
import { acceptDeal, getMyDeal, getMyDeals, hasSellerChatMessage, p2pError, requireP2pSession, sendChatMessage, type DealNode } from "../../../lib/p2pobmen";
import { requireProcessAuth } from "../../../lib/p2pobmen-auth";
import { createPaymentForDeal, validateDeal } from "../../../lib/p2pobmen-payments";
import { dealPaymentUrl, findRecoverablePayment, requireRecentDeal, requireRunTime, RunDeferred, validateDealPayment } from "../../../lib/p2pobmen-recovery";
import { paymentError, requirePaymentConfiguration } from "../../../lib/yookassa";

export const runtime = "nodejs";
export const maxDuration = 60;

async function processDeals(deadline: number, deals: DealNode[]) {
  const results: Array<Record<string, unknown>> = [];
  let deferred = 0;
  for (const snapshot of deals) {
    const item: Record<string, unknown> = { dealId: snapshot.id, number: snapshot.number, state: snapshot.state, stage: "validate" };
    try {
      const amount = validateDeal(snapshot);
      let deal = snapshot;
      const recovery = snapshot.state === "ACCEPTED";
      if (snapshot.state === "NEW") {
        // Listing and session are ready: accept (8s), billing (15s), chat (8s).
        // Do not reserve initial login again after it has already completed.
        requireRunTime(deadline, 32_000);
        requireRecentDeal(snapshot);
        item.stage = "accept";
        const accepted = await acceptDeal(snapshot.id);
        if (!accepted || accepted.id !== snapshot.id || accepted.state !== "ACCEPTED") {
          item.status = "accept_skipped"; results.push(item); continue;
        }
        deal = accepted;
      } else if (recovery) {
        requireRunTime(deadline, 8_000);
        item.stage = "refresh_deal";
        const current = await getMyDeal(snapshot.id);
        if (!current || current.id !== snapshot.id || current.state !== "ACCEPTED") {
          item.status = "state_changed"; results.push(item); continue;
        }
        deal = current;
      } else {
        item.status = "state_skipped"; results.push(item); continue;
      }
      item.acceptedState = deal.state;
      if (validateDeal(deal) !== amount || deal.chat?.id !== snapshot.chat?.id || deal.createdAt !== snapshot.createdAt) throw new Error("Данные сделки изменились при принятии");
      item.stage = "payment_lookup";
      let payment = recovery ? await findRecoverablePayment(deal, deadline) : null;
      if (!payment) {
        requireRecentDeal(deal);
        requireRunTime(deadline, 15_000);
        item.stage = "billing";
        payment = await createPaymentForDeal(deal);
      }
      item.paymentId = payment.id;
      validateDealPayment(payment, deal);
      if (payment.status === "succeeded" && payment.paid) {
        // The existing webhook continues to own payment confirmation.
        item.status = "already_paid"; results.push(item); continue;
      }
      const url = dealPaymentUrl(payment);
      const message = "💳 Оплата по сделке #" + (deal.number || deal.id) + "\nСумма: " + amount + " ₽\n\n" +
        "Перейдите по ссылке и оплатите через СБП:\n" + url + "\n\n" +
        "После оплаты сделка будет подтверждена автоматически.";
      if (recovery) {
        requireRunTime(deadline, 8_000);
        item.stage = "check_chat";
        if (await hasSellerChatMessage(deal.chat!.id, message)) {
          item.status = "already_sent"; results.push(item); continue;
        }
      }
      requireRunTime(deadline, 8_000);
      item.stage = "send_chat";
      await sendChatMessage(deal.chat!.id, message);
      Object.assign(item, { status: recovery ? "recovered" : "ok", payUrl: url, amount });
    } catch (error) {
      if (error instanceof RunDeferred) {
        item.status = "deferred";
        deferred++;
      } else {
        item.status = "error";
        const p2p = p2pError(error), payment = paymentError(error);
        item.error = p2p.status === 500 ? payment.message : p2p.message;
        console.error("[p2pobmen] processing failed", { dealId: snapshot.id, paymentId: item.paymentId, acceptedState: item.acceptedState, stage: item.stage, error: item.error });
      }
    }
    results.push(item);
  }
  const failed = results.some(item => item.status === "error");
  return { processed: results.length - deferred, remaining: deferred, results, failed };
}

export async function POST(request: Request) {
  const deadline = Date.now() + 55_000;
  try {
    requireProcessAuth(request);
    requirePaymentConfiguration();
    requireP2pSession();
    const deals = await getMyDeals(["NEW", "ACCEPTED"], 15);
    if (request.headers.get("x-p2p-run-mode") === "background") {
      after(async () => {
        try {
          const result = await processDeals(deadline, deals);
          const report = { processed: result.processed, remaining: result.remaining,
            failedDealIds: result.results.filter(item => item.status === "error").map(item => item.dealId),
            stages: result.results.map(({ dealId, status, stage }) => ({ dealId, status, stage })) };
          if (result.failed) console.error("[p2pobmen] scheduled run failed", report);
          else if (result.remaining) console.warn("[p2pobmen] scheduled run deferred", report);
          else console.info("[p2pobmen] scheduled run complete", report);
        } catch (error) {
          console.error("[p2pobmen] scheduled run failed", p2pError(error));
        }
      });
      return NextResponse.json({ queued: true }, { status: 202, headers: { "Cache-Control": "no-store" } });
    }
    const { failed, ...result } = await processDeals(deadline, deals);
    return NextResponse.json(result, { status: failed ? 502 : result.remaining ? 503 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const p2p = p2pError(error), payment = paymentError(error);
    const result = p2p.status === 500 ? payment : p2p;
    return NextResponse.json({ error: result.message }, { status: result.status, headers: { "Cache-Control": "no-store" } });
  }
}

export async function GET(request: Request) { return POST(request); }

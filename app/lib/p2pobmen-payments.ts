import { confirmPaymentRecieve, getMyDeal, P2pError, type DealNode } from "./p2pobmen";
import { idempotenceKey, PaymentError, providerRequest, siteOrigin, type Payment } from "./yookassa";

export function dealAmount(deal: DealNode) {
  // Verified against the provider's public currency directory: RUB has a null
  // code; the ISO-looking currency name and its fixed ID identify the ruble.
  if (deal.amountCurrency?.id !== "69d8bf73-f963-4aae-8825-f0c500ab9c8c" || deal.amountCurrency.name !== "RUB") {
    throw new P2pError("Валюта сделки должна быть RUB", 409);
  }
  const match = /^(\d{1,9})(?:[.,](\d+))?$/.exec(String(deal.amount ?? ""));
  if (!match || /[1-9]/.test((match[2] || "").slice(2))) throw new P2pError("Сумма сделки должна быть точной до копейки", 409);
  const rubles = String(Number(match[1]));
  const cents = (match[2] || "").slice(0, 2).padEnd(2, "0");
  if (rubles === "0" && cents === "00") throw new P2pError("Сумма сделки должна быть больше нуля", 409);
  return `${rubles}.${cents}`;
}

export function validateDeal(deal: DealNode) {
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(deal.id)) throw new P2pError("Некорректный ID сделки", 409);
  if (!deal.chat?.id || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(deal.chat.id)) throw new P2pError("У сделки нет корректного чата", 409);
  if (deal.dealWithTrustedUser !== false) throw new P2pError("Автоматизация настроена для обычного продавца", 409);
  return dealAmount(deal);
}

export async function createPaymentForDeal(deal: DealNode) {
  const amount = validateDeal(deal);
  const orderId = `p2p-${deal.id}`;
  const returnUrl = new URL("/pay/result", siteOrigin());
  returnUrl.searchParams.set("order", orderId);
  returnUrl.searchParams.set("source", "p2pobmen");
  const payment = await providerRequest("payments", {
    amount: { value: amount, currency: "RUB" }, capture: true,
    payment_method_data: { type: "sbp" },
    confirmation: { type: "redirect", return_url: returnUrl.toString() },
    description: `Сделка #${deal.number || deal.id} p2pobmen`,
    metadata: { source: "p2pobmen", order_id: orderId, expected_amount: amount, deal_id: deal.id, chat_id: deal.chat!.id },
  }, idempotenceKey(orderId));
  if (payment.amount.value !== amount || payment.amount.currency !== "RUB" ||
      payment.metadata?.source !== "p2pobmen" || payment.metadata.order_id !== orderId ||
      payment.metadata.deal_id !== deal.id || payment.metadata.chat_id !== deal.chat!.id || payment.metadata.expected_amount !== amount) {
    throw new PaymentError("Данные платежа не совпали со сделкой", 502);
  }
  return payment;
}

export async function confirmPaidDeal(payment: Payment) {
  const id = payment.metadata?.deal_id;
  if (payment.status !== "succeeded" || !payment.paid || payment.metadata?.source !== "p2pobmen" || !id) {
    throw new PaymentError("Нет подтверждённой оплаты сделки", 409);
  }
  const deal = await getMyDeal(id);
  if (!deal || deal.id !== id || validateDeal(deal) !== payment.amount.value ||
      payment.amount.currency !== "RUB" || deal.chat?.id !== payment.metadata.chat_id) {
    throw new PaymentError("Платёж не соответствует сделке p2pobmen", 409);
  }
  // Re-delivered webhooks must not repeat fulfillment of a completed deal.
  if (["CLOSED", "PAID_CONFIRMED"].includes(deal.state)) return deal;
  if (!["ACCEPTED", "PAID"].includes(deal.state)) throw new P2pError("Сделка не готова к подтверждению оплаты", 503);
  let confirmed: DealNode | null;
  try {
    confirmed = await confirmPaymentRecieve(id);
  } catch (error) {
    // A concurrent delivery may already have confirmed it, or the mutation response was lost.
    const current = await getMyDeal(id);
    if (current && ["CLOSED", "PAID_CONFIRMED"].includes(current.state)) return current;
    throw error;
  }
  if (!confirmed || !["CLOSED", "PAID_CONFIRMED"].includes(confirmed.state)) {
    confirmed = await getMyDeal(id);
    if (!confirmed || !["CLOSED", "PAID_CONFIRMED"].includes(confirmed.state)) throw new P2pError("p2pobmen не подтвердил получение оплаты", 503);
  }
  return confirmed;
}

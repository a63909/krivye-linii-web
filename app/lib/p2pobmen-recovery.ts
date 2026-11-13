import { validateDeal } from "./p2pobmen-payments";
import { type DealNode } from "./p2pobmen";
import { PaymentError, providerRequest, type Payment } from "./yookassa";

export class RunDeferred extends Error {}

export function requireRunTime(deadline: number, milliseconds: number) {
  if (Date.now() + milliseconds > deadline) throw new RunDeferred("Обработка продолжится в следующем запуске");
}

export function requireRecentDeal(deal: DealNode) {
  const value = deal.createdAt;
  const created = typeof value === "string" && /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? Date.parse(value) : NaN;
  // No attempt can predate the deal. Leave an hour inside YooKassa's 24h
  // idempotency retention. updatedAt or cron start cannot prove this age.
  if (!Number.isFinite(created) || created > Date.now() || Date.now() - created >= 23 * 60 * 60_000) {
    throw new PaymentError("Нет платежа для старой заявки или не подтверждена дата создания: требуется ручная проверка", 409);
  }
}

export function validateDealPayment(payment: Payment, deal: DealNode) {
  const amount = validateDeal(deal);
  if (!/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(payment.id) ||
      payment.recipient?.account_id !== process.env.YOOKASSA_SHOP_ID?.trim() || payment.test !== false ||
      payment.amount?.value !== amount || payment.amount.currency !== "RUB" ||
      payment.metadata?.source !== "p2pobmen" || payment.metadata.order_id !== "p2p-" + deal.id ||
      payment.metadata.deal_id !== deal.id || payment.metadata.chat_id !== deal.chat?.id || payment.metadata.expected_amount !== amount ||
      (payment as Payment & { payment_method?: { type?: string } }).payment_method?.type !== "sbp") {
    throw new PaymentError("Данные платежа не совпали со сделкой", 409);
  }
  return payment;
}

export function dealPaymentUrl(payment: Payment) {
  const expires = (payment as Payment & { expires_at?: string }).expires_at;
  if (payment.status !== "pending" || payment.paid !== false ||
      (expires && (!Number.isFinite(Date.parse(expires)) || Date.parse(expires) <= Date.now()))) {
    throw new PaymentError("Платёж уже завершён или ссылка истекла: требуется проверка", 409);
  }
  let url: URL;
  try { url = new URL(payment.confirmation?.confirmation_url || ""); }
  catch { throw new PaymentError("ЮKassa не вернула ссылку ожидающего платежа", 502); }
  if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !["yoomoney.ru", "yookassa.ru", "qr.nspk.ru"].includes(url.hostname)) {
    throw new PaymentError("Некорректная ссылка оплаты", 409);
  }
  return url.toString();
}

export async function findRecoverablePayment(deal: DealNode, deadline: number): Promise<Payment | null> {
  const candidates: Payment[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  for (let page = 0; page < 3; page++) {
    requireRunTime(deadline, 8_000);
    const query = new URLSearchParams({ limit: "100", "created_at.gte": new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString() });
    if (cursor) query.set("cursor", cursor);
    let response: Response;
    try {
      response = await fetch("https://api.yookassa.ru/v3/payments?" + query, {
        method: "GET", cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8_000),
        headers: { Authorization: "Basic " + Buffer.from(process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_SECRET_KEY).toString("base64") },
      });
    } catch { throw new PaymentError("Не удалось проверить существующий платёж", 502); }
    if (!response.ok) throw new PaymentError("Не удалось проверить существующий платёж", 502);
    const data = await response.json() as { items?: Payment[]; next_cursor?: string };
    if (!Array.isArray(data?.items) || data.items.length > 100) throw new PaymentError("Некорректный список платежей", 502);
    candidates.push(...data.items.filter(payment => payment?.metadata?.source === "p2pobmen" && payment.metadata.deal_id === deal.id));
    if (data.next_cursor === undefined) {
      if (candidates.length > 1) throw new PaymentError("Найдено несколько платежей заявки: требуется ручная проверка", 409);
      if (!candidates.length) return null;
      validateDealPayment(candidates[0], deal);
      requireRunTime(deadline, 15_000);
      const current = await providerRequest("payments/" + candidates[0].id);
      if (current.id !== candidates[0].id) throw new PaymentError("Не совпал идентификатор платежа", 409);
      return validateDealPayment(current, deal);
    }
    if (typeof data.next_cursor !== "string" || !data.next_cursor || data.next_cursor.length > 512 || seen.has(data.next_cursor)) {
      throw new PaymentError("Не удалось получить полный список платежей", 409);
    }
    cursor = data.next_cursor;
    seen.add(cursor);
  }
  throw new PaymentError("Не удалось получить полный список платежей: требуется ручная проверка", 409);
}

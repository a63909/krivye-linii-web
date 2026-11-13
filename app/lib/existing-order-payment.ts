import { getMyDeal, getMyDeals } from "./p2pobmen";
import { dealAmount } from "./p2pobmen-payments";
import { PaymentError, providerRequest, type Payment } from "./yookassa";

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const providerHosts = new Set(["yoomoney.ru", "yookassa.ru", "qr.nspk.ru"]);
const unavailable = "Платёж пока не найден. Дождитесь ссылки в чате заявки или обратитесь к продавцу.";
type ExistingPayment = Payment & { expires_at?: string; payment_method?: { type?: string } };
type Reference = { kind: "deal" | "payment"; id: string };
export type OrderPaymentView = {
  orderLabel: string;
  amount: string;
  state: "pending" | "paid" | "closed" | "waiting";
  confirmationUrl?: string;
  message: string;
};

export type PaymentEntryResolution = {
  state: "ready" | "waiting" | "blocked";
  message: string;
  retryable: boolean;
  confirmationUrl?: string;
};

// An unpredictable deal UUID or an existing provider link is the access key.
// Never search by an enumerable order number or select another visitor's deal.
export function parseOrderReference(input: string): Reference {
  const value = input.trim();
  if (!value || value.length > 1200) throw new PaymentError("Вставьте ссылку на вашу заявку или её полный ID.");
  const bare = value.replace(/^p2p-/i, "");
  if (uuid.test(bare)) return { kind: "deal", id: bare.toLowerCase() };
  let url: URL;
  try { url = new URL(value); } catch { throw new PaymentError("Нужна ссылка на заявку или полный ID вида xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx."); }
  if (url.protocol !== "https:" || url.username || url.password) throw new PaymentError("Некорректная ссылка на заявку.");
  if (providerHosts.has(url.hostname)) {
    const id = url.searchParams.get("orderId") || "";
    if (uuid.test(id)) return { kind: "payment", id: id.toLowerCase() };
  }
  if (["p2pobmen.com", "www.p2pobmen.com"].includes(url.hostname)) {
    const ids = [...new Set((url.pathname + url.search + url.hash).match(/[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/gi)?.map(id => id.toLowerCase()))];
    if (ids.length === 1) return { kind: "deal", id: ids[0] };
  }
  throw new PaymentError("Не удалось определить заявку по ссылке. Скопируйте её полный ID или платёжную ссылку из чата.");
}

function configuration(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new PaymentError("Оплата временно недоступна. Обратитесь к продавцу.", 503);
  return value;
}

async function existingPayments(dealId: string): Promise<ExistingPayment[]> {
  const shopId = configuration("YOOKASSA_SHOP_ID");
  const secret = configuration("YOOKASSA_SECRET_KEY");
  const payments: ExistingPayment[] = [];
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString();
  // A bounded, read-only lookup. A missing or ambiguous result never creates a payment.
  for (let page = 0; page < 3; page++) {
    const query = new URLSearchParams({ limit: "100", "created_at.gte": since });
    if (cursor) query.set("cursor", cursor);
    let response: Response;
    try {
      response = await fetch(`https://api.yookassa.ru/v3/payments?${query}`, {
        method: "GET", cache: "no-store", redirect: "error",
        headers: { Authorization: `Basic ${Buffer.from(`${shopId}:${secret}`).toString("base64")}` },
        signal: AbortSignal.timeout(8_000),
      });
    } catch { throw new PaymentError("Не удалось загрузить оплату. Повторите попытку позже.", 502); }
    if (!response.ok) throw new PaymentError("Не удалось загрузить оплату. Повторите попытку позже.", 502);
    let data: { items?: ExistingPayment[]; next_cursor?: string };
    try { data = await response.json(); } catch { throw new PaymentError("Не удалось загрузить оплату.", 502); }
    if (!Array.isArray(data?.items) || data.items.length > 100) throw new PaymentError("Не удалось загрузить оплату.", 502);
    payments.push(...data.items.filter(payment => payment?.metadata?.source === "p2pobmen" && payment.metadata.deal_id === dealId));
    if (data.next_cursor === undefined) return payments;
    if (typeof data.next_cursor !== "string" || !data.next_cursor || data.next_cursor.length > 512 || seenCursors.has(data.next_cursor)) {
      throw new PaymentError("Не удалось однозначно определить платёж. Откройте ссылку из чата заявки.", 409);
    }
    cursor = data.next_cursor;
    seenCursors.add(cursor);
  }
  throw new PaymentError("Не удалось однозначно определить платёж. Откройте ссылку из чата заявки.", 409);
}

function confirmationUrl(payment: ExistingPayment) {
  let url: URL;
  try { url = new URL(payment.confirmation?.confirmation_url || ""); } catch { throw new PaymentError("Платёжная ссылка недоступна. Обратитесь к продавцу.", 409); }
  if (url.protocol !== "https:" || !providerHosts.has(url.hostname) || url.username || url.password || url.port) {
    throw new PaymentError("Платёжная ссылка недоступна. Обратитесь к продавцу.", 409);
  }
  return url.toString();
}

export async function findExistingOrderPayment(input: string): Promise<OrderPaymentView> {
  const reference = parseOrderReference(input);
  let direct: ExistingPayment | undefined;
  let dealId = reference.id;
  if (reference.kind === "payment") {
    direct = await providerRequest(`payments/${reference.id}`);
    if (direct.id !== reference.id || direct.metadata?.source !== "p2pobmen" || !uuid.test(direct.metadata?.deal_id || "")) {
      throw new PaymentError("Платёж не относится к заявке.", 404);
    }
    dealId = direct.metadata!.deal_id;
  }
  const deal = await getMyDeal(dealId);
  if (!deal || deal.id.toLowerCase() !== dealId) throw new PaymentError("Заявка не найдена. Проверьте ссылку или ID.", 404);
  const amount = dealAmount(deal);
  const view = { orderLabel: deal.number || deal.id, amount };
  if (["CLOSED", "PAID_CONFIRMED", "CANCELLED"].includes(deal.state)) {
    return { ...view, state: "closed", message: "Заявка закрыта. Повторная оплата недоступна." };
  }
  if (!["ACCEPTED", "PAID"].includes(deal.state)) {
    return { ...view, state: "waiting", message: "Заявка ещё не готова к оплате. Дождитесь сообщения в её чате." };
  }
  const payments = direct ? [direct] : await existingPayments(dealId);
  const shopId = configuration("YOOKASSA_SHOP_ID");
  for (const payment of payments) {
    if (!uuid.test(payment.id) || payment.recipient?.account_id !== shopId || payment.test !== false ||
        payment.metadata?.source !== "p2pobmen" || payment.metadata.deal_id !== deal.id ||
        payment.metadata.order_id !== `p2p-${deal.id}` || payment.metadata.chat_id !== deal.chat?.id || !deal.chat?.id ||
        payment.metadata.expected_amount !== amount || payment.amount?.value !== amount || payment.amount.currency !== "RUB" ||
        payment.payment_method?.type !== "sbp") {
      throw new PaymentError("Данные оплаты не совпали с заявкой. Обратитесь к продавцу.", 409);
    }
  }
  if (payments.some(payment => payment.status === "succeeded" && payment.paid)) {
    return { ...view, state: "paid", message: "Оплата получена. Повторно платить не нужно." };
  }
  if (deal.state === "PAID") {
    return { ...view, state: "waiting", message: "Заявка отмечена как оплаченная. Проверьте платёж в банке и дождитесь подтверждения." };
  }
  const pending = payments.filter(payment => payment.status === "pending" && payment.paid === false);
  if (pending.length > 1) throw new PaymentError("У заявки несколько платёжных ссылок. Уточните действующую ссылку у продавца.", 409);
  const payment = pending[0];
  if (!payment) return { ...view, state: "waiting", message: unavailable };
  if (payment.expires_at && (!Number.isFinite(Date.parse(payment.expires_at)) || Date.parse(payment.expires_at) <= Date.now())) {
    return { ...view, state: "waiting", message: "Срок платёжной ссылки истёк. Запросите актуальную ссылку у продавца." };
  }
  return { ...view, state: "pending", confirmationUrl: confirmationUrl(payment), message: "Сумма получена из вашей заявки. Вводить её повторно не нужно." };
}

// A shared link has no buyer/deal identifier and works only for exactly one
// accepted unpaid seller deal. Never choose the latest of several deals.
// This path only reads; the existing processor remains responsible for billing.
export async function resolvePaymentEntry(reference?: string): Promise<PaymentEntryResolution> {
  let selected = reference;
  if (!selected) {
    const deals = await getMyDeals(["ACCEPTED", "PAID"], 2);
    if (!deals.length) {
      return { state: "waiting", message: "Ждём подготовки платежа по заявке. Страница обновится автоматически.", retryable: true };
    }
    if (deals.length !== 1) {
      return { state: "blocked", message: "Одновременно ожидают оплаты несколько заявок. Откройте персональную платёжную ссылку из чата вашей сделки.", retryable: false };
    }
    selected = deals[0].id;
  }
  // Re-read the selected deal and verify amount, currency, shop, status and
  // expiry against its existing payment immediately before redirecting.
  const payment = await findExistingOrderPayment(selected);
  if (payment.state === "pending" && payment.confirmationUrl) {
    if (!reference) {
      const current = await getMyDeals(["ACCEPTED", "PAID"], 2);
      if (current.length !== 1 || current[0].id !== selected) {
        return { state: "blocked", message: "Состав ожидающих заявок изменился. Откройте персональную платёжную ссылку из чата вашей сделки.", retryable: false };
      }
      if (current[0].state !== "ACCEPTED") {
        return { state: "waiting", message: "Проверяем получение оплаты. Повторно платить пока не нужно.", retryable: true };
      }
    }
    return { state: "ready", message: "Открываем выбор банка…", retryable: false, confirmationUrl: payment.confirmationUrl };
  }
  return { state: payment.state === "waiting" ? "waiting" : "blocked", message: payment.message, retryable: payment.state === "waiting" };
}

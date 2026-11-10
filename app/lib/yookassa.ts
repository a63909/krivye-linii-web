import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type Invoice = { orderId: string; amount: string; description: string; expiresAt: number };
export type Payment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  test: boolean;
  amount: { value: string; currency: string };
  recipient: { account_id: string };
  confirmation?: { confirmation_url?: string };
  metadata?: Record<string, string>;
};

export class PaymentError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

function env(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new PaymentError("Оплата временно недоступна", 503);
  return value;
}

export function constantEqual(a: string, b: string) {
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function requireInternalAuth(request: Request) {
  if (!constantEqual(request.headers.get("authorization") || "", `Bearer ${env("PAYMENT_ADMIN_TOKEN")}`)) {
    throw new PaymentError("Нет доступа", 401);
  }
}

export function siteOrigin() {
  const url = new URL(process.env.PAYMENT_SITE_URL || "https://web.curvedlines.ru");
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new PaymentError("Оплата временно недоступна", 503);
  return url.origin;
}

export function normalizeAmount(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,6}(?:[.,]\d{1,2})?$/.test(value.trim())) throw new PaymentError("Некорректная сумма");
  const [rubles, cents = ""] = value.trim().replace(",", ".").split(".");
  const total = Number(rubles) * 100 + Number(cents.padEnd(2, "0"));
  if (total < 50_000 || total > 70_000_000) throw new PaymentError("Сумма должна быть от 500 до 700 000 рублей");
  return (total / 100).toFixed(2);
}

function mac(data: string) {
  return createHmac("sha256", env("PAYMENT_SIGNING_SECRET")).update(data).digest("base64url");
}

export function signInvoice(input: unknown, now = Date.now()) {
  const data = input as Partial<Invoice> | null;
  if (!data || typeof data.orderId !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(data.orderId)) throw new PaymentError("Укажите номер заказа");
  if (typeof data.description !== "string" || data.description.trim().length < 5 || data.description.length > 120) throw new PaymentError("Укажите услугу из заказа");
  const invoice: Invoice = { orderId: data.orderId, amount: normalizeAmount(data.amount), description: data.description.trim(), expiresAt: now + 30 * 60_000 };
  const payload = Buffer.from(JSON.stringify(invoice)).toString("base64url");
  return { invoice, token: `${payload}.${mac(`invoice:${payload}`)}` };
}

export function consultationInvoice(existingToken = "") {
  if (existingToken) {
    try {
      const invoice = verifyInvoice(existingToken);
      if (invoice.orderId.startsWith("consult-") && invoice.amount === "500.00" && invoice.description === "Онлайн-консультация") return { token: existingToken, invoice };
    } catch { /* Expired or invalid cookies cannot determine the price. */ }
  }
  return signInvoice({ orderId: `consult-${randomUUID()}`, amount: "500.00", description: "Онлайн-консультация" });
}

export function verifyInvoice(token: string, now = Date.now()): Invoice {
  if (token.length > 1500) throw new PaymentError("Неверная ссылка", 404);
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !constantEqual(signature, mac(`invoice:${payload}`))) throw new PaymentError("Неверная ссылка", 404);
  let invoice: Invoice;
  try { invoice = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { throw new PaymentError("Неверная ссылка", 404); }
  if (!invoice || typeof invoice !== "object" || Array.isArray(invoice)) throw new PaymentError("Неверная ссылка", 404);
  if (!Number.isFinite(invoice.expiresAt) || invoice.expiresAt <= now || invoice.expiresAt > now + 30 * 60_000) throw new PaymentError("Срок ссылки истёк. Запросите новую ссылку", 410);
  if (!/^[a-zA-Z0-9_-]{1,64}$/.test(invoice.orderId) || typeof invoice.description !== "string" || normalizeAmount(invoice.amount) !== invoice.amount) throw new PaymentError("Неверная ссылка", 404);
  return invoice;
}

// Same order gets the same provider key, even when the invoice is reissued.
// A changed amount/description must use a new orderId. See setup documentation.
export function idempotenceKey(orderId: string) { return mac(`payment:${orderId}`); }
export function receiptCookie(orderId: string) { return `yk_${mac(`cookie:${orderId}`).slice(0, 20)}`; }
export function signPaymentId(id: string) { return `${id}.${mac(`status:${id}`)}`; }
export function verifyPaymentId(token: string) {
  const [id, signature, extra] = token.split(".");
  if (!id || !/^[a-f0-9-]{36}$/.test(id) || !signature || extra || !constantEqual(signature, mac(`status:${id}`))) throw new PaymentError("Нет данных для проверки оплаты", 404);
  return id;
}

export async function providerRequest(path: string, body?: unknown, key?: string): Promise<Payment> {
  const shopId = env("YOOKASSA_SHOP_ID");
  const secret = env("YOOKASSA_SECRET_KEY");
  let response: Response;
  try {
    response = await fetch(`https://api.yookassa.ru/v3/${path}`, {
      method: body ? "POST" : "GET", cache: "no-store", redirect: "error",
      headers: { Authorization: `Basic ${Buffer.from(`${shopId}:${secret}`).toString("base64")}`, "Content-Type": "application/json", ...(key ? { "Idempotence-Key": key } : {}) },
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15_000),
    });
  } catch { throw new PaymentError("Сервис оплаты не ответил. Повторите попытку", 502); }
  if (!response.ok) throw new PaymentError("Не удалось обработать платёж. Обратитесь к исполнителю", 502);
  const payment = await response.json() as Payment;
  if (payment.recipient?.account_id !== shopId || (payment.test && process.env.YOOKASSA_ALLOW_TEST !== "true")) throw new PaymentError("Магазин оплаты настроен неверно", 502);
  return payment;
}

export async function createPayment(invoice: Invoice) {
  const returnUrl = new URL("/pay/result", siteOrigin());
  returnUrl.searchParams.set("order", invoice.orderId);
  const payment = await providerRequest("payments", {
    amount: { value: invoice.amount, currency: "RUB" }, capture: true,
    payment_method_data: { type: "sbp" },
    confirmation: { type: "redirect", return_url: returnUrl.toString() },
    description: `${invoice.description} · ${invoice.orderId}`,
    metadata: { source: "curvedlines-web", order_id: invoice.orderId, expected_amount: invoice.amount },
  }, idempotenceKey(invoice.orderId));
  if (payment.amount.value !== invoice.amount || payment.amount.currency !== "RUB" || payment.metadata?.order_id !== invoice.orderId) throw new PaymentError("Данные платежа не совпали с заказом", 502);
  return payment;
}

export async function verifiedPayment(id: string) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new PaymentError("Неверный платёж", 400);
  const payment = await providerRequest(`payments/${id}`);
  if (payment.id !== id || payment.metadata?.source !== "curvedlines-web" || payment.amount.currency !== "RUB" || payment.metadata.expected_amount !== payment.amount.value) throw new PaymentError("Данные платежа не совпали с заказом", 400);
  return payment;
}

export function paymentError(error: unknown) {
  return { status: error instanceof PaymentError ? error.status : 500, message: error instanceof PaymentError ? error.message : "Оплата временно недоступна" };
}

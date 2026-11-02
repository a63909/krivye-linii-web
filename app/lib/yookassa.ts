import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";
const MIN_PAYMENT_KOPECKS = 100;
const MAX_PAYMENT_KOPECKS = 70_000_000;

type YooKassaAmount = {
  value: string;
  currency: "RUB";
};

export type YooKassaPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  paid: boolean;
  amount: YooKassaAmount;
  description?: string;
  confirmation?: {
    type?: string;
    confirmation_url?: string;
  };
  metadata?: Record<string, string>;
  cancellation_details?: {
    party?: string;
    reason?: string;
  };
};

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const safeEqual = (left: string, right: string) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export const isAuthorizedInternalRequest = (authorization: string | null) => {
  const configuredToken = process.env.CONSULTATION_PAYMENT_API_TOKEN?.trim();

  if (!configuredToken || !authorization?.startsWith("Bearer ")) return false;

  return safeEqual(authorization.slice("Bearer ".length), configuredToken);
};

export const normalizeConsultationId = (value: unknown) => {
  if (typeof value !== "string") return "";

  return value.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
};

export const normalizeRubles = (value: unknown) => {
  const normalized =
    typeof value === "number"
      ? value.toFixed(2)
      : typeof value === "string"
        ? value.trim().replace(",", ".")
        : "";

  if (!/^\d{1,6}(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error("INVALID_AMOUNT");
  }

  const [rubles, kopecks = ""] = normalized.split(".");
  const totalKopecks = Number(rubles) * 100 + Number(kopecks.padEnd(2, "0"));

  if (
    !Number.isSafeInteger(totalKopecks) ||
    totalKopecks < MIN_PAYMENT_KOPECKS ||
    totalKopecks > MAX_PAYMENT_KOPECKS
  ) {
    throw new Error("INVALID_AMOUNT");
  }

  return (totalKopecks / 100).toFixed(2);
};

export const getPublicSiteUrl = () =>
  (process.env.PUBLIC_SITE_URL || "https://web.curvedlines.ru").replace(/\/$/, "");

const getBasicAuthorization = () => {
  const shopId = requiredEnv("YOOKASSA_SHOP_ID");
  const secretKey = requiredEnv("YOOKASSA_SECRET_KEY");

  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
};

const parseYooKassaResponse = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as
    | T
    | { type?: string; code?: string; description?: string }
    | null;

  if (!response.ok || !payload) {
    console.error("[yookassa] API request failed", {
      status: response.status,
      payload,
    });
    throw new Error("YOOKASSA_API_ERROR");
  }

  return payload as T;
};

export const createConsultationPayment = async ({
  amount,
  consultationId,
}: {
  amount: string;
  consultationId: string;
}) => {
  const idempotenceKey = createHash("sha256")
    .update(`consultation:${consultationId}:${amount}`)
    .digest("hex");

  const response = await fetch(`${YOOKASSA_API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthorization(),
      "Content-Type": "application/json",
      "Idempotence-Key": idempotenceKey,
    },
    body: JSON.stringify({
      amount: {
        value: amount,
        currency: "RUB",
      },
      payment_method_data: {
        type: "sbp",
      },
      confirmation: {
        type: "redirect",
        return_url: `${getPublicSiteUrl()}/consultation/payment-result`,
      },
      capture: true,
      description: `Онлайн-консультация №${consultationId}`.slice(0, 128),
      metadata: {
        consultation_id: consultationId,
      },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  return parseYooKassaResponse<YooKassaPayment>(response);
};

export const getYooKassaPayment = async (paymentId: string) => {
  if (!/^[a-zA-Z0-9-]{10,64}$/.test(paymentId)) {
    throw new Error("INVALID_PAYMENT_ID");
  }

  const response = await fetch(`${YOOKASSA_API_URL}/payments/${paymentId}`, {
    headers: {
      Authorization: getBasicAuthorization(),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  return parseYooKassaResponse<YooKassaPayment>(response);
};

const getSigningSecret = () => requiredEnv("PAYMENT_LINK_SIGNING_SECRET");

export const createCheckoutToken = (paymentId: string, expiresAt: number) => {
  const signature = createHmac("sha256", getSigningSecret())
    .update(`${paymentId}.${expiresAt}`)
    .digest("hex");

  return `${expiresAt}.${signature}`;
};

export const verifyCheckoutToken = (paymentId: string, token: string | null) => {
  if (!token) return false;

  const [expiresAtRaw, receivedSignature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Math.floor(Date.now() / 1000) ||
    !receivedSignature
  ) {
    return false;
  }

  const expectedSignature = createHmac("sha256", getSigningSecret())
    .update(`${paymentId}.${expiresAt}`)
    .digest("hex");

  return safeEqual(receivedSignature, expectedSignature);
};

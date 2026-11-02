import { createHash, timingSafeEqual } from "node:crypto";

const YOOKASSA_API_URL = "https://api.yookassa.ru/v3";
const MIN_PAYMENT_KOPECKS = 100;
const MAX_PAYMENT_KOPECKS = 70_000_000;
const POS_LINK_PAYMENT_LIFETIME_MINUTES = 10;

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
  confirmation?: { type?: string };
  payment_method?: {
    type?: string;
    qrc_id?: string;
  };
  metadata?: Record<string, string>;
  cancellation_details?: {
    party?: string;
    reason?: string;
  };
};

type YooKassaPosLink = {
  id: string;
  status: "active" | "inactive";
  payment?: {
    id: string;
    status: YooKassaPayment["status"];
  };
};

export class PosLinkBusyError extends Error {
  constructor(public readonly activePaymentId?: string) {
    super("YOOKASSA_POS_LINK_BUSY");
    this.name = "PosLinkBusyError";
  }
}

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

const getBasicAuthorization = () => {
  const shopId = requiredEnv("YOOKASSA_SHOP_ID");
  const secretKey = requiredEnv("YOOKASSA_SECRET_KEY");

  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
};

const getPosLinkId = () => {
  const posLinkId = requiredEnv("YOOKASSA_POS_LINK_ID");

  if (!/^pl-[a-zA-Z0-9-]{10,128}$/.test(posLinkId)) {
    throw new Error("Invalid YOOKASSA_POS_LINK_ID");
  }

  return posLinkId;
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
  const posLinkId = getPosLinkId();
  const posLink = await getYooKassaPosLink(posLinkId);

  if (posLink.status !== "active") {
    throw new Error("YOOKASSA_POS_LINK_INACTIVE");
  }

  if (posLink.payment?.status === "pending") {
    const activePayment = await getYooKassaPayment(posLink.payment.id);

    if (
      activePayment.metadata?.consultation_id === consultationId &&
      activePayment.amount.value === amount
    ) {
      return {
        payment: activePayment,
        posLinkId,
        expiresAt: null,
        reused: true,
      };
    }

    throw new PosLinkBusyError(posLink.payment.id);
  }

  const expiresAt = new Date(
    Date.now() + POS_LINK_PAYMENT_LIFETIME_MINUTES * 60_000,
  ).toISOString();
  const idempotenceKey = createHash("sha256")
    .update(`pos-link:${posLinkId}:consultation:${consultationId}:${amount}`)
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
      pos_link: {
        id: posLinkId,
        expires_at: expiresAt,
      },
      confirmation: {
        type: "external",
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

  const payment = await parseYooKassaResponse<YooKassaPayment>(response);

  if (payment.status === "canceled") {
    throw new PosLinkBusyError(payment.id);
  }

  return { payment, posLinkId, expiresAt, reused: false };
};

export const getYooKassaPosLink = async (posLinkId = getPosLinkId()) => {
  if (!/^pl-[a-zA-Z0-9-]{10,128}$/.test(posLinkId)) {
    throw new Error("INVALID_POS_LINK_ID");
  }

  const response = await fetch(`${YOOKASSA_API_URL}/pos_links/${posLinkId}`, {
    headers: {
      Authorization: getBasicAuthorization(),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  return parseYooKassaResponse<YooKassaPosLink>(response);
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


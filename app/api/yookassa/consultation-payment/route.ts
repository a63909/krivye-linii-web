import { NextResponse } from "next/server";
import {
  createCheckoutToken,
  createConsultationPayment,
  getPublicSiteUrl,
  isAuthorizedInternalRequest,
  normalizeConsultationId,
  normalizeRubles,
} from "../../../lib/yookassa";

export const runtime = "nodejs";

type CreatePaymentPayload = {
  consultationId?: unknown;
  amount?: unknown;
};

export async function POST(request: Request) {
  if (!isAuthorizedInternalRequest(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let payload: CreatePaymentPayload;

  try {
    payload = (await request.json()) as CreatePaymentPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректные данные" }, { status: 400 });
  }

  const consultationId = normalizeConsultationId(payload.consultationId);

  if (!consultationId) {
    return NextResponse.json(
      { ok: false, error: "Не указан идентификатор консультации" },
      { status: 400 },
    );
  }

  let amount: string;

  try {
    amount = normalizeRubles(payload.amount);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректная сумма" },
      { status: 400 },
    );
  }

  try {
    const payment = await createConsultationPayment({ amount, consultationId });
    const confirmationUrl = payment.confirmation?.confirmation_url;

    if (!confirmationUrl) {
      throw new Error("YOOKASSA_CONFIRMATION_URL_MISSING");
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = createCheckoutToken(payment.id, expiresAt);
    const checkoutUrl = new URL(
      `/consultation/checkout/${encodeURIComponent(payment.id)}`,
      getPublicSiteUrl(),
    );
    checkoutUrl.searchParams.set("token", token);

    return NextResponse.json({
      ok: true,
      consultationId,
      amount,
      paymentId: payment.id,
      status: payment.status,
      checkoutUrl: checkoutUrl.toString(),
      expiresAt: new Date(expiresAt * 1000).toISOString(),
    });
  } catch (error) {
    console.error(
      "[yookassa] Failed to create consultation payment",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, error: "Не удалось создать ссылку на оплату" },
      { status: 502 },
    );
  }
}

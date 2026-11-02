import { NextResponse } from "next/server";
import {
  createConsultationPayment,
  isAuthorizedInternalRequest,
  normalizeConsultationId,
  normalizeRubles,
  PosLinkBusyError,
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
    const { payment, expiresAt, reused } = await createConsultationPayment({
      amount,
      consultationId,
    });

    return NextResponse.json({
      ok: true,
      consultationId,
      amount,
      paymentId: payment.id,
      status: payment.status,
      paymentMode: "permanent_pos_link",
      qrCodeChanged: false,
      reused,
      expiresAt,
    });
  } catch (error) {
    if (error instanceof PosLinkBusyError) {
      return NextResponse.json(
        {
          ok: false,
          error: "По постоянному QR уже ожидается другой платёж",
          activePaymentId: error.activePaymentId || null,
        },
        { status: 409 },
      );
    }

    console.error(
      "[yookassa] Failed to create consultation payment",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json(
      { ok: false, error: "Не удалось записать сумму в постоянный QR" },
      { status: 502 },
    );
  }
}

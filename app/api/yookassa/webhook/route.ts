import { NextResponse } from "next/server";
import { getYooKassaPayment } from "../../../lib/yookassa";

export const runtime = "nodejs";

type YooKassaNotification = {
  type?: unknown;
  event?: unknown;
  object?: {
    id?: unknown;
    status?: unknown;
  };
};

const notifyInternalAgent = async (payment: Awaited<ReturnType<typeof getYooKassaPayment>>) => {
  const targetUrl = process.env.CONSULTATION_PAYMENT_STATUS_URL?.trim();

  if (!targetUrl) return;

  const parsedUrl = new URL(targetUrl);

  if (parsedUrl.protocol !== "https:") {
    throw new Error("CONSULTATION_PAYMENT_STATUS_URL must use HTTPS");
  }

  const response = await fetch(parsedUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.CONSULTATION_PAYMENT_STATUS_TOKEN
        ? { Authorization: `Bearer ${process.env.CONSULTATION_PAYMENT_STATUS_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      event: `payment.${payment.status}`,
      consultationId: payment.metadata?.consultation_id || null,
      paymentId: payment.id,
      status: payment.status,
      paid: payment.paid,
      amount: payment.amount,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Internal status endpoint returned ${response.status}`);
  }
};

export async function POST(request: Request) {
  let notification: YooKassaNotification;

  try {
    notification = (await request.json()) as YooKassaNotification;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = typeof notification.event === "string" ? notification.event : "";
  const paymentId =
    typeof notification.object?.id === "string" ? notification.object.id : "";

  if (!event.startsWith("payment.") || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  try {
    // ЮKassa does not sign the body. Re-fetching the payment with Basic Auth
    // verifies that the notification describes a real payment in this shop.
    const payment = await getYooKassaPayment(paymentId);

    if (`payment.${payment.status}` !== event) {
      return NextResponse.json({ ok: false }, { status: 409 });
    }

    await notifyInternalAgent(payment);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(
      "[yookassa] Webhook processing failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

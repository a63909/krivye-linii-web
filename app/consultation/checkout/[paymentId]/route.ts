import { NextResponse } from "next/server";
import {
  getPublicSiteUrl,
  getYooKassaPayment,
  verifyCheckoutToken,
} from "../../../lib/yookassa";

export const runtime = "nodejs";

type CheckoutContext = {
  params: Promise<{ paymentId: string }>;
};

export async function GET(request: Request, context: CheckoutContext) {
  const { paymentId } = await context.params;
  const token = new URL(request.url).searchParams.get("token");

  try {
    if (!verifyCheckoutToken(paymentId, token)) {
      return NextResponse.json({ ok: false, error: "Ссылка недействительна" }, { status: 403 });
    }

    const payment = await getYooKassaPayment(paymentId);
    const confirmationUrl = payment.confirmation?.confirmation_url;
    const resultUrl = `${getPublicSiteUrl()}/consultation/payment-result`;

    const response =
      payment.status === "pending" && confirmationUrl
        ? NextResponse.redirect(confirmationUrl)
        : NextResponse.redirect(resultUrl);

    response.cookies.set("consultation_payment_id", payment.id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/consultation",
      maxAge: 60 * 60 * 2,
    });

    return response;
  } catch (error) {
    console.error(
      "[yookassa] Checkout redirect failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return NextResponse.redirect(`${getPublicSiteUrl()}/consultation/payment-result?error=1`);
  }
}

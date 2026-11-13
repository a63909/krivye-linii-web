import { redirect } from "next/navigation";
import { resolvePaymentEntry, type PaymentEntryResolution } from "../lib/existing-order-payment";
import { PaymentError } from "../lib/yookassa";
import PaymentWaiting from "./payment-waiting";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function PaymentEntry({ searchParams }: { searchParams: Promise<{ ref?: string | string[] }> }) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref.trim() : undefined;
  let result: PaymentEntryResolution;
  try {
    if (Array.isArray(params.ref)) throw new PaymentError("Не удалось определить заявку.");
    result = await resolvePaymentEntry(reference);
  } catch (error) {
    const retryable = !(error instanceof PaymentError) || error.status >= 500;
    result = { state: retryable ? "waiting" : "blocked", retryable, message: error instanceof PaymentError ? error.message : "Не удалось загрузить платёж. Повторите попытку позже или обратитесь к продавцу." };
  }
  // Next's redirect throws a control-flow exception: keep it outside the catch.
  if (result.state === "ready" && result.confirmationUrl) redirect(result.confirmationUrl);
  return <PaymentWaiting initial={result} reference={reference} />;
}

import { findSelectedOrderPayment, type SelectedOrderPayment } from "../../lib/existing-order-payment";
import { PaymentError } from "../../lib/yookassa";
import PaymentSelection from "../payment-selection";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function ChoosePayment({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const params = await searchParams;
  let selection: SelectedOrderPayment | undefined;
  let error: string | undefined;
  try {
    if (typeof params.order !== "string") throw new PaymentError("Укажите номер сделки или её полный ID.");
    selection = await findSelectedOrderPayment(params.order);
  } catch (cause) {
    error = cause instanceof PaymentError ? cause.message : "Не удалось проверить сделку. Повторите попытку позже.";
  }
  // No provider URL is passed to the browser until the buyer confirms this deal
  // and the existing read-only resolver has revalidated its payment.
  const safeSelection = selection ? { ...selection, payment: { ...selection.payment, confirmationUrl: undefined } } : undefined;
  return <PaymentSelection selection={safeSelection} error={error} />;
}

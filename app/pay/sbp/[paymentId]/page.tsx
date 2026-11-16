import PaymentEntry from "../../page";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// A per-payment link never selects from the seller's other active deals.
// Reuse the existing read-only validation, redirect and waiting states.
export default async function PersonalPaymentEntry({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  return <PaymentEntry searchParams={Promise.resolve({ ref: `payment:${paymentId}` })} />;
}

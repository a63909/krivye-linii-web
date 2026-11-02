import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { getYooKassaPayment, type YooKassaPayment } from "../../lib/yookassa";
import styles from "./payment-result.module.css";

export const metadata: Metadata = {
  title: "Статус оплаты консультации — Кривые Линии WEB",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const statusCopy: Record<
  YooKassaPayment["status"],
  { eyebrow: string; title: string; text: string }
> = {
  succeeded: {
    eyebrow: "ОПЛАТА ПОЛУЧЕНА",
    title: "Консультация оплачена.",
    text: "Мы получили подтверждение платежа и свяжемся с вами по данным из заявки.",
  },
  pending: {
    eyebrow: "ПЛАТЁЖ ОБРАБАТЫВАЕТСЯ",
    title: "Ждём подтверждения банка.",
    text: "Обычно это занимает несколько секунд. Обновите страницу немного позже.",
  },
  waiting_for_capture: {
    eyebrow: "ПЛАТЁЖ ОБРАБАТЫВАЕТСЯ",
    title: "Ждём подтверждения.",
    text: "Платёж ещё не завершён. Обновите страницу немного позже.",
  },
  canceled: {
    eyebrow: "ОПЛАТА НЕ ПРОШЛА",
    title: "Платёж отменён.",
    text: "Деньги не списаны. Запросите новую ссылку на оплату у специалиста.",
  },
};

export default async function ConsultationPaymentResultPage() {
  const cookieStore = await cookies();
  const paymentId = cookieStore.get("consultation_payment_id")?.value;
  let payment: YooKassaPayment | null = null;

  if (paymentId) {
    try {
      payment = await getYooKassaPayment(paymentId);
    } catch (error) {
      console.error(
        "[yookassa] Failed to load payment result",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  const copy = payment
    ? statusCopy[payment.status]
    : {
        eyebrow: "СТАТУС НЕДОСТУПЕН",
        title: "Не удалось определить платёж.",
        text: "Откройте персональную ссылку на оплату ещё раз или свяжитесь с нами.",
      };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className={styles.text}>{copy.text}</p>

        {payment && (
          <dl className={styles.details}>
            <div>
              <dt>Сумма</dt>
              <dd>{payment.amount.value} ₽</dd>
            </div>
            <div>
              <dt>Номер платежа</dt>
              <dd>{payment.id}</dd>
            </div>
          </dl>
        )}

        <div className={styles.actions}>
          {payment?.status === "pending" && <a href="">Обновить статус</a>}
          <Link href="/">Вернуться на сайт</Link>
        </div>
      </section>
    </main>
  );
}

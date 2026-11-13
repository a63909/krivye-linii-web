import Link from "next/link";
import { findExistingOrderPayment, type OrderPaymentView } from "../lib/existing-order-payment";
import { PaymentError } from "../lib/yookassa";
import styles from "./payment.module.css";
import entry from "./payment-entry.module.css";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function PaymentEntry({ searchParams }: { searchParams: Promise<{ ref?: string | string[] }> }) {
  const params = await searchParams;
  const reference = typeof params.ref === "string" ? params.ref.trim() : "";
  let payment: OrderPaymentView | undefined;
  let message = "";
  if (reference) {
    try { payment = await findExistingOrderPayment(reference); }
    catch (error) {
      message = error instanceof PaymentError ? error.message : "Не удалось загрузить оплату. Повторите попытку позже или обратитесь к продавцу.";
    }
  }
  return <>
    <h1>Оплата заявки</h1>
    {payment ? <>
      <p className={styles.eyebrow}>ЗАЯВКА {payment.orderLabel}</p>
      <p className={styles.amount}>{Number(payment.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</p>
      <p role="status">{payment.message}</p>
      {payment.confirmationUrl && <a className={styles.button} href={payment.confirmationUrl} rel="noreferrer">Оплатить через СБП</a>}
      {payment.state === "pending" && <p>Проверьте заявку и сумму. На телефоне откроется выбор банка, на компьютере — QR-код оплаты.</p>}
      {payment.state === "waiting" && <a className={entry.retry} href={`/pay?ref=${encodeURIComponent(reference)}`}>Обновить статус</a>}
      <Link href="/pay" prefetch={false}>Указать другую заявку</Link>
    </> : <>
      <p>Вставьте ссылку на вашу заявку или её полный ID. Сумма подставится автоматически.</p>
      <form className={entry.form} action="/pay" method="get">
        <label className={entry.label} htmlFor="order-reference">Ссылка или ID заявки</label>
        <input className={entry.input} id="order-reference" name="ref" type="text" required maxLength={1200} autoComplete="off" autoCapitalize="none" spellCheck={false} defaultValue={reference.slice(0, 1200)} placeholder="Вставьте ссылку на заявку" aria-describedby={message ? "payment-error" : "reference-help"} />
        <p className={entry.hint} id="reference-help">Полный ID выглядит так: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. Также подойдёт платёжная ссылка из чата заявки.</p>
        {message && <p className={entry.error} id="payment-error" role="alert">{message}</p>}
        <button className={styles.button} type="submit">Найти оплату</button>
      </form>
      <p>Постоянный QR открывает эту страницу. Для каждой заявки используется её собственная сумма и платёжная ссылка.</p>
    </>}
  </>;
}

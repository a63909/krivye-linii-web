import { cookies } from "next/headers";
import Link from "next/link";
import { paymentError, receiptCookie, verifiedPayment, verifyPaymentId, type Payment } from "../../lib/yookassa";
import styles from "../payment.module.css";

export const dynamic = "force-dynamic";
export default async function Result({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  let payment: Payment | undefined;
  let message = "";
  try {
    if (!order || !/^[a-zA-Z0-9_-]{1,64}$/.test(order)) throw new Error("No order");
    const cookie = (await cookies()).get(receiptCookie(order))?.value || "";
    const verified = await verifiedPayment(verifyPaymentId(cookie));
    if (verified.metadata?.order_id !== order) throw new Error("Order mismatch");
    payment = verified;
  } catch (error) {
    const e = paymentError(error);
    message = e.status === 500 || e.status === 404 ? "Откройте страницу в том браузере, в котором начали оплату, или уточните статус у исполнителя." : e.message;
  }
  if (!payment) return <><h1>Проверка оплаты</h1><p>{message}</p><p>Сам по себе возврат на сайт не подтверждает успешную оплату.</p></>;
  const succeeded = payment.status === "succeeded" && payment.paid;
  const canceled = payment.status === "canceled";
  return <>
    <p className={styles.eyebrow}>ЗАКАЗ {order}</p>
    <h1>{succeeded ? "Оплата получена" : canceled ? "Платёж отменён" : "Ожидаем оплату"}</h1>
    <p>{succeeded ? "Спасибо. Статус подтверждён ЮKassa." : canceled ? "Запросите у исполнителя новую ссылку для оплаты." : "Если вы уже подтвердили платёж в банке, обновите страницу через несколько секунд."}</p>
    <p className={styles.amount}>{Number(payment.amount.value).toLocaleString("ru-RU")} ₽</p>
    {!succeeded && !canceled && <a className={styles.button} href={`/pay/result?order=${encodeURIComponent(order!)}`}>Проверить оплату</a>}
    <Link href="/">На главную</Link>
  </>;
}

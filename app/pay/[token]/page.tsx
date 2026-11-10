import { paymentError, verifyInvoice, type Invoice } from "../../lib/yookassa";
import styles from "../payment.module.css";

export const dynamic = "force-dynamic";
export default async function PaymentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let invoice: Invoice | undefined;
  let message = "";
  try { invoice = verifyInvoice(token); } catch (error) { message = paymentError(error).message; }
  if (!invoice) return <><h1>Ссылка недоступна</h1><p>{message}</p><a href="mailto:web@curvedlines.ru">Запросить новую ссылку</a></>;
  return <>
    <p className={styles.eyebrow}>ЗАКАЗ {invoice.orderId}</p>
    <h1>{invoice.description}</h1>
    <p>Сумма согласована с исполнителем.</p>
    <p className={styles.amount}>{Number(invoice.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽</p>
    <form action="/api/yookassa/checkout" method="post">
      <input type="hidden" name="invoice" value={token} />
      <button className={styles.button} type="submit">Оплатить через СБП</button>
    </form>
    <p>На компьютере откроется QR-код, на телефоне — выбор банка. Повторно вводить сумму не нужно.</p>
  </>;
}

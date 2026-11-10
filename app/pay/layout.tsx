import type { Metadata } from "next";
import Link from "next/link";
import styles from "./payment.module.css";

// Preserve Origin on same-site checkout POSTs without disclosing invoice URLs
// when the browser follows the redirect to the payment provider.
export const metadata: Metadata = { title: "Оплата заказа", robots: { index: false, follow: false }, referrer: "same-origin" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className={styles.shell}><Link href="/" className={styles.brand}>КРИВЫЕ ЛИНИИ / WEB</Link><section className={styles.card}>{children}</section><a href="mailto:web@curvedlines.ru">Вопрос по оплате · web@curvedlines.ru</a></main>;
}

import type { Metadata } from "next";
import Link from "next/link";
import styles from "./payment.module.css";

export const metadata: Metadata = { title: "Оплата заказа", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className={styles.shell}><Link href="/" className={styles.brand}>КРИВЫЕ ЛИНИИ / WEB</Link><section className={styles.card}>{children}</section><a href="mailto:web@curvedlines.ru">Вопрос по оплате · web@curvedlines.ru</a></main>;
}

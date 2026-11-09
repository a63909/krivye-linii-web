import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Страница не найдена",
  description: "Запрошенная страница не существует или была перемещена.",
  alternates: {},
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-kicker">КРИВЫЕ ЛИНИИ WEB / 404</p>
      <h1>Здесь линия оборвалась.</h1>
      <p>Страница не найдена. Вернитесь к нашим услугам или начните с главной.</p>
      <div>
        <Link className="button button-light" href="/">На главную <span aria-hidden="true">↗</span></Link>
        <Link href="/#services">Смотреть услуги <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}

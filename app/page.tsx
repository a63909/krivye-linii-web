import type { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "Создание сайтов под ключ и цифровых сервисов — Кривые Линии WEB",
  description:
    "Создание сайтов под ключ для бизнеса: стратегия, UX/UI-дизайн, разработка, запуск, аналитика и поддержка. Кривые Линии WEB.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: "Создание сайтов под ключ — Кривые Линии WEB",
    description:
      "Проектируем и разрабатываем сайты и цифровые сервисы для бизнеса — от стратегии и дизайна до запуска и поддержки.",
    siteName: "Кривые Линии WEB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Кривые Линии WEB — создание сайтов и цифровых сервисов",
      },
    ],
  },
};

export default function Page() {
  return <HomePage />;
}

import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
  Manrope,
  Roboto,
} from "next/font/google";
import "./globals.css";
import YandexMetrika from "./yandex-metrika";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["cyrillic", "latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://web.curvedlines.ru"),
  title: {
    default: "Кривые Линии WEB — сайты, логотипы и цифровой дизайн",
    template: "%s — Кривые Линии WEB",
  },
  description:
    "Кривые Линии WEB: сайты под ключ, логотипы, фирменный стиль, редизайн и digital-материалы для бизнеса.",
  keywords: [
    "создание сайтов",
    "веб-дизайн",
    "разработка логотипа",
    "фирменный стиль",
    "редизайн сайта",
    "Кривые Линии WEB",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    title: "Кривые Линии WEB — сайты и бренды, которые невозможно перепутать",
    description:
      "Стратегия, дизайн и код в цельной цифровой системе для вашего бизнеса.",
    siteName: "Кривые Линии WEB",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Кривые Линии WEB — веб-дизайн, разработка и айдентика",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Кривые Линии WEB",
    description: "Сайты, логотипы и цифровой дизайн для бизнеса.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.webp",
    shortcut: "/favicon.webp",
  },
};

export const viewport: Viewport = {
  themeColor: "#090b0a",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metrikaId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);

  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${manrope.variable} ${roboto.variable} antialiased`}
      >
        {children}
        {Number.isInteger(metrikaId) && metrikaId > 0 ? (
          <YandexMetrika counterId={metrikaId} />
        ) : null}
      </body>
    </html>
  );
}

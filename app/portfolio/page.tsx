import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../about/about-header";
import ProjectGrid from "./project-grid";
import { portfolioProjects } from "./projects";
import { breadcrumbJsonLd, JsonLd } from "../seo";

export const metadata: Metadata = {
  title: "Портфолио — разработанные сайты и интернет-магазины",
  description: "Готовые сайты студии Кривые Линии WEB: LUMERA, MARGÓ MAISON, АлкоТрезв, Патриот и другие проекты. Реальные экраны, состав работ и ссылки на сайты.",
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Портфолио — Кривые Линии WEB", url: "/portfolio", images: [{ url: "/images/real-projects/lumera.webp" }] },
};

export default function PortfolioPage() {
  return <div className="site-shell portfolio-shell">
    <AboutHeader active="portfolio" />
    <main className="real-portfolio-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio" }])} />
      <section className="real-portfolio-hero">
        <p className="portfolio-eyebrow">КРИВЫЕ ЛИНИИ / WEB <span>ПОРТФОЛИО</span></p>
        <div className="portfolio-title-row"><h1>Из идеи —<br />в работающий <em>сайт.</em></h1><div><span className="portfolio-count">{String(portfolioProjects.length).padStart(2, "0")}</span><p>проектов: от авторского<br />лендинга до интернет-магазина</p></div></div>
        <p className="portfolio-lead">Дизайн, который можно открыть. Сайты, которыми можно пользоваться. Показываем реальные страницы и рассказываем, что сделали.</p>
      </section>
      <section className="portfolio-projects-section" aria-label="Выполненные проекты"><ProjectGrid /></section>
      <section className="portfolio-bottom-cta"><p>СЛЕДУЮЩИЙ ПРОЕКТ — ВАШ?</p><h2>Давайте сделаем<br />что-то <em>своё.</em></h2><Link className="button button-dark" href="/#brief">Обсудить задачу ↗</Link></section>
    </main>
  </div>;
}

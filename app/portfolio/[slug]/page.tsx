/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AboutHeader from "../../about/about-header";
import { portfolioProjects } from "../projects";
import { breadcrumbJsonLd, JsonLd } from "../../seo";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return portfolioProjects.map(p => ({ slug: p.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find(p => p.slug === slug);
  return project ? { title: `${project.name} — ${project.type}`, description: project.description, alternates: { canonical: `/portfolio/${slug}` }, openGraph: { title: `${project.name} — Кривые Линии WEB`, description: project.description, url: `/portfolio/${slug}`, images: [{ url: project.image }] } } : {};
}
export default async function PortfolioCase({ params }: Props) {
  const { slug } = await params;
  const project = portfolioProjects.find(p => p.slug === slug);
  if (!project) notFound();
  const next = portfolioProjects[(portfolioProjects.indexOf(project) + 1) % portfolioProjects.length];
  return <div className="site-shell portfolio-shell">
    <AboutHeader active="portfolio" />
    <main className="real-case-page">
      <JsonLd data={breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Портфолио", path: "/portfolio" }, { name: project.name, path: `/portfolio/${slug}` }])} />
      <section className="real-case-heading"><Link className="case-back" href="/portfolio">← Все проекты</Link><p className="portfolio-eyebrow">{project.type}</p><h1>{project.name}</h1><p className="portfolio-lead">{project.description}</p><a className="button button-dark" href={project.url} target="_blank" rel="noopener noreferrer">Открыть сайт ↗</a></section>
      <figure className="real-case-image" style={{ backgroundColor: project.color }}><div className="browser-bar"><span className="browser-dots" aria-hidden="true">● ● ●</span><span>{project.domain}</span><span>↗</span></div><img src={project.image} alt={`Интерфейс сайта ${project.name}`} width={1300} height={730} fetchPriority="high" /><figcaption>Экран разработанного сайта</figcaption></figure>
      <section className="real-case-story"><p className="portfolio-eyebrow">01 / ЗАДАЧА</p><h2>{project.task}</h2></section>
      <section className="real-case-story"><p className="portfolio-eyebrow">02 / ЧТО СДЕЛАЛИ</p><div><p>{project.solution}</p><ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul></div></section>
      <section className="real-case-story"><p className="portfolio-eyebrow">03 / ПОСМОТРЕТЬ</p><div><p>{project.detail}</p><a className="text-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.domain} ↗</a></div></section>
      <section className="real-case-next"><span>Следующий проект</span><Link href={`/portfolio/${next.slug}`}>{next.name} ↗</Link><Link href="/#brief">Обсудить похожую задачу →</Link></section>
    </main>
  </div>;
}

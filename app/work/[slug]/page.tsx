/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AboutHeader from "../../about/about-header";
import { getProject, projects } from "../projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return {};

  return {
    title: `${project.name} — кейс`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url: `/work/${project.slug}`,
      title: `${project.name} — Кривые Линии WEB`,
      description: project.description,
      images: [{ url: project.gallery[0], alt: `${project.name} — дизайн-проект` }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const caseStyle = { "--case-accent": project.accent } as CSSProperties;

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    image: `https://web.curvedlines.ru${project.gallery[0]}`,
    creator: {
      "@type": "Organization",
      name: "Кривые Линии WEB",
      url: "https://web.curvedlines.ru",
    },
  };

  return (
    <div className="site-shell case-shell" style={caseStyle}>
      <AboutHeader active={null} />

      <main className="case-page">
        <section className="case-hero">
          <div className="case-hero-copy">
            <Link className="case-back" href="/#portfolio">← Все работы</Link>
            <p className="case-kicker">
              КЕЙС {String(projectIndex + 1).padStart(2, "0")} / {project.shortCategory}
            </p>
            <h1>{project.name}</h1>
            <p className="case-lead">{project.description}</p>
            <dl className="case-facts">
              <div><dt>Направление</dt><dd>{project.category}</dd></div>
              <div><dt>Формат</dt><dd>Концепция и digital-система</dd></div>
              <div><dt>Работы</dt><dd>{project.deliverables.join(" · ")}</dd></div>
            </dl>
          </div>

          <div className="case-hero-media">
            <img
              src={project.gallery[0]}
              alt={`${project.name} — ключевой экран проекта`}
              width={1586}
              height={992}
              fetchPriority="high"
            />
            <span>КРИВЫЕ ЛИНИИ / WEB</span>
          </div>
        </section>

        <section className="case-story case-section">
          <p className="case-section-label">01 / ЗАДАЧА</p>
          <div>
            <h2>{project.challengeHeading}</h2>
            <p>{project.challenge}</p>
            <p>{project.approach}</p>
          </div>
        </section>

      <section className="case-showcase" aria-label={`Детали проекта ${project.name}`}>
        <div className="case-showcase-main">
          <img src={project.gallery[0]} alt="Композиция ключевого экрана" width={1536} height={1024} />
        </div>
        <div className="case-showcase-detail case-showcase-detail-left">
          <img src={project.gallery[1]} alt="Деталь визуальной системы" width={1536} height={1024} />
        </div>
        <div className="case-showcase-detail case-showcase-detail-right">
          <img src={project.gallery[2]} alt="Деталь интерфейса" width={1536} height={1024} />
        </div>
      </section>

        <section className="case-decisions case-section">
          <p className="case-section-label">02 / РЕШЕНИЕ</p>
          <div className="case-decision-grid">
            <article>
              <span>01</span>
              <h3>Визуальное направление</h3>
              <p>{project.direction}</p>
            </article>
            <article>
              <span>02</span>
              <h3>Пользовательский опыт</h3>
              <p>{project.experience}</p>
            </article>
            <article>
              <span>03</span>
              <h3>Система развития</h3>
              <p>{project.system}</p>
            </article>
          </div>
        </section>

        <section className="case-scope">
          <div>
            <p className="case-section-label">03 / СОСТАВ РАБОТ</p>
            <h2>{project.scopeHeading}</h2>
          </div>
          <ul>
            {project.deliverables.map((item, index) => (
              <li key={item}><span>0{index + 1}</span>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-next">
          <p>Следующий кейс</p>
          <Link href={`/work/${nextProject.slug}`}>
            <span>{nextProject.shortCategory}</span>
            {nextProject.name}
            <i aria-hidden="true">↗</i>
          </Link>
        </section>

        <section className="case-cta">
          <p>Есть задача для сайта или бренда?</p>
          <h2>Обсудим её по существу.</h2>
          <Link className="button button-light" href="/#brief">
            Рассчитать проект <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>

      <footer className="case-footer">
        <p>© 2026 «Кривые Линии WEB»</p>
        <a href="mailto:web@curvedlines.ru">web@curvedlines.ru</a>
        <div><Link href="/privacy">Политика</Link><Link href="/consent">Согласие</Link></div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
    </div>
  );
}

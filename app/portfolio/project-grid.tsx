"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { portfolioProjects, type PortfolioProject } from "./projects";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  return <article className="real-project" style={{ backgroundColor: project.color }}>
    <Link href={`/portfolio/${project.slug}`} className="real-project-preview" aria-label={`Смотреть проект ${project.name}`}>
      <div className="browser-bar"><span className="browser-dots" aria-hidden="true">● ● ●</span><span>{project.domain}</span><span aria-hidden="true">↗</span></div>
      <div className="real-project-screen"><img src={project.image} width={1300} height={730} alt={`Настоящий экран сайта ${project.name}`} loading="lazy" /></div>
      <span className="preview-label">Смотреть проект ↗</span>
    </Link>
    <div className="real-project-copy">
      <p className="real-project-kind"><span>{String(index + 1).padStart(2, "0")} / {project.type}</span><span>WEB</span></p>
      <Link href={`/portfolio/${project.slug}`}><h3>{project.name}</h3></Link>
      <p className="real-project-description">{project.description}</p>
      <div className="real-project-tags">{project.scope.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="real-project-links"><Link href={`/portfolio/${project.slug}`}>Подробнее о работе <span aria-hidden="true">→</span></Link><a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Открыть сайт ${project.name} в новой вкладке`}>Открыть сайт ↗</a></div>
    </div>
  </article>;
}

export default function ProjectGrid() {
  const [category, setCategory] = useState("Все проекты");
  const categories = ["Все проекты", "Интернет-магазины", "Сайты компаний", "Лендинги", "Веб-сервисы", "Демо-проекты"];
  const selected = portfolioProjects.filter(p => category === "Все проекты" || p.category === category);
  return <>
    <div className="portfolio-filters" aria-label="Фильтр проектов">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === "Все проекты" ? portfolioProjects.length : portfolioProjects.filter(p => p.category === item).length}</span></button>)}</div>
    <div className="real-project-grid" aria-live="polite">{selected.map(project => <ProjectCard key={project.slug} project={project} index={portfolioProjects.indexOf(project)} />)}</div>
    {selected.length === 0 && <p>В этой категории пока нет проектов.</p>}
  </>;
}

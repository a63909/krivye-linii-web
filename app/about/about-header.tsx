"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function AboutHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Link className="header-brand" href="/" aria-label="Кривые Линии WEB — на главную">
        <img
          src="/images/brand/krivye-linii-web-transparent.png"
          alt="Кривые Линии WEB"
          width={1020}
          height={720}
        />
        <span className="header-brand-slogan">
          <strong>КРИВЫЕ ЛИНИИ</strong>
          <em>изгибы совершенства</em>
        </span>
      </Link>

      <nav
        className={menuOpen ? "header-nav is-open" : "header-nav"}
        id="about-navigation"
        aria-label="Главное меню"
      >
        <Link href="/#portfolio" onClick={closeMenu}>Работы</Link>
        <Link href="/#services" onClick={closeMenu}>Услуги</Link>
        <Link href="/#prices" onClick={closeMenu}>Цены</Link>
        <Link href="/#process" onClick={closeMenu}>Процесс</Link>
        <Link href="/about" aria-current="page" onClick={closeMenu}>О нас</Link>
        <Link className="header-cta" href="/#brief" onClick={closeMenu}>
          Обсудить проект <ArrowIcon />
        </Link>
      </nav>

      <button
        className={menuOpen ? "menu-button is-open" : "menu-button"}
        type="button"
        onClick={() => setMenuOpen((value) => !value)}
        aria-expanded={menuOpen}
        aria-controls="about-navigation"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <i />
        <i />
      </button>
    </header>
  );
}

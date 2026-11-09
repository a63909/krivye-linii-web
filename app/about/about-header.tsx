"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import ClientsMenu from "../clients-menu";
import ServicesMenu from "../services-menu";

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

type AboutHeaderProps = {
  active?: "about" | "clients" | "portfolio" | null;
};

export default function AboutHeader({ active = "about" }: AboutHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [clientsOpen, setClientsOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen && !servicesOpen && !clientsOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setServicesOpen(false);
        setClientsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      if (menuOpen) document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen, servicesOpen, clientsOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
    setClientsOpen(false);
  };

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
        <Link href="/portfolio" aria-current={active === "portfolio" ? "page" : undefined} onClick={closeMenu}>Портфолио</Link>
        <ServicesMenu
          id="about-services-navigation"
          open={servicesOpen}
          onToggle={() => {
            setServicesOpen((value) => !value);
            setClientsOpen(false);
          }}
          onNavigate={closeMenu}
        />
        <Link href="/#prices" onClick={closeMenu}>Цены</Link>
        <Link href="/#process" onClick={closeMenu}>Процесс</Link>
        <ClientsMenu
          id="about-clients-navigation"
          open={clientsOpen}
          active={active === "clients"}
          onToggle={() => {
            setClientsOpen((value) => !value);
            setServicesOpen(false);
          }}
          onNavigate={closeMenu}
        />
        <Link
          href="/about"
          aria-current={active === "about" ? "page" : undefined}
          onClick={closeMenu}
        >
          О нас
        </Link>
        <Link className="header-cta" href="/#brief" onClick={closeMenu}>
          Обсудить проект <ArrowIcon />
        </Link>
      </nav>

      <button
        className={menuOpen ? "menu-button is-open" : "menu-button"}
        type="button"
        onClick={() => {
          setMenuOpen((value) => !value);
          setServicesOpen(false);
          setClientsOpen(false);
        }}
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

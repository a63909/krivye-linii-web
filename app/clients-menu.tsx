"use client";

import Link from "next/link";
import { siteOperator } from "./site-operator";

type ClientsMenuProps = {
  id: string;
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

const clientLinks = [
  {
    href: "/documents#trademark",
    label: "Товарный знак",
  },
  {
    href: "/documents#project-documents",
    label: "Документы проекта",
  },
  {
    href: "/documents#details",
    label: "Реквизиты",
  },
  {
    href: "/brief",
    label: "Рассчитать проект",
  },
];

export default function ClientsMenu({
  id,
  open,
  active = false,
  onToggle,
  onNavigate,
}: ClientsMenuProps) {
  return (
    <div className={open ? "clients-menu is-open" : "clients-menu"}>
      <button
        className="clients-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-current={active ? "page" : undefined}
        onClick={onToggle}
      >
        <span>Клиентам</span>
        <span className="clients-menu-chevron" aria-hidden="true" />
      </button>

      <div className="clients-submenu" id={id}>
        {clientLinks.filter((item) => item.href !== "/documents#details" || siteOperator !== null).map((item) => (
          <Link href={item.href} key={item.href} onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

type ClientsMenuProps = {
  id: string;
  open: boolean;
  active?: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

const clientLinks = [
  {
    href: "/clients/documents",
    label: "Документы проекта",
  },
  {
    href: "/#brief",
    label: "Рассчитать проект / заполнить бриф",
  },
  {
    href: "/clients/requisites",
    label: "Реквизиты",
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
        {clientLinks.map((item) => (
          <Link href={item.href} key={item.href} onClick={onNavigate}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

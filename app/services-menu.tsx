"use client";

type ServicesMenuProps = {
  id: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

const serviceLinks = [
  "Сайты",
  "Android-приложения",
  "Цифровые сервисы",
  "Дизайн и айдентика",
];

export default function ServicesMenu({
  id,
  open,
  onToggle,
  onNavigate,
}: ServicesMenuProps) {
  return (
    <div className={open ? "clients-menu is-open" : "clients-menu"}>
      <button
        className="clients-menu-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
      >
        <span>Услуги</span>
        <span className="clients-menu-chevron" aria-hidden="true" />
      </button>

      <div className="clients-submenu" id={id}>
        {serviceLinks.map((label) => (
          <a href="#services" key={label} onClick={onNavigate}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

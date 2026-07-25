"use client";

type ServicesMenuProps = {
  id: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

const serviceLinks = [
  { label: "Сайты и интернет-магазины", href: "/services/sites" },
  { label: "Android-приложения", href: "/services/android" },
  { label: "Веб-сервисы", href: "/services/web-services" },
  { label: "UX/UI и редизайн", href: "/services/ux-ui-redesign" },
  { label: "Интеграции и автоматизация", href: "/services/integrations-automation" },
  { label: "Брендинг и поддержка", href: "/services/branding-support" },
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
        {serviceLinks.map((item) => (
          <a href={item.href} key={item.label} onClick={onNavigate}>
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

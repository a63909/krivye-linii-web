import Link from "next/link";
import { siteOperator } from "./site-operator";

const services = [
  ["Сайты и интернет-магазины", "/services/sites"],
  ["Android-приложения", "/services/android"],
  ["Веб-сервисы", "/services/web-services"],
  ["UX/UI и редизайн", "/services/ux-ui-redesign"],
  ["Интеграции и автоматизация", "/services/integrations-automation"],
  ["Брендинг и поддержка", "/services/branding-support"],
];

const navigation = [
  ["Работы", "/#portfolio"],
  ["Услуги", "/#services"],
  ["Цены", "/#prices"],
  ["Контакты", "/#brief"],
  ["О нас", "/about"],
  ["Документы", "/documents"],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <div className="footer-brand">
            <img
              src="/images/brand/krivye-linii-web-transparent.png"
              alt="Кривые Линии WEB"
              width={1020}
              height={720}
            />
          </div>
          <p>
            Проектируем цифровой образ бизнеса — от позиционирования и
            айдентики до запуска продукта и дальнейшего развития.
          </p>
          <div className="footer-tags" aria-label="Направления студии">
            <span>WEB</span>
            <span>BRAND</span>
            <span>CODE</span>
          </div>
        </div>

        <section className="footer-column footer-services-column">
          <span className="footer-column-label">Услуги</span>
          {services.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </section>

        <nav
          className="footer-column footer-navigation-column"
          aria-label="Навигация в подвале"
        >
          <span className="footer-column-label">Навигация</span>
          {navigation.map(([label, href]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <section className="footer-column footer-contact-column">
          <span className="footer-column-label">Контакты</span>
          <a className="footer-email" href="mailto:web@curvedlines.ru">
            web@curvedlines.ru
          </a>
          {siteOperator && (
            <div className="footer-legal-details">
              <strong>{siteOperator.name}</strong>
              {siteOperator.taxId && <span>ИНН {siteOperator.taxId}</span>}
              {siteOperator.address && <span>Адрес: {siteOperator.address}</span>}
            </div>
          )}
          {siteOperator?.serviceArea && <p>{siteOperator.serviceArea}</p>}
          <p className="footer-status"><i /> Принимаем новые проекты</p>
          <p>Фиксируем сроки, стоимость и этапы до начала работ.</p>
        </section>
      </div>

      <div className="footer-bottom">
        <p>© 2026 «Кривые Линии WEB». Все права защищены.</p>
        <div>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/consent">Согласие на обработку данных</Link>
        </div>
      </div>
    </footer>
  );
}

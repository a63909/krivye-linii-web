/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../about/about-header";

export const metadata: Metadata = {
  title: "Документы и реквизиты",
  description:
    "Документы, реквизиты и юридическая информация студии «Кривые Линии WEB»: сведения об исполнителе, праве на бренд и порядке работы.",
};

const requisites = [
  ["Исполнитель", "ИП Гладышев Андрей Иванович"],
  ["ИНН", "860219643299"],
  ["ОГРНИП", "3198611700068507"],
  ["Юридический адрес", "Москва, Пресненская набережная, д. 12"],
  ["Электронная почта", "web@curvedlines.ru"],
];

const workPrinciples = [
  {
    number: "01",
    title: "Договорённости фиксируем",
    text: "До старта согласовываем состав работ, этапы, сроки, стоимость и порядок оплаты. Существенные условия закрепляем письменно.",
  },
  {
    number: "02",
    title: "Работаем поэтапно",
    text: "Разделяем проект на понятные этапы и принимаем результат последовательно — без неожиданностей в финале.",
  },
  {
    number: "03",
    title: "Сохраняем конфиденциальность",
    text: "Бережно относимся к материалам и данным клиента. При необходимости заключаем отдельное соглашение о неразглашении.",
  },
];

export default function DocumentsPage() {
  return (
    <div className="site-shell documents-shell">
      <AboutHeader active={null} />

      <main className="documents-page">
        <section className="documents-hero">
          <p className="documents-kicker">ДОКУМЕНТЫ / КРИВЫЕ ЛИНИИ WEB</p>
          <div className="documents-hero-grid">
            <h1>Работаем официально. Отвечаем за договорённости.</h1>
            <div className="documents-hero-copy">
              <p>
                Здесь собраны сведения о правообладателе бренда, реквизиты
                исполнителя и документы, регулирующие работу сайта.
              </p>
              <Link className="documents-email" href="/#brief">
                web@curvedlines.ru <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="documents-hero-facts" aria-label="Ключевые сведения">
            <span><b>ИП</b> официальный исполнитель</span>
            <span><b>ТЗ</b> зарегистрированный бренд</span>
            <span><b>ДОГОВОР</b> прозрачные условия работы</span>
          </div>
        </section>

        <section className="documents-trademark documents-section">
          <div className="documents-section-heading">
            <p>01 / ПРАВО НА БРЕНД</p>
            <h2>Товарный знак «Кривые Линии» зарегистрирован.</h2>
          </div>
          <div className="documents-trademark-intro">
            <div className="documents-trademark-copy">
              <p>
                Свидетельство подтверждает государственную регистрацию
                фирменного обозначения бренда в составе зарегистрированного
                товарного знака.
              </p>
              <p>
                «Кривые Линии WEB» — цифровое направление бренда; обозначение
                WEB используется как название направления студии.
              </p>
            </div>
            <dl className="documents-trademark-meta">
              <div><dt>Свидетельство</dt><dd>№ 817637</dd></div>
              <div><dt>Заявка</dt><dd>№ 2020715764</dd></div>
              <div><dt>Приоритет</dt><dd>27.03.2020</dd></div>
              <div><dt>Регистрация</dt><dd>28.06.2021</dd></div>
              <div><dt>Срок действия</dt><dd>до 27.03.2030</dd></div>
            </dl>
          </div>

          <div className="documents-certificate-gallery">
            <figure className="documents-certificate-card">
              <figcaption className="documents-certificate-card-head">
                <span>Документ 01</span>
                <strong>Свидетельство о регистрации</strong>
              </figcaption>
              <div className="documents-certificate-frame">
                <img
                  src="/images/documents/trademark-certificate-817637.webp"
                  alt="Свидетельство на товарный знак № 817637"
                  width={1428}
                  height={2048}
                  loading="lazy"
                />
              </div>
            </figure>
            <figure className="documents-certificate-card">
              <figcaption className="documents-certificate-card-head">
                <span>Документ 02</span>
                <strong>Сведения о товарном знаке</strong>
              </figcaption>
              <div className="documents-certificate-frame">
                <img
                  src="/images/documents/trademark-record-817637.webp"
                  alt="Сведения о регистрации товарного знака № 817637"
                  width={1367}
                  height={2048}
                  loading="lazy"
                />
              </div>
            </figure>
          </div>

          <div className="documents-certificate-privacy">
            <span>Публичная версия</span>
            <p>
              Регистрационный номер и сроки действия остаются видимыми.
              Персональные адреса и подпись можно скрыть без потери
              проверяемости документа.
            </p>
          </div>
        </section>

        <section className="documents-requisites">
          <div className="documents-section-heading documents-section-heading-light">
            <p>02 / РЕКВИЗИТЫ</p>
            <h2>Сведения об исполнителе.</h2>
          </div>
          <dl className="documents-requisites-list">
            {requisites.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {label === "Электронная почта" ? (
                    <a href={`mailto:${value}`}>{value}</a>
                  ) : value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="documents-section documents-work">
          <div className="documents-section-heading">
            <p>03 / ПОРЯДОК РАБОТЫ</p>
            <h2>Понятные правила до начала проекта.</h2>
          </div>
          <div className="documents-work-grid">
            {workPrinciples.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="documents-legal">
          <div className="documents-section-heading documents-section-heading-light">
            <p>04 / ЮРИДИЧЕСКИЕ ДОКУМЕНТЫ</p>
            <h2>Правила обработки данных.</h2>
          </div>
          <div className="documents-legal-links">
            <Link href="/privacy">
              <span>01</span>
              Политика конфиденциальности
              <i aria-hidden="true">↗</i>
            </Link>
            <Link href="/consent">
              <span>02</span>
              Согласие на обработку персональных данных
              <i aria-hidden="true">↗</i>
            </Link>
          </div>
        </section>

        <section className="documents-cta">
          <p>НУЖНЫ ДОКУМЕНТЫ ДЛЯ ДОГОВОРА?</p>
          <h2>Запросите комплект — отправим актуальные реквизиты и обсудим проект.</h2>
          <Link className="button button-dark" href="/#brief">
            Написать студии <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>

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
            <p>Проектируем цифровой образ бизнеса — от позиционирования и айдентики до запуска сайта и дальнейшего развития.</p>
            <div className="footer-tags" aria-label="Направления студии">
              <span>WEB</span><span>BRAND</span><span>CODE</span>
            </div>
          </div>
          <section className="footer-column footer-services-column">
            <span className="footer-column-label">Услуги</span>
            <Link href="/#services">Сайты под ключ</Link>
            <Link href="/#services">UX/UI и редизайн</Link>
            <Link href="/#services">Логотипы и айдентика</Link>
            <Link href="/#services">Поддержка и развитие</Link>
          </section>
          <nav className="footer-column footer-navigation-column" aria-label="Навигация в подвале">
            <span className="footer-column-label">Навигация</span>
            <Link href="/#portfolio">Работы</Link>
            <Link href="/#services">Услуги</Link>
            <Link href="/#prices">Цены</Link>
            <Link href="/#brief">Контакты</Link>
            <Link href="/about">О нас</Link>
            <Link href="/documents" aria-current="page">Документы</Link>
          </nav>
          <section className="footer-column footer-contact-column">
            <span className="footer-column-label">Контакты</span>
            <a className="footer-email" href="mailto:web@curvedlines.ru">web@curvedlines.ru</a>
            <div className="footer-legal-details">
              <strong>ИП Гладышев Андрей Иванович</strong>
              <span>ИНН 860219643299</span>
              <span>ОГРНИП 3198611700068507</span>
              <span>Юридический адрес: Москва, Пресненская набережная, д. 12</span>
            </div>
            <p>Москва · работаем по России</p>
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
    </div>
  );
}

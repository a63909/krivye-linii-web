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

const documentTemplates = [
  {
    number: "01",
    title: "Договор на разработку сайта",
    description:
      "Фиксирует предмет работ, этапы, стоимость, порядок оплаты, права сторон и условия приёмки.",
    pages: "3 страницы",
    preview: "/documents/templates/contract-preview.webp",
    pdf: "/documents/templates/01_dogovor_na_razrabotku_sayta.pdf",
    docx: "/documents/templates/01_dogovor_na_razrabotku_sayta.docx",
  },
  {
    number: "02",
    title: "Техническое задание",
    description:
      "Переводит договорённости в точный состав страниц, функций, материалов, интеграций и критериев готовности.",
    pages: "4 страницы",
    preview: "/documents/templates/technical-brief-preview.webp",
    pdf: "/documents/templates/02_tehnicheskoe_zadanie.pdf",
    docx: "/documents/templates/02_tehnicheskoe_zadanie.docx",
  },
  {
    number: "03",
    title: "Смета и коммерческое предложение",
    description:
      "Показывает состав и стоимость этапов, сроки, варианты комплектации и итоговый бюджет проекта.",
    pages: "3 страницы",
    preview: "/documents/templates/estimate-preview.webp",
    pdf: "/documents/templates/03_smeta_kommercheskoe_predlozhenie.pdf",
    docx: "/documents/templates/03_smeta_kommercheskoe_predlozhenie.docx",
  },
  {
    number: "04",
    title: "Акт сдачи-приёмки",
    description:
      "Подтверждает передачу результата, завершение этапа и отсутствие замечаний по выполненным работам.",
    pages: "3 страницы",
    preview: "/documents/templates/acceptance-act-preview.webp",
    pdf: "/documents/templates/04_akt_sdachi_priemki.pdf",
    docx: "/documents/templates/04_akt_sdachi_priemki.docx",
  },
];

export default function DocumentsPage() {
  return (
    <div className="site-shell documents-shell">
      <AboutHeader active="clients" />

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

        <section
          className="documents-trademark documents-section"
          id="trademark"
        >
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

        </section>

        <section className="documents-requisites" id="details">
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

        <section
          className="documents-templates documents-section"
          id="project-documents"
        >
          <div className="documents-section-heading">
            <p>04 / ШАБЛОНЫ ДОКУМЕНТОВ</p>
            <h2>Документы, с которых начинается спокойная работа.</h2>
          </div>
          <div className="documents-templates-intro">
            <p>
              Шаблоны показывают, как мы фиксируем условия проекта. Перед
              стартом адаптируем их под задачу, состав работ и реквизиты
              клиента.
            </p>
          </div>

          <div className="documents-template-grid">
            {documentTemplates.map((document) => (
              <article
                className="documents-template-card"
                key={document.number}
              >
                <a
                  className="documents-template-preview"
                  href={document.pdf}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Открыть PDF: ${document.title}`}
                >
                  <img
                    src={document.preview}
                    alt={`Первая страница документа: ${document.title}`}
                    width={900}
                    height={1273}
                    loading="lazy"
                  />
                </a>
                <div className="documents-template-body">
                  <div className="documents-template-meta">
                    <span>{document.number}</span>
                    <span>{document.pages}</span>
                  </div>
                  <h3>{document.title}</h3>
                  <p>{document.description}</p>
                  <div className="documents-template-actions">
                    <a href={document.pdf} target="_blank" rel="noreferrer">
                      Открыть PDF <span aria-hidden="true">↗</span>
                    </a>
                    <a href={document.docx} download>
                      Скачать DOCX <span aria-hidden="true">↓</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="documents-template-bundle">
            <div>
              <span>Полный комплект / 8 файлов</span>
              <strong>PDF для просмотра и DOCX для редактирования.</strong>
            </div>
            <a
              href="/documents/templates/paket_shablonov_krivye_linii_web_complete.zip"
              download
            >
              Скачать весь комплект <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="documents-legal">
          <div className="documents-section-heading documents-section-heading-light">
            <p>05 / ЮРИДИЧЕСКИЕ ДОКУМЕНТЫ</p>
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
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../about/about-header";
import { operatorRequisites, siteOperator } from "../site-operator";

export const metadata: Metadata = {
  title: siteOperator ? "Документы и реквизиты" : "Документы",
  description: siteOperator
    ? "Документы, реквизиты и юридическая информация студии «Кривые Линии WEB»: сведения об исполнителе, праве на бренд и порядке работы."
    : "Документы студии «Кривые Линии WEB»: право на бренд, порядок работы и условия обработки данных.",
  alternates: {
    canonical: "/documents",
  },
};

const requisites = operatorRequisites();

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

const projectDocuments = [
  {
    number: "01",
    title: "Договор на разработку сайта",
    description:
      "Фиксирует предмет работ, этапы, стоимость, порядок оплаты, права сторон и условия приёмки.",
    pages: "3 страницы",
  },
  {
    number: "02",
    title: "Техническое задание",
    description:
      "Переводит договорённости в точный состав страниц, функций, материалов, интеграций и критериев готовности.",
    pages: "4 страницы",
  },
  {
    number: "03",
    title: "Смета и коммерческое предложение",
    description:
      "Показывает состав и стоимость этапов, сроки, варианты комплектации и итоговый бюджет проекта.",
    pages: "3 страницы",
  },
  {
    number: "04",
    title: "Акт сдачи-приёмки",
    description:
      "Подтверждает передачу результата, завершение этапа и отсутствие замечаний по выполненным работам.",
    pages: "3 страницы",
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
                Здесь собраны сведения о праве на бренд, порядке работы
                и документы, регулирующие работу сайта.
              </p>
              <Link className="documents-email" href="/#brief">
                web@curvedlines.ru <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
          <div className="documents-hero-facts" aria-label="Ключевые сведения">
            <span><b>ЭТАПЫ</b> понятный процесс</span>
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

        </section>

        {siteOperator && <section className="documents-requisites" id="details">
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
        </section>}

        <section className="documents-section documents-work">
          <div className="documents-section-heading">
            <p>{siteOperator ? "03" : "02"} / ПОРЯДОК РАБОТЫ</p>
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
            <p>{siteOperator ? "04" : "03"} / ДОКУМЕНТЫ ПРОЕКТА</p>
            <h2>Документы, с которых начинается спокойная работа.</h2>
          </div>
          <div className="documents-templates-intro">
            <p>
              Перед стартом согласуем договор, техническое задание и смету
              под задачу проекта. При передаче результата оформляем акт.
            </p>
          </div>

          <div className="documents-template-grid">
            {projectDocuments.map((document) => (
              <article
                className="documents-template-card"
                key={document.number}
              >
                <div className="documents-template-body">
                  <div className="documents-template-meta">
                    <span>{document.number}</span>
                    <span>{document.pages}</span>
                  </div>
                  <h3>{document.title}</h3>
                  <p>{document.description}</p>
                </div>
              </article>
            ))}
          </div>

        </section>

        <section className="documents-legal">
          <div className="documents-section-heading documents-section-heading-light">
            <p>{siteOperator ? "05" : "04"} / ЮРИДИЧЕСКИЕ ДОКУМЕНТЫ</p>
            <h2>Заказ, возврат и обработка данных.</h2>
          </div>
          <div className="documents-legal-links">
            <Link href="/terms">
              <span>01</span>
              Условия заказа, оплаты и получения
              <i aria-hidden="true">↗</i>
            </Link>
            <Link href="/refunds">
              <span>02</span>
              Условия отмены заказа и возврата денег
              <i aria-hidden="true">↗</i>
            </Link>
            <Link href="/privacy">
              <span>03</span>
              Политика конфиденциальности
              <i aria-hidden="true">↗</i>
            </Link>
            <Link href="/consent">
              <span>04</span>
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


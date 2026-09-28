/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "../../seo";
import { projects } from "../../work/projects";
import styles from "./sites.module.css";

export const metadata: Metadata = {
  title: "Создание сайтов и интернет-магазинов",
  description:
    "Создание сайтов под ключ: лендинги, корпоративные сайты и интернет-магазины — от структуры и UX/UI-дизайна до запуска, аналитики и поддержки.",
  alternates: {
    canonical: "/services/sites",
  },
  openGraph: {
    title: "Создание сайтов и интернет-магазинов — Кривые Линии WEB",
    description:
      "Создание сайтов под ключ: стратегия, UX/UI-дизайн, разработка, запуск и поддержка цифрового продукта.",
    url: "https://web.curvedlines.ru/services/sites",
    type: "website",
  },
};

const formats = [
  {
    number: "01",
    title: "Лендинг",
    text: "Сфокусированная посадочная страница для запуска продукта, услуги или рекламной кампании.",
    price: "от 59 000 ₽",
    time: "от 7 рабочих дней",
  },
  {
    number: "02",
    title: "Корпоративный сайт",
    text: "Многостраничная система, которая объясняет бизнес, собирает доверие и ведёт к обращению.",
    price: "от 120 000 ₽",
    time: "от 15 рабочих дней",
  },
  {
    number: "03",
    title: "Интернет-магазин",
    text: "Продуманная витрина с каталогом, карточками товаров, корзиной, оплатой и управлением заказами.",
    price: "после брифа",
    time: "срок после оценки",
  },
];

const scope = [
  ["Стратегия и структура", "Разбираем задачу, аудиторию и путь клиента. Формируем карту страниц и сценарии."],
  ["UX/UI-дизайн", "Проектируем понятные экраны и создаём индивидуальную визуальную систему бренда."],
  ["Адаптивная разработка", "Собираем быстрый сайт для компьютеров, планшетов и смартфонов."],
  ["Формы и интеграции", "Подключаем заявки, почту, аналитику и необходимые внешние сервисы."],
  ["SEO-основа", "Настраиваем метаданные, sitemap, robots.txt и корректную структуру заголовков."],
  ["Тестирование и запуск", "Проверяем основные сценарии, публикуем сайт и передаём рабочую систему."],
];

const process = [
  ["01", "Знакомство и бриф", "Фиксируем задачу, состав работ, ограничения, срок и бюджет."],
  ["02", "Структура и прототип", "Проектируем страницы и логику до начала визуальной части."],
  ["03", "Дизайн", "Собираем ключевую концепцию, согласуем её и развиваем на все экраны."],
  ["04", "Разработка", "Верстаем адаптивные страницы, подключаем формы и интеграции."],
  ["05", "Проверка и запуск", "Тестируем, подключаем домен, аналитику и передаём проект."],
];

const faq = [
  {
    question: "Сколько времени занимает разработка?",
    answer:
      "Лендинг обычно занимает от 7–14 рабочих дней, корпоративный сайт — от 15 рабочих дней. Интернет-магазин оцениваем после изучения каталога, интеграций и требований к оплате и доставке.",
  },
  {
    question: "Смогу ли я самостоятельно менять контент?",
    answer:
      "Да. Если проекту нужна административная панель или CMS, мы закладываем её в состав работ и заранее определяем, какие разделы вы сможете редактировать самостоятельно.",
  },
  {
    question: "Что потребуется от меня?",
    answer:
      "Краткое описание бизнеса и задачи, материалы о продукте, фирменный стиль при его наличии и один ответственный человек для согласования этапов.",
  },
  {
    question: "Что происходит после запуска?",
    answer:
      "Передаём доступы и инструкции. Поддержку, развитие, новые страницы и интеграции можно подключить отдельным этапом.",
  },
];

export default function SitesServicePage() {
  return (
    <main className={styles.page}>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Создание сайтов", path: "/services/sites" }]),
        serviceJsonLd({
          name: "Создание сайтов и интернет-магазинов",
          description: "Создание сайтов под ключ: лендинги, корпоративные сайты и интернет-магазины — от структуры и UX/UI-дизайна до запуска, аналитики и поддержки.",
          path: "/services/sites",
          serviceType: "Создание сайтов",
        }),
      ]} />
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <i aria-hidden="true" />
            САЙТЫ / E-COMMERCE / КРИВЫЕ ЛИНИИ WEB
          </p>
          <h1>
            Сайты, которые превращают внимание <em>в действие.</em>
          </h1>
          <p className={styles.lead}>
            Проектируем лендинги, корпоративные сайты и интернет-магазины —
            от структуры и дизайна до разработки, запуска и аналитики.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/#brief">
              Обсудить проект <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.textLink} href="/#portfolio">
              Смотреть работы <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>от 7 дней</strong><span>до запуска</span></div>
            <div><strong>2 версии</strong><span>desktop + mobile</span></div>
            <div><strong>под ключ</strong><span>от идеи до публикации</span></div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Примеры интерфейсов">
          <span className={styles.visualLabel}>DESIGN / CODE / LAUNCH</span>
        </div>
      </section>

      <section className={styles.formats}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionNumber}>01 / ФОРМАТЫ</p>
          <h2>Подбираем формат под задачу, а не задачу под шаблон.</h2>
          <p>
            Сначала определяем бизнес-цель и необходимый функционал. После этого
            фиксируем состав работ, цену и календарный план.
          </p>
        </div>
        <div className={styles.formatGrid}>
          {formats.map((format) => (
            <article className={styles.formatCard} key={format.number}>
              <span>{format.number}</span>
              <h3>{format.title}</h3>
              <p>{format.text}</p>
              <dl>
                <div><dt>Стоимость</dt><dd>{format.price}</dd></div>
                <div><dt>Срок</dt><dd>{format.time}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.scope}>
        <div className={styles.scopeTitle}>
          <p className={styles.sectionNumber}>02 / СОСТАВ РАБОТ</p>
          <h2>Всё необходимое для уверенного запуска.</h2>
        </div>
        <div className={styles.scopeList}>
          {scope.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.commerce}>
        <div className={styles.commerceCopy}>
          <p className={styles.sectionNumber}>03 / ИНТЕРНЕТ-МАГАЗИНЫ</p>
          <h2>Покупка должна быть короткой и понятной.</h2>
          <p className={styles.commerceLead}>
            Проектируем магазин как единый маршрут: человек быстро находит товар,
            понимает его ценность и без лишних шагов оформляет заказ.
          </p>
          <ul className={styles.commerceFeatures} aria-label="Возможности интернет-магазина">
            <li>Каталог</li>
            <li>Фильтры</li>
            <li>Поиск</li>
            <li>Карточки товаров</li>
            <li>Корзина</li>
            <li>Онлайн-оплата</li>
            <li>Доставка</li>
            <li>Личный кабинет</li>
            <li>Перенос товаров</li>
            <li>Аналитика</li>
          </ul>
          <Link className={styles.commerceButton} href="/#brief">
            Рассчитать магазин <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className={styles.commerceVisual} aria-label="Пример дизайна интернет-магазина VELA">
          <div className={styles.shopWindow}>
            <div className={styles.shopTop}>
              <strong>VELA</strong>
              <span>Каталог&nbsp;&nbsp; Подписка&nbsp;&nbsp; О бренде</span>
              <i>02</i>
            </div>
            <img
              src="/images/services/sites/commerce-vela.webp"
              alt="Интернет-магазин кофе VELA"
            />
            <div className={styles.shopPanel}>
              <div>
                <small>ETHIOPIA</small>
                <strong>Guji Natural</strong>
                <span>1 290 ₽</span>
              </div>
              <span>Карточка товара / 01</span>
            </div>
          </div>
          <div className={styles.cartCard}>
            <span>КОРЗИНА</span>
            <b>2 товара</b>
            <strong>2 580 ₽</strong>
            <i>Оплата подключена ✓</i>
          </div>
        </div>
      </section>

      <section className={styles.cases}>
        <div className={styles.casesHeader}>
          <div>
            <p className={styles.sectionNumber}>04 / ВЫБРАННЫЕ РАБОТЫ</p>
            <h2>Система важнее отдельного красивого экрана.</h2>
          </div>
          <Link href="/#portfolio">Все работы <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.caseGrid}>
          {projects.map((project, index) => (
            <Link className={styles.caseCard} href={`/work/${project.slug}`} key={project.slug}>
              <div className={styles.caseImage}>
                <img src={project.image} alt={`${project.name} — дизайн-проект`} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className={styles.caseMeta}>
                <div>
                  <p>{project.category}</p>
                  <h3>{project.name}</h3>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processIntro}>
          <p className={styles.sectionNumber}>05 / ПРОЦЕСС</p>
          <h2>Прозрачный маршрут от задачи до работающего сайта.</h2>
          <p>Каждый этап имеет понятный результат. Вы видите движение проекта и принимаете решения до следующего шага.</p>
        </div>
        <div className={styles.processList}>
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.faq}>
        <div>
          <p className={styles.sectionNumber}>06 / ВОПРОСЫ</p>
          <h2>До старта всё должно быть понятно.</h2>
        </div>
        <div className={styles.faqList}>
          {faq.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.sectionNumber}>СЛЕДУЮЩИЙ ШАГ</p>
        <h2>Расскажите о задаче — соберём понятный план проекта.</h2>
        <p>Предварительно оценим состав работ, сроки и бюджет без обязательств с вашей стороны.</p>
        <Link href="/#brief">Сформировать заявку <span aria-hidden="true">↗</span></Link>
      </section>
    </main>
  );
}

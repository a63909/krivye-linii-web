/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import { projects } from "../../work/projects";
import styles from "./sites.module.css";

export const metadata: Metadata = {
  title: "Сайты и интернет-магазины",
  description:
    "Проектируем и разрабатываем лендинги, корпоративные сайты и интернет-магазины: от структуры и дизайна до запуска, аналитики и поддержки.",
  alternates: {
    canonical: "/services/sites",
  },
  openGraph: {
    title: "Сайты и интернет-магазины — Кривые Линии WEB",
    description:
      "Стратегия, UX/UI-дизайн, разработка и запуск цифровых продуктов для бизнеса.",
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
          <div className={styles.visualMain}>
            <img src={projects[0].image} alt="Интерфейс сайта Northline Residence" />
          </div>
          <div className={styles.visualSide}>
            <img src={projects[2].image} alt="Интерфейс платформы Atlas Node" />
          </div>
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

      <section className={styles.cases}>
        <div className={styles.casesHeader}>
          <div>
            <p className={styles.sectionNumber}>03 / ВЫБРАННЫЕ РАБОТЫ</p>
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
          <p className={styles.sectionNumber}>04 / ПРОЦЕСС</p>
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
          <p className={styles.sectionNumber}>05 / ВОПРОСЫ</p>
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
              айдентики до запуска сайта и дальнейшего развития.
            </p>
            <div className="footer-tags" aria-label="Компетенции">
              <span>WEB</span><span>BRAND</span><span>CODE</span>
            </div>
          </div>

          <section className="footer-column footer-services-column">
            <span className="footer-column-label">Услуги</span>
            <Link href="/services/sites">Сайты и интернет-магазины</Link>
            <Link href="/#services">UX/UI и редизайн</Link>
            <Link href="/#services">Логотипы и айдентика</Link>
            <Link href="/#services">Поддержка и развитие</Link>
          </section>

          <nav className="footer-column footer-navigation" aria-label="Навигация в подвале">
            <span className="footer-column-label">Навигация</span>
            <Link href="/#portfolio">Работы</Link>
            <Link href="/#services">Услуги</Link>
            <Link href="/#prices">Цены</Link>
            <Link href="/#process">Процесс</Link>
            <Link href="/about">О нас</Link>
          </nav>

          <section className="footer-column footer-contact-column">
            <span className="footer-column-label">Новый проект</span>
            <Link className="footer-email" href="/#brief">Обсудить задачу ↗</Link>
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
    </main>
  );
}

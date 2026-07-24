/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import siteStyles from "../sites/sites.module.css";
import styles from "./android.module.css";

export const metadata: Metadata = {
  title: "Разработка Android-приложений",
  description:
    "Проектируем и разрабатываем Android-приложения для клиентов, сотрудников и новых цифровых сервисов — от прототипа до публикации и поддержки.",
  alternates: { canonical: "/services/android" },
  openGraph: {
    title: "Android-приложения — Кривые Линии WEB",
    description: "Стратегия, UX/UI, Kotlin-разработка, интеграции, тестирование и выпуск Android-продукта.",
    url: "https://web.curvedlines.ru/services/android",
    type: "website",
  },
};

const formats = [
  { number: "01", title: "MVP продукта", text: "Первая рабочая версия с ключевым сценарием — чтобы проверить идею на реальных пользователях.", estimate: "после брифа", time: "от 4 недель" },
  { number: "02", title: "Клиентский сервис", text: "Личный кабинет, заказы, оплата, уведомления и поддержка клиента в одном приложении.", estimate: "после прототипа", time: "от 6 недель" },
  { number: "03", title: "Внутренний инструмент", text: "Мобильное рабочее место для сотрудников, выездных команд, контроля процессов и данных.", estimate: "после оценки", time: "от 5 недель" },
];

const scope = [
  ["Исследование и сценарии", "Определяем роли пользователей, задачи, ограничения и главный маршрут внутри продукта."],
  ["Прототип и UX", "Собираем логику экранов и проверяем сценарии до начала визуального дизайна и разработки."],
  ["UI и дизайн-система", "Создаём узнаваемый интерфейс, компоненты, состояния и правила для дальнейшего роста продукта."],
  ["Android-разработка", "Собираем нативное приложение на Kotlin с понятной архитектурой и контролем качества кода."],
  ["API и интеграции", "Подключаем авторизацию, платежи, карты, уведомления, аналитику и внешние сервисы."],
  ["Тестирование и релиз", "Проверяем ключевые устройства и сценарии, готовим материалы и сопровождаем публикацию."],
];

const useCases = [
  { number: "01", title: "Личный кабинет", text: "Заказы, документы, статусы, обращения и персональные предложения.", label: "CLIENT SERVICE" },
  { number: "02", title: "Запись и бронирование", text: "Расписание, выбор специалиста, оплата и напоминания без звонков.", label: "BOOKING" },
  { number: "03", title: "Доставка и торговля", text: "Каталог, корзина, оплата, отслеживание и повторные покупки.", label: "COMMERCE" },
  { number: "04", title: "Работа в поле", text: "Задачи, маршруты, фотоотчёты и синхронизация данных сотрудников.", label: "OPERATIONS" },
];

const process = [
  ["01", "Бриф и аналитика", "Фиксируем бизнес-задачу, пользователей, функции первой версии, срок и бюджет."],
  ["02", "Прототип", "Проектируем навигацию, состояния и ключевые пользовательские сценарии."],
  ["03", "Визуальная система", "Создаём интерфейс и набор компонентов для всех основных экранов."],
  ["04", "Разработка", "Собираем приложение, серверные связи и необходимые интеграции."],
  ["05", "Тестирование и выпуск", "Проверяем продукт, готовим сборку, публикацию и план дальнейшего развития."],
];

const faq = [
  { question: "Сколько стоит Android-приложение?", answer: "Стоимость зависит от количества ролей, экранов, интеграций и серверной части. После короткого брифа мы выделяем состав первой версии и готовим прозрачную оценку по этапам." },
  { question: "Можно начать с небольшой версии?", answer: "Да. Чаще всего разумно начать с MVP: оставить один главный сценарий, выпустить рабочую версию и развивать продукт на основе реального использования." },
  { question: "Вы помогаете с публикацией?", answer: "Да. Подготавливаем сборку и материалы, проверяем технические требования и сопровождаем выпуск в согласованный магазин приложений." },
  { question: "Что будет после запуска?", answer: "Передаём доступы и документацию. Поддержку, аналитику, новые функции и развитие приложения можно подключить следующим этапом." },
];

export default function AndroidServicePage() {
  return (
    <main className={siteStyles.page}>
      <AboutHeader active={null} />

      <section className={`${siteStyles.hero} ${styles.hero}`}>
        <div className={siteStyles.heroCopy}>
          <p className={siteStyles.eyebrow}><i aria-hidden="true" />ANDROID / KOTLIN / MOBILE PRODUCT</p>
          <h1>Android-приложения, которыми <em>удобно пользоваться.</em></h1>
          <p className={siteStyles.lead}>Проектируем и разрабатываем мобильные продукты для клиентов, сотрудников и новых бизнес-моделей — от первого сценария до релиза.</p>
          <div className={siteStyles.heroActions}>
            <Link className={siteStyles.primaryButton} href="/#brief">Обсудить приложение <span aria-hidden="true">↗</span></Link>
            <a className={siteStyles.textLink} href="#possibilities">Что можно запустить <span aria-hidden="true">↓</span></a>
          </div>
          <div className={siteStyles.heroFacts}>
            <div><strong>Kotlin</strong><span>нативная разработка</span></div>
            <div><strong>от 4 недель</strong><span>первая версия</span></div>
            <div><strong>под ключ</strong><span>от идеи до релиза</span></div>
          </div>
        </div>

        <div className={`${siteStyles.heroVisual} ${styles.heroVisual}`} aria-label="Концепция Android-приложения">
          <div className={styles.orbit} aria-hidden="true" />
          <div className={`${styles.phone} ${styles.phoneBack}`} aria-hidden="true">
            <div className={styles.phoneBar}><i /><span>09:41</span><b>● ●</b></div>
            <div className={styles.backScreen}><span>ПРОЕКТ / 04</span><strong>72%</strong><i /><p>Прогресс на этой неделе</p></div>
          </div>
          <div className={styles.phone}>
            <div className={styles.phoneBar}><i /><span>09:41</span><b>5G&nbsp; 88%</b></div>
            <div className={styles.appHeader}><div><small>ДОБРОЕ УТРО</small><strong>Алексей</strong></div><span>АГ</span></div>
            <div className={styles.balanceCard}><small>БАЛАНС ПРОЕКТА</small><strong>184 250 ₽</strong><div><span>+12.8%</span><i>за месяц</i></div></div>
            <div className={styles.quickGrid}><span><i>↗</i><b>Оплатить</b></span><span><i>＋</i><b>Добавить</b></span><span><i>⌁</i><b>История</b></span></div>
            <div className={styles.activity}>
              <div><strong>Активность</strong><span>Неделя⌄</span></div>
              <div className={styles.chart} aria-hidden="true">{[36, 54, 43, 72, 58, 86, 68].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
            </div>
            <div className={styles.bottomNav} aria-hidden="true"><b>●</b><span>□</span><span>◇</span><span>○</span></div>
          </div>
          <span className={`${siteStyles.visualLabel} ${styles.visualLabel}`}>PRODUCT / DESIGN / DEVELOPMENT</span>
        </div>
      </section>

      <section className={siteStyles.formats}>
        <div className={siteStyles.sectionIntro}>
          <p className={siteStyles.sectionNumber}>01 / ФОРМАТЫ</p>
          <h2>Начинаем с продукта, а не со списка экранов.</h2>
          <p>Выбираем объём первой версии под задачу бизнеса и заранее отделяем обязательные функции от тех, которые можно добавить после запуска.</p>
        </div>
        <div className={siteStyles.formatGrid}>
          {formats.map((format) => <article className={siteStyles.formatCard} key={format.number}>
            <span>{format.number}</span><h3>{format.title}</h3><p>{format.text}</p>
            <dl><div><dt>Оценка</dt><dd>{format.estimate}</dd></div><div><dt>Срок</dt><dd>{format.time}</dd></div></dl>
          </article>)}
        </div>
      </section>

      <section className={`${siteStyles.scope} ${styles.scope}`}>
        <div className={siteStyles.scopeTitle}><p className={siteStyles.sectionNumber}>02 / СОСТАВ РАБОТ</p><h2>Полный цикл мобильного продукта в одной системе.</h2></div>
        <div className={siteStyles.scopeList}>{scope.map(([title, text], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

      <section className={styles.product}>
        <div className={styles.productCopy}>
          <p className={siteStyles.sectionNumber}>03 / МОБИЛЬНЫЙ ОПЫТ</p>
          <h2>Не сайт в маленьком экране, а самостоятельный продукт.</h2>
          <p>Учитываем жесты, состояния, системную навигацию, слабую сеть и реальные привычки пользователей Android. Каждый экран продолжает понятный сценарий, а не существует сам по себе.</p>
          <ul><li>Material-паттерны</li><li>Светлая и тёмная темы</li><li>Push-уведомления</li><li>Работа без сети</li><li>Биометрия</li><li>Аналитика событий</li></ul>
          <Link href="/#brief">Рассчитать приложение <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.flow} aria-label="Пользовательский сценарий приложения">
          <div className={styles.flowCard}><span>01 / ВХОД</span><strong>Быстрый старт</strong><p>Биометрия или PIN-код</p><i>→</i></div>
          <div className={`${styles.flowCard} ${styles.flowCardActive}`}><span>02 / ДЕЙСТВИЕ</span><strong>Главная задача</strong><p>Один ясный маршрут</p><i>→</i></div>
          <div className={styles.flowCard}><span>03 / РЕЗУЛЬТАТ</span><strong>Понятный итог</strong><p>Результат и дальнейшее действие</p><i>✓</i></div>
        </div>
      </section>

      <section className={styles.possibilities} id="possibilities">
        <div className={styles.possibilitiesHeader}><p className={siteStyles.sectionNumber}>04 / СЦЕНАРИИ</p><h2>Что можно превратить в приложение.</h2><p>Не ограничиваемся отраслью — проектируем вокруг задачи и ежедневного поведения пользователя.</p></div>
        <div className={styles.useCaseGrid}>{useCases.map((item) => <article key={item.number}><div><span>{item.number}</span><i>{item.label}</i></div><h3>{item.title}</h3><p>{item.text}</p><b aria-hidden="true">↗</b></article>)}</div>
      </section>

      <section className={`${siteStyles.process} ${styles.process}`}>
        <div className={siteStyles.processIntro}><p className={siteStyles.sectionNumber}>05 / ПРОЦЕСС</p><h2>От идеи до установленного приложения.</h2><p>На каждом этапе есть конкретный результат, который можно проверить до перехода к следующему.</p></div>
        <div className={siteStyles.processList}>{process.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className={siteStyles.faq}>
        <div><p className={siteStyles.sectionNumber}>06 / ВОПРОСЫ</p><h2>До старта всё должно быть понятно.</h2></div>
        <div className={siteStyles.faqList}>{faq.map((item, index) => <details key={item.question} open={index === 0}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className={`${siteStyles.finalCta} ${styles.finalCta}`}>
        <p className={siteStyles.sectionNumber}>СЛЕДУЮЩИЙ ШАГ</p><h2>Расскажите идею — выделим сильную первую версию.</h2><p>Поможем определить главный сценарий, состав функций, порядок этапов и предварительный бюджет.</p>
        <Link href="/#brief">Обсудить приложение <span aria-hidden="true">↗</span></Link>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand-block"><div className="footer-brand"><img src="/images/brand/krivye-linii-web-transparent.png" alt="Кривые Линии WEB" width={1020} height={720} /></div><p>Проектируем цифровой образ бизнеса — от позиционирования и айдентики до запуска продукта и дальнейшего развития.</p><div className="footer-tags" aria-label="Компетенции"><span>WEB</span><span>BRAND</span><span>CODE</span></div></div>
          <section className="footer-column footer-services-column"><span className="footer-column-label">Услуги</span><Link href="/services/sites">Сайты и интернет-магазины</Link><Link href="/services/android">Android-приложения</Link><Link href="/#services">Веб-сервисы</Link><Link href="/#services">UX/UI и редизайн</Link></section>
          <nav className="footer-column footer-navigation" aria-label="Навигация в подвале"><span className="footer-column-label">Навигация</span><Link href="/#portfolio">Работы</Link><Link href="/#services">Услуги</Link><Link href="/#prices">Цены</Link><Link href="/#process">Процесс</Link><Link href="/about">О нас</Link></nav>
          <section className="footer-column footer-contact-column"><span className="footer-column-label">Новый проект</span><Link className="footer-email" href="/#brief">Обсудить задачу ↗</Link><p>Москва · работаем по России</p><p className="footer-status"><i /> Принимаем новые проекты</p><p>Фиксируем сроки, стоимость и этапы до начала работ.</p></section>
        </div>
        <div className="footer-bottom"><p>© 2026 «Кривые Линии WEB». Все права защищены.</p><div><Link href="/privacy">Политика конфиденциальности</Link><Link href="/consent">Согласие на обработку данных</Link></div></div>
      </footer>
    </main>
  );
}
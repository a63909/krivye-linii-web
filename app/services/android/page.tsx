/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import styles from "./android.module.css";

export const metadata: Metadata = {
  title: "Разработка Android-приложений",
  description: "Проектируем и разрабатываем Android-приложения для клиентов, сотрудников и новых цифровых сервисов — от прототипа до публикации и поддержки.",
  alternates: { canonical: "/services/android" },
  openGraph: { title: "Android-приложения — Кривые Линии WEB", description: "Стратегия, UX/UI, Kotlin-разработка, интеграции, тестирование и выпуск Android-продукта.", url: "https://web.curvedlines.ru/services/android", type: "website" },
};

const process = [
  { number: "01", title: "Исследуем и проектируем", text: "Аналитика, пользовательские сценарии и UX/UI-дизайн." },
  { number: "02", title: "Собираем и разрабатываем", text: "Архитектура, Kotlin, Jetpack Compose и интеграции." },
  { number: "03", title: "Тестируем и улучшаем", text: "QA, производительность и безопасность продукта." },
  { number: "04", title: "Запускаем и развиваем", text: "Публикация, аналитика и поддержка после релиза." },
  { number: "05", title: "Масштабируем без потери качества", text: "Новые функции, оптимизация и рост аудитории." },
];

const formats = [
  { number: "01", title: "MVP продукта", text: "Первая рабочая версия с одним сильным сценарием — чтобы проверить идею на реальных пользователях.", time: "от 4 недель" },
  { number: "02", title: "Клиентский сервис", text: "Личный кабинет, заказы, оплата, уведомления и поддержка клиента в одном приложении.", time: "после прототипа" },
  { number: "03", title: "Внутренний инструмент", text: "Мобильное рабочее место для сотрудников, выездных команд и контроля процессов.", time: "после оценки" },
];

const possibilities = [
  ["01", "Личный кабинет", "Заказы, документы, обращения и персональные предложения."],
  ["02", "Запись и бронирование", "Расписание, выбор специалиста, оплата и напоминания."],
  ["03", "Доставка и торговля", "Каталог, корзина, отслеживание и повторные покупки."],
  ["04", "Работа в поле", "Задачи, маршруты, фотоотчёты и синхронизация данных."],
];

const faq = [
  { question: "Сколько стоит Android-приложение?", answer: "Стоимость зависит от количества ролей, экранов, интеграций и серверной части. После короткого брифа выделяем состав первой версии и готовим прозрачную оценку по этапам." },
  { question: "Можно начать с небольшой версии?", answer: "Да. Чаще всего разумно начать с MVP: оставить один главный сценарий, выпустить рабочую версию и развивать продукт на основе реального использования." },
  { question: "Вы помогаете с публикацией?", answer: "Да. Подготавливаем сборку и материалы, проверяем технические требования и сопровождаем выпуск в Google Play." },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

export default function AndroidServicePage() {
  return (
    <main className={styles.page}>
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i aria-hidden="true" />ANDROID / УСЛУГИ / MOBILE PRODUCT</p>
          <h1>Android-<br />приложения,<br />которыми<br /><em>удобно пользоваться.</em></h1>
          <p className={styles.heroLead}>Проектируем и разрабатываем мобильные продукты для бизнеса, сопоставимые по качеству с лучшими в мире.</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="/#brief">Обсудить приложение <span aria-hidden="true">↗</span></Link>
            <a className={styles.secondaryLink} href="#process">Что можем запустить <span aria-hidden="true">→</span></a>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>Kotlin</strong><span>основной язык</span></div>
            <div><strong>от 4 недель</strong><span>первая версия</span></div>
            <div><strong>под ключ</strong><span>от идеи до выпуска</span></div>
          </div>
          <div className={styles.palette} aria-label="Палитра страницы">
            <i className={styles.swatchPaper} /><i className={styles.swatchYellow} /><i className={styles.swatchLavender} /><i className={styles.swatchPink} />
            <span>LAVENDER / PINK / ACID YELLOW</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <Image src="/images/services/android/hero-collage.png" alt="Коллаж из Android-смартфона и экранов приложения: баланс, прогресс и подборки" fill priority sizes="(max-width: 900px) 100vw, 58vw" />
          <span className={styles.visualNumber}>01</span>
          <span className={styles.visualCaption}>PRODUCT / DESIGN / DEVELOPMENT</span>
        </div>
      </section>

      <section className={styles.process} id="process">
        <div className={styles.processHeading}>
          <div><SectionLabel>КАК МЫ РАБОТАЕМ</SectionLabel><h2>Путь продукта —<br />под вашим бизнесом.</h2></div>
          <p>Выбираем подходящий путь: от быстрого MVP до масштабируемой платформы. Берём на себя исследование, проектирование, разработку и выпуск.</p>
          <Link href="/#brief" aria-label="Обсудить проект">↗</Link>
        </div>
        <div className={styles.processGrid}>{process.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>

      <section className={styles.experience}>
        <div className={styles.experienceCopy}>
          <SectionLabel>01 / ПОДХОД</SectionLabel>
          <h2>Делаем приложения, которые люди возвращаются открывать.</h2>
          <p>Соединяем дизайн и технологии, чтобы каждая функция была понятной, каждая деталь — на своём месте, а продукт решал настоящие задачи бизнеса и пользователей.</p>
        </div>
        <div className={styles.typographicMark} aria-hidden="true">A</div>
        <dl className={styles.experienceFacts}>
          <div><dt>Kotlin</dt><dd>нативная разработка</dd></div>
          <div><dt>Compose</dt><dd>современный интерфейс</dd></div>
          <div><dt>Google Play</dt><dd>публикация и развитие</dd></div>
        </dl>
      </section>

      <section className={styles.formats}>
        <div className={styles.formatsIntro}>
          <SectionLabel>02 / ФОРМАТЫ</SectionLabel>
          <h2>Начинаем с продукта, а не со списка экранов.</h2>
          <p>Выделяем обязательные функции первой версии и оставляем понятный путь для дальнейшего роста.</p>
        </div>
        <div className={styles.formatGrid}>{formats.map((format) => <article key={format.number}><span>{format.number}</span><h3>{format.title}</h3><p>{format.text}</p><strong>{format.time}</strong></article>)}</div>
      </section>

      <section className={styles.possibilities}>
        <div className={styles.possibilitiesHeading}>
          <SectionLabel>03 / СЦЕНАРИИ</SectionLabel>
          <h2>Что можно превратить в приложение.</h2>
          <p>Проектируем вокруг ежедневной задачи пользователя — без лишних экранов и сложных маршрутов.</p>
        </div>
        <div className={styles.possibilitiesGrid}>{possibilities.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true">↗</i></article>)}</div>
      </section>

      <section className={styles.faq}>
        <div><SectionLabel>04 / ВОПРОСЫ</SectionLabel><h2>До старта всё должно быть понятно.</h2></div>
        <div className={styles.faqList}>{faq.map((item, index) => <details key={item.question} open={index === 0}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.androidPanel} aria-hidden="true">
          <Image
            src="/images/services/android/cta-android-head-v2.png"
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 43vw"
          />
          <div className={styles.androidPanelText}>
            <span>ANDROID / MOBILE PRODUCT</span>
            <strong>DESIGN × CODE<br />FOR REAL USE.</strong>
            <small>KOTLIN / JETPACK COMPOSE / 01</small>
          </div>
        </div>
        <div className={styles.finalCtaCopy}>
          <SectionLabel>СЛЕДУЮЩИЙ ШАГ</SectionLabel>
          <h2>Обсудим ваше приложение?</h2>
          <p>Поймём задачу, предложим подход и оценим сроки. Первичная консультация — без обязательств.</p>
          <Link href="/#brief">Обсудить проект <span aria-hidden="true">↗</span></Link>
          <div><span>Или напишите нам</span><a href="mailto:hello@kl-w.ru">hello@kl-w.ru</a><a href="tel:+74952150648">+7 495 215-06-48</a></div>
        </div>
      </section>
    </main>
  );
}


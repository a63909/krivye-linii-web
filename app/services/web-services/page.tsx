import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "../../seo";
import styles from "./web-services.module.css";

export const metadata: Metadata = {
  title: "Разработка веб-сервисов",
  description:
    "Проектируем и разрабатываем личные кабинеты, B2B-порталы, CRM, системы бронирования и внутренние веб-сервисы для бизнеса.",
  alternates: { canonical: "/services/web-services" },
  openGraph: {
    title: "Веб-сервисы — Кривые Линии WEB",
    description:
      "Аналитика, UX/UI, разработка, интеграции и запуск цифровых сервисов под бизнес-процессы.",
    url: "https://web.curvedlines.ru/services/web-services",
    type: "website",
  },
};

const process = [
  ["01", "Разбираем процесс", "Фиксируем роли, правила, данные и точки, где бизнес теряет время."],
  ["02", "Проектируем сценарии", "Собираем структуру сервиса и проверяем ключевые действия на прототипе."],
  ["03", "Разрабатываем ядро", "Создаём интерфейс, серверную часть, роли, права доступа и интеграции."],
  ["04", "Запускаем и улучшаем", "Переносим данные, обучаем команду и развиваем продукт по аналитике."],
];

const scenarios = [
  ["Личный кабинет", "Заказы, документы, платежи, обращения и история взаимодействия в одном месте.", "CLIENT / 01"],
  ["B2B-портал", "Каталог, индивидуальные цены, остатки, счета и повторные закупки без ручной переписки.", "PARTNER / 02"],
  ["Внутренняя система", "Задачи, согласования, статусы и отчётность для сотрудников и руководителей.", "TEAM / 03"],
  ["Сервис бронирования", "Расписание, загрузка ресурсов, оплата, уведомления и управление заявками.", "BOOKING / 04"],
];

const stack = [
  "Личные кабинеты",
  "Роли и права",
  "CRM и ERP",
  "Платежи",
  "Документы",
  "Уведомления",
  "API-интеграции",
  "Аналитика",
];

const faq = [
  {
    question: "Сколько времени занимает разработка?",
    answer:
      "Первую рабочую версию обычно запускаем от шести недель. Срок зависит от количества ролей, сценариев, интеграций и готовности исходных данных.",
  },
  {
    question: "Можно начать с одного бизнес-процесса?",
    answer:
      "Да. Это самый практичный путь: выбираем процесс с понятным эффектом, выпускаем первую версию и расширяем сервис после реального использования.",
  },
  {
    question: "Вы подключаете внешние системы?",
    answer:
      "Да. Интегрируем сервис с CRM, ERP, телефонией, платёжными системами, доставкой, аналитикой и другими платформами через API.",
  },
  {
    question: "Что будет после запуска?",
    answer:
      "Остаёмся на связи, следим за стабильностью, исправляем найденные проблемы и планируем развитие продукта по данным и обратной связи.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

export default function WebServicesPage() {
  return (
    <main className={styles.page}>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Веб-сервисы", path: "/services/web-services" }]),
        serviceJsonLd({
          name: "Разработка веб-сервисов",
          description: "Проектирование и разработка личных кабинетов, B2B-порталов, CRM, систем бронирования и внутренних веб-сервисов.",
          path: "/services/web-services",
          serviceType: "Разработка веб-сервисов",
        }),
      ]} />
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i />WEB SERVICES / BUSINESS SYSTEMS</p>
          <h1>
            Веб-сервисы,
            <br />которые держат
            <br />бизнес <em>в движении.</em>
          </h1>
          <p className={styles.heroLead}>
            Создаём личные кабинеты, B2B-порталы и внутренние системы,
            которые связывают людей, данные и ежедневные процессы.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#brief">Обсудить сервис <span>↗</span></Link>
            <a href="#scenarios">Смотреть сценарии <span>↓</span></a>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>от 6 недель</strong><span>первая версия</span></div>
            <div><strong>API-first</strong><span>готов к интеграциям</span></div>
            <div><strong>под ключ</strong><span>от логики до запуска</span></div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Интерфейс системы управления заказами">
          <div className={styles.visualTop}>
            <span>OPERATIONS / LIVE</span>
            <strong>24 JUL · 20:48</strong>
          </div>
          <div className={styles.dashboard}>
            <div className={styles.dashboardHeader}>
              <div><i /><i /><i /></div>
              <span>control.curvedlines</span>
              <b>KL</b>
            </div>
            <div className={styles.dashboardBody}>
              <aside>
                <b>КОНТРОЛЬ</b>
                <span className={styles.active}>Обзор</span>
                <span>Заказы</span>
                <span>Клиенты</span>
                <span>Документы</span>
                <span>Команда</span>
                <small>Система работает</small>
              </aside>
              <div className={styles.dashboardMain}>
                <header><div><small>СЕГОДНЯ</small><strong>Центр управления</strong></div><button>+ Создать</button></header>
                <div className={styles.metrics}>
                  <article><span>В работе</span><strong>128</strong><small>+12 за день</small></article>
                  <article><span>Оборот</span><strong>2,84 млн</strong><small>+18,4%</small></article>
                  <article><span>Срок</span><strong>94%</strong><small>выполнено вовремя</small></article>
                </div>
                <div className={styles.chartCard}>
                  <div><b>Динамика операций</b><span>30 дней</span></div>
                  <div className={styles.chart}>
                    {[42, 56, 48, 68, 61, 79, 73, 91, 82, 96, 88, 104].map((height, index) => (
                      <i key={index} style={{ height }} />
                    ))}
                  </div>
                </div>
                <div className={styles.queue}>
                  <div><b>Последние заявки</b><span>Все заявки →</span></div>
                  <p><i className={styles.green} /><b>KL-2048</b><span>Новый договор</span><small>В работе</small></p>
                  <p><i className={styles.blue} /><b>KL-2047</b><span>Подключение клиента</span><small>Проверка</small></p>
                  <p><i className={styles.pink} /><b>KL-2046</b><span>Счёт и документы</span><small>Готово</small></p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.floatCard}>
            <span>AUTOMATION / 07</span>
            <strong>−32%</strong>
            <p>ручных операций</p>
          </div>
          <div className={styles.visualIndex}>01 / SYSTEM</div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.sectionIntro}>
          <SectionLabel>01 / КАК МЫ РАБОТАЕМ</SectionLabel>
          <h2>Сначала — логика.<br />Потом интерфейс и код.</h2>
          <p>Не переносим хаос в красивую оболочку. Разбираемся в процессе и собираем систему, которой действительно будут пользоваться.</p>
        </div>
        <div className={styles.processGrid}>
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.scenarios} id="scenarios">
        <div className={styles.scenariosHeading}>
          <SectionLabel>02 / СЦЕНАРИИ</SectionLabel>
          <h2>Один сервис.<br />Конкретная задача.</h2>
        </div>
        <div className={styles.scenarioGrid}>
          {scenarios.map(([title, text, code], index) => (
            <article key={title}>
              <div><span>{code}</span><b>0{index + 1}</b></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.product}>
        <div className={styles.productCopy}>
          <SectionLabel>03 / ПРОДУКТ В РАБОТЕ</SectionLabel>
          <h2>Всё важное —<br />на одном экране.</h2>
          <p>
            Руководитель видит показатели, команда — свои задачи,
            клиент — результат. Каждый получает нужный уровень доступа
            без лишних таблиц и пересылок.
          </p>
          <div className={styles.tagList}>
            {stack.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className={styles.productUi}>
          <div className={styles.productBar}><span>WORKSPACE / PROJECT 24</span><b>•••</b></div>
          <div className={styles.productCanvas}>
            <div className={styles.sideRail}><i>KL</i><span>⌂</span><span>◇</span><span>◎</span><span>□</span></div>
            <div className={styles.workspace}>
              <header><div><small>ПРОЕКТ / NORTHLINE</small><strong>Запуск нового объекта</strong></div><button>Поделиться ↗</button></header>
              <div className={styles.progressLine}><span style={{ width: "72%" }} /></div>
              <div className={styles.workspaceGrid}>
                <article><small>ПРОГРЕСС</small><strong>72%</strong><p>18 из 25 задач завершено</p></article>
                <article><small>КОМАНДА</small><strong>08</strong><p>специалистов в проекте</p></article>
                <article className={styles.activity}><small>АКТИВНОСТЬ</small><div>{[28, 45, 38, 62, 54, 81, 66, 92].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div></article>
              </div>
              <div className={styles.tasks}><b>Ближайшие задачи</b><span>Прототип кабинета <i>Сегодня</i></span><span>Интеграция с CRM <i>25 июля</i></span><span>Тест ролей доступа <i>28 июля</i></span></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.architecture}>
        <div className={styles.architectureHeading}>
          <SectionLabel>04 / АРХИТЕКТУРА</SectionLabel>
          <h2>Соединяем сервис<br />с вашим бизнесом.</h2>
          <p>Проектируем архитектуру так, чтобы продукт было удобно поддерживать, интегрировать и развивать после первого запуска.</p>
        </div>
        <div className={styles.systemMap}>
          <div className={styles.core}><small>CORE / 01</small><strong>Ваш веб-сервис</strong><span>данные · роли · процессы</span></div>
          <div className={styles.connector} />
          <div className={styles.nodes}>
            <article><span>01</span><b>CRM / ERP</b><small>клиенты и сделки</small></article>
            <article><span>02</span><b>Платежи</b><small>счета и операции</small></article>
            <article><span>03</span><b>Документы</b><small>ЭДО и подпись</small></article>
            <article><span>04</span><b>Аналитика</b><small>события и отчёты</small></article>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div>
          <SectionLabel>05 / ВОПРОСЫ</SectionLabel>
          <h2>До старта<br />проекта.</h2>
        </div>
        <div className={styles.faqList}>
          {faq.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>{item.question}<span>+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.ctaSignal} aria-hidden="true">
          <span>WEB / SYSTEM / 24</span>
          <div><i /><i /><i /><i /><i /><i /></div>
          <strong>READY</strong>
        </div>
        <div className={styles.ctaCopy}>
          <SectionLabel>СЛЕДУЮЩИЙ ШАГ</SectionLabel>
          <h2>Обсудим ваш<br />веб-сервис?</h2>
          <p>Поймём процесс, определим первую версию и подготовим оценку по этапам.</p>
          <Link href="/#brief">Обсудить проект <span>↗</span></Link>
          <div><small>ИЛИ НАПИШИТЕ НАМ</small><a href="mailto:hello@kl-w.ru">hello@kl-w.ru</a><a href="tel:+74952150648">+7 495 215-06-48</a></div>
        </div>
      </section>
    </main>
  );
}

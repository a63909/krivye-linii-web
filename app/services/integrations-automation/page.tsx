import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import styles from "./integrations-automation.module.css";

export const metadata: Metadata = {
  title: "Интеграции и автоматизация",
  description:
    "Связываем CRM, ERP, сайты, платежи, документы и уведомления. Автоматизируем повторяющиеся операции и обмен данными между системами.",
  alternates: { canonical: "/services/integrations-automation" },
  openGraph: {
    title: "Интеграции и автоматизация — Кривые Линии WEB",
    description:
      "Объединяем цифровые системы бизнеса и убираем ручную работу из ежедневных процессов.",
    url: "https://web.curvedlines.ru/services/integrations-automation",
    type: "website",
  },
};

const scenarios = [
  ["01", "Заявка → CRM", "Передаём обращения с сайта, распределяем по менеджерам и запускаем нужный сценарий."],
  ["02", "Заказ → учёт", "Синхронизируем товары, остатки, цены, оплаты и статусы между магазином и ERP."],
  ["03", "Событие → уведомление", "Отправляем клиентам и команде письма, сообщения и документы без ручного контроля."],
  ["04", "Данные → отчёт", "Собираем показатели из разных источников в единую понятную панель."],
];

const process = [
  ["01", "Аудит", "Описываем текущий процесс, системы, данные, ошибки и ручные операции."],
  ["02", "Схема", "Проектируем обмен данными, правила, исключения и контрольные точки."],
  ["03", "Интеграция", "Настраиваем API, очереди, преобразование данных и защищённый доступ."],
  ["04", "Проверка", "Тестируем штатные и аварийные сценарии, повторы и восстановление обмена."],
  ["05", "Запуск", "Включаем поэтапно, наблюдаем за работой и передаём документацию."],
];

const systems = [
  "CRM",
  "1С / ERP",
  "Интернет-магазин",
  "Платёжные системы",
  "Телефония",
  "Доставка",
  "ЭДО",
  "Мессенджеры",
  "Аналитика",
  "Собственные API",
];

const faq = [
  {
    question: "Можно интегрировать систему без готового API?",
    answer:
      "Часто можно. Сначала проверяем доступные способы обмена: файлы, вебхуки, база данных, почта или промежуточный шлюз. После аудита предлагаем безопасный и поддерживаемый вариант.",
  },
  {
    question: "Что произойдёт, если одна из систем недоступна?",
    answer:
      "Закладываем очередь, повторные попытки, журнал ошибок и уведомления ответственным. Данные не должны теряться из-за временного сбоя внешнего сервиса.",
  },
  {
    question: "Можно автоматизировать только один участок?",
    answer:
      "Да. Обычно начинаем с операции, которая отнимает больше всего времени или чаще всего приводит к ошибкам, измеряем эффект и расширяем решение.",
  },
  {
    question: "Вы поддерживаете интеграцию после запуска?",
    answer:
      "Да. Следим за журналами обмена, реагируем на изменения внешних API и развиваем сценарии вместе с бизнесом.",
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className={styles.label}>{children}</p>;
}

export default function IntegrationsAutomationPage() {
  return (
    <main className={styles.page}>
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i />INTEGRATIONS / AUTOMATION / API</p>
          <h1>
            Системы,
            <br />которые работают
            <br /><em>как единое целое.</em>
          </h1>
          <p className={styles.heroLead}>
            Соединяем сервисы, данные и команды. Убираем двойной ввод,
            ручные переносы и операции, которые можно доверить системе.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#brief">Обсудить интеграцию <span>↗</span></Link>
            <a href="#scenarios">Смотреть сценарии <span>↓</span></a>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>API / WEBHOOK</strong><span>обмен в реальном времени</span></div>
            <div><strong>24 / 7</strong><span>контроль процессов</span></div>
            <div><strong>без потерь</strong><span>очереди и журнал событий</span></div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Схема интеграции цифровых систем">
          <div className={styles.visualMeta}><span>FLOW MAP / LIVE</span><span>01 — 08</span></div>
          <div className={styles.flowGrid}>
            <article className={styles.source}>
              <small>INPUT / 01</small>
              <strong>Сайт</strong>
              <span>новая заявка</span>
              <i />
            </article>
            <article className={styles.crm}>
              <small>CORE / 02</small>
              <strong>CRM</strong>
              <span>сделка создана</span>
              <i />
            </article>
            <article className={styles.erp}>
              <small>DATA / 03</small>
              <strong>ERP</strong>
              <span>заказ принят</span>
              <i />
            </article>
            <article className={styles.payment}>
              <small>PAY / 04</small>
              <strong>Оплата</strong>
              <span>платёж подтверждён</span>
              <i />
            </article>
            <article className={styles.notify}>
              <small>OUTPUT / 05</small>
              <strong>Клиент</strong>
              <span>уведомление отправлено</span>
              <i />
            </article>
          </div>
          <div className={styles.flowLines} aria-hidden="true">
            <i /><i /><i /><i /><b /><b /><b /><b />
          </div>
          <div className={styles.coreNode}>
            <small>AUTOMATION CORE</small>
            <strong>KL</strong>
            <span>12 процессов активно</span>
          </div>
          <div className={styles.eventLog}>
            <header><span>EVENT LOG</span><b>LIVE</b></header>
            <p><i />20:48:12 <span>lead.created</span><b>200 OK</b></p>
            <p><i />20:48:13 <span>crm.synced</span><b>200 OK</b></p>
            <p><i />20:48:15 <span>invoice.sent</span><b>200 OK</b></p>
          </div>
          <div className={styles.visualCaption}>DATA MOVES / BUSINESS GROWS</div>
        </div>
      </section>

      <section className={styles.effect}>
        <div className={styles.effectIntro}>
          <Label>01 / РЕЗУЛЬТАТ</Label>
          <h2>Меньше рутины.<br />Больше контроля.</h2>
          <p>Автоматизация снимает нагрузку с команды и делает процесс прозрачным: видно, что произошло, где находятся данные и кто отвечает за следующий шаг.</p>
        </div>
        <div className={styles.effectGrid}>
          <article><strong>−68%</strong><span>ручных операций</span><p>Данные переходят между системами автоматически.</p></article>
          <article><strong>×3</strong><span>быстрее обработка</span><p>События запускают нужные действия без ожидания.</p></article>
          <article><strong>100%</strong><span>история обмена</span><p>Каждое действие записывается и доступно для проверки.</p></article>
        </div>
      </section>

      <section className={styles.scenarios} id="scenarios">
        <div className={styles.scenariosHeading}>
          <Label>02 / СЦЕНАРИИ</Label>
          <h2>Связываем событие<br />с нужным действием.</h2>
        </div>
        <div className={styles.scenarioGrid}>
          {scenarios.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div className={styles.miniFlow}><i /><b>→</b><i /><b>→</b><i /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.control}>
        <div className={styles.controlCopy}>
          <Label>03 / КОНТРОЛЬ</Label>
          <h2>Автоматизация<br />без чёрного ящика.</h2>
          <p>
            Добавляем мониторинг, журнал событий и понятные статусы.
            Если внешний сервис недоступен, система сохраняет данные,
            повторяет операцию и сообщает ответственному.
          </p>
          <ul>
            <li><span>01</span>Очереди и повторные попытки</li>
            <li><span>02</span>Проверка и преобразование данных</li>
            <li><span>03</span>Уведомления об ошибках</li>
            <li><span>04</span>История каждого события</li>
          </ul>
        </div>
        <div className={styles.monitor}>
          <div className={styles.monitorTop}><span>INTEGRATION MONITOR</span><b>ALL SYSTEMS NORMAL</b></div>
          <div className={styles.monitorBody}>
            <aside><strong>KL</strong><span>Обзор</span><span>Потоки</span><span>События</span><span>Ошибки</span><small>v.2.8.4</small></aside>
            <div className={styles.monitorMain}>
              <header><div><small>СЕГОДНЯ / 24 ИЮЛЯ</small><strong>Потоки данных</strong></div><button>+ Новый поток</button></header>
              <div className={styles.statusCards}>
                <article><small>ОБРАБОТАНО</small><strong>12 840</strong><span>+18% за сутки</span></article>
                <article><small>В ОЧЕРЕДИ</small><strong>24</strong><span>среднее 1,8 сек</span></article>
                <article><small>ОШИБКИ</small><strong>0.03%</strong><span>3 требуют внимания</span></article>
              </div>
              <div className={styles.monitorChart}>
                <div><b>События в минуту</b><span>24 часа</span></div>
                <div>{[32, 46, 38, 62, 74, 56, 89, 68, 95, 78, 104, 86, 116, 93, 122, 106].map((h, i) => <i key={i} style={{ height: h }} />)}</div>
              </div>
              <div className={styles.flowTable}>
                <div><b>Активные потоки</b><span>Статус</span></div>
                <p><i />Сайт → CRM → Email <b>Работает</b></p>
                <p><i />Магазин → ERP → Доставка <b>Работает</b></p>
                <p><i />CRM → Аналитика <b>Работает</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processIntro}>
          <Label>04 / КАК ВНЕДРЯЕМ</Label>
          <h2>От ручной операции<br />до стабильного потока.</h2>
          <p>Проектируем интеграцию вместе с владельцами процесса и запускаем поэтапно, чтобы не останавливать текущую работу.</p>
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

      <section className={styles.connections}>
        <div className={styles.connectionCopy}>
          <Label>05 / СИСТЕМЫ</Label>
          <h2>Подключаем то,<br />чем вы уже пользуетесь.</h2>
          <p>Работаем с готовыми API и создаём промежуточные сервисы, когда стандартного подключения недостаточно.</p>
        </div>
        <div className={styles.systemList}>
          {systems.map((system, index) => <div key={system}><span>{String(index + 1).padStart(2, "0")}</span><strong>{system}</strong><i>↗</i></div>)}
        </div>
      </section>

      <section className={styles.faq}>
        <div>
          <Label>06 / ВОПРОСЫ</Label>
          <h2>До запуска<br />интеграции.</h2>
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
        <div className={styles.ctaGraphic} aria-hidden="true">
          <span>AUTOMATION / READY</span>
          <div className={styles.ctaNodes}><i /><i /><i /><i /><i /><b /></div>
          <strong>FLOW</strong>
          <small>CONNECT / AUTOMATE / CONTROL</small>
        </div>
        <div className={styles.ctaCopy}>
          <Label>СЛЕДУЮЩИЙ ШАГ</Label>
          <h2>Обсудим ваш<br />процесс?</h2>
          <p>Покажите, где команда работает вручную, — предложим схему автоматизации и план запуска.</p>
          <Link href="/#brief">Обсудить задачу <span>↗</span></Link>
          <div><small>ИЛИ НАПИШИТЕ НАМ</small><a href="mailto:hello@kl-w.ru">hello@kl-w.ru</a><a href="tel:+74952150648">+7 495 215-06-48</a></div>
        </div>
      </section>
    </main>
  );
}

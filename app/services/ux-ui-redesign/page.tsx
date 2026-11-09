import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "../../seo";
import styles from "./ux-ui-redesign.module.css";

export const metadata: Metadata = {
  title: "UX/UI-дизайн и редизайн",
  description:
    "Проектируем интерфейсы и обновляем цифровые продукты: UX-аудит, прототипы, UI-дизайн, дизайн-системы и сопровождение разработки.",
  alternates: { canonical: "/services/ux-ui-redesign" },
  openGraph: {
    title: "UX/UI и редизайн — Кривые Линии WEB",
    description:
      "Превращаем сложные продукты в понятные интерфейсы, которыми удобно пользоваться и легко управлять.",
    url: "https://web.curvedlines.ru/services/ux-ui-redesign",
    type: "website",
  },
};

const problems = [
  ["01", "Пользователи теряются", "Непонятная навигация, перегруженные экраны и лишние шаги мешают выполнить главное действие."],
  ["02", "Продукт выглядит устаревшим", "Интерфейс не соответствует уровню компании и снижает доверие к сервису."],
  ["03", "Команда делает всё заново", "Нет единой системы компонентов, правил и состояний — разработка становится медленнее."],
  ["04", "Изменения не дают результата", "Решения принимаются по вкусу, а не на основе сценариев, данных и бизнес-задач."],
];

const steps = [
  ["01", "Погружаемся", "Изучаем продукт, аудиторию, аналитику, ограничения и цели бизнеса."],
  ["02", "Находим точки роста", "Проводим UX-аудит, разбираем сценарии и определяем приоритеты."],
  ["03", "Проектируем", "Создаём структуру, пользовательские потоки и интерактивный прототип."],
  ["04", "Собираем визуальную систему", "Разрабатываем UI-концепцию, компоненты, состояния и адаптивы."],
  ["05", "Передаём в разработку", "Готовим макеты, спецификации и сопровождаем реализацию до выпуска."],
];

const deliverables = [
  ["UX-аудит", "Карта проблем, приоритеты и конкретные рекомендации без абстрактных советов."],
  ["Прототип", "Проверяемая логика продукта до дорогостоящей разработки интерфейса."],
  ["UI-дизайн", "Готовые экраны для desktop и mobile со всеми ключевыми состояниями."],
  ["Дизайн-система", "Компоненты, стили и правила, которые ускоряют развитие продукта."],
  ["Поддержка", "Ответы разработчикам, проверка реализации и развитие новых сценариев."],
  ["Документация", "Описание поведения, состояний и логики сложных элементов интерфейса."],
];

const faq = [
  {
    question: "Можно сделать редизайн без полной переделки продукта?",
    answer:
      "Да. Сначала определяем критичные сценарии и обновляем их поэтапно. Так продукт продолжает работать, а команда получает измеримый результат без рискованного большого запуска.",
  },
  {
    question: "Вы работаете с уже существующей дизайн-системой?",
    answer:
      "Да. Можем провести аудит, устранить разрозненность, дополнить недостающие компоненты и описать правила использования для дизайнеров и разработчиков.",
  },
  {
    question: "Как понять, что новый интерфейс стал лучше?",
    answer:
      "До начала работы фиксируем цели и показатели: завершение сценария, конверсию, количество ошибок, время выполнения задачи или нагрузку на поддержку.",
  },
  {
    question: "Можно заказать только UX-аудит?",
    answer:
      "Да. Вы получите самостоятельный документ с проблемами, приоритетами и решениями, который можно реализовать своей командой или продолжить вместе с нами.",
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className={styles.label}>{children}</p>;
}

export default function UxUiRedesignPage() {
  return (
    <main className={styles.page}>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "UX/UI-дизайн и редизайн", path: "/services/ux-ui-redesign" }]),
        serviceJsonLd({
          name: "UX/UI-дизайн и редизайн",
          description: "UX-аудит, проектирование пользовательских сценариев, интерфейсов и дизайн-систем для новых и существующих цифровых продуктов.",
          path: "/services/ux-ui-redesign",
          serviceType: "UX/UI-дизайн",
        }),
      ]} />
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i />UX/UI / PRODUCT DESIGN / REDESIGN</p>
          <h1>
            Интерфейсы,
            <br />в которых всё
            <br /><em>на своём месте.</em>
          </h1>
          <p className={styles.heroLead}>
            Проектируем новые продукты и переосмысливаем существующие —
            от пользовательской логики до детальной дизайн-системы.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#brief">Обсудить интерфейс <span>↗</span></Link>
            <a href="#approach">Как мы работаем <span>↓</span></a>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>от 10 дней</strong><span>UX-аудит</span></div>
            <div><strong>desktop + mobile</strong><span>адаптивные состояния</span></div>
            <div><strong>Figma + UI kit</strong><span>готово к разработке</span></div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Сравнение старого и нового интерфейса">
          <div className={styles.visualMeta}><span>INTERFACE STUDY</span><span>01 / 06</span></div>
          <div className={styles.beforeCard}>
            <header><span>BEFORE / 01</span><b>•••</b></header>
            <div className={styles.beforeNav}><i /><i /><i /><i /></div>
            <div className={styles.beforeContent}>
              <div className={styles.oldTitle} />
              <div className={styles.oldText} />
              <div className={styles.oldTextShort} />
              <div className={styles.oldBoxes}><i /><i /><i /><i /><i /><i /></div>
            </div>
            <strong className={styles.beforeMark}>×</strong>
          </div>
          <div className={styles.afterCard}>
            <header><span>AFTER / 02</span><b>KL / PRODUCT</b></header>
            <div className={styles.afterBody}>
              <aside><strong>K</strong><i /><i /><i /><i /></aside>
              <div className={styles.afterMain}>
                <div className={styles.afterHeading}><span>ПРОЕКТ / 24</span><strong>Добрый день,<br />Алексей.</strong></div>
                <div className={styles.afterStats}>
                  <article><small>БАЛАНС</small><b>184 250 ₽</b><span>+12% за месяц</span></article>
                  <article><small>ЗАДАЧИ</small><b>08</b><span>2 требуют внимания</span></article>
                </div>
                <div className={styles.afterChart}>
                  <div><span>Активность</span><small>Последние 7 дней</small></div>
                  <div>{[26, 48, 39, 68, 57, 86, 72, 95].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
                </div>
                <div className={styles.afterRows}><span><i />Прототип согласован <b>Сегодня</b></span><span><i />Компоненты обновлены <b>Вчера</b></span></div>
              </div>
            </div>
          </div>
          <div className={styles.scoreCard}>
            <small>USABILITY SCORE</small>
            <strong>92</strong>
            <span>+34 после редизайна</span>
          </div>
          <div className={styles.visualCaption}>LOGIC → SYSTEM → INTERFACE</div>
        </div>
      </section>

      <section className={styles.diagnosis}>
        <div className={styles.diagnosisHeading}>
          <Label>01 / КОГДА НУЖЕН РЕДИЗАЙН</Label>
          <h2>Красиво — недостаточно.<br />Интерфейс должен работать.</h2>
          <p>Редизайн нужен не ради нового цвета. Он решает конкретные проблемы продукта, пользователей и команды.</p>
        </div>
        <div className={styles.problemGrid}>
          {problems.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.transformation}>
        <div className={styles.transformCopy}>
          <Label>02 / ДО И ПОСЛЕ</Label>
          <h2>Убираем шум.<br />Оставляем главное.</h2>
          <p>
            Перестраиваем не только внешний вид. Уточняем иерархию,
            сокращаем путь пользователя и делаем состояния системы предсказуемыми.
          </p>
          <ul>
            <li><span>01</span>Главное действие видно сразу</li>
            <li><span>02</span>Информация собрана по приоритету</li>
            <li><span>03</span>Ошибки объясняют следующий шаг</li>
            <li><span>04</span>Интерфейс одинаково понятен на всех экранах</li>
          </ul>
        </div>
        <div className={styles.transformVisual}>
          <div className={styles.rulerTop}>{Array.from({ length: 20 }).map((_, i) => <i key={i} />)}</div>
          <div className={styles.wireframe}>
            <span>WIREFRAME / FLOW 03</span>
            <div className={styles.wireHeader}><i /><i /></div>
            <div className={styles.wireHero}><strong /><i /></div>
            <div className={styles.wireGrid}><i /><i /><i /></div>
            <div className={styles.wireFooter}><i /><i /></div>
          </div>
          <div className={styles.colorPanel}>
            <span>UI / FINAL 04</span>
            <div className={styles.uiHeader}><b>NORTHLINE</b><i>MENU</i></div>
            <div className={styles.uiPhoto}>
              <small>RESIDENCE / 2026</small>
              <strong>Пространство<br />для новой жизни.</strong>
              <button>Смотреть проект ↗</button>
            </div>
            <div className={styles.uiBottom}><span>ЛОКАЦИЯ / МОСКВА</span><b>01 — 08</b></div>
          </div>
          <div className={styles.note}>STRUCTURE<br />BEFORE STYLE</div>
        </div>
      </section>

      <section className={styles.approach} id="approach">
        <div className={styles.approachIntro}>
          <Label>03 / ПРОЦЕСС</Label>
          <h2>От гипотезы<br />до готового продукта.</h2>
          <p>Каждый этап заканчивается понятным результатом, который можно проверить, согласовать и передать дальше.</p>
        </div>
        <div className={styles.stepGrid}>
          {steps.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.system}>
        <div className={styles.systemCopy}>
          <Label>04 / ДИЗАЙН-СИСТЕМА</Label>
          <h2>Один язык<br />для всего продукта.</h2>
          <p>Создаём набор компонентов и правил, с которым новые экраны собираются быстрее и остаются визуально цельными.</p>
          <div className={styles.systemFacts}>
            <div><strong>40+</strong><span>базовых компонентов</span></div>
            <div><strong>12</strong><span>ключевых состояний</span></div>
            <div><strong>AA</strong><span>контраст и доступность</span></div>
          </div>
        </div>
        <div className={styles.componentBoard}>
          <div className={styles.boardTop}><span>DESIGN SYSTEM / CORE</span><b>v2.4</b></div>
          <div className={styles.boardGrid}>
            <article className={styles.typeSample}><small>TYPOGRAPHY</small><strong>Aa</strong><span>48 / 56</span></article>
            <article className={styles.colorSample}><small>COLOR</small><div><i /><i /><i /><i /></div></article>
            <article className={styles.buttonSample}><small>BUTTONS</small><button>Основное действие</button><button>Вторичное</button></article>
            <article className={styles.inputSample}><small>INPUTS</small><label>Email<input value="hello@company.ru" readOnly /></label><span>Данные сохранены</span></article>
            <article className={styles.cardSample}><small>CARDS</small><div><span>Проект</span><strong>Northline</strong><i>↗</i></div></article>
            <article className={styles.stateSample}><small>STATES</small><div><i />Готово</div><div><i />В работе</div><div><i />Ошибка</div></article>
          </div>
        </div>
      </section>

      <section className={styles.result}>
        <div className={styles.resultHeading}>
          <Label>05 / ЧТО ВЫ ПОЛУЧАЕТЕ</Label>
          <h2>Не набор макетов.<br />Рабочую систему.</h2>
        </div>
        <div className={styles.resultGrid}>
          {deliverables.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.faq}>
        <div>
          <Label>06 / ВОПРОСЫ</Label>
          <h2>Перед началом<br />редизайна.</h2>
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
          <span>REDESIGN / 01</span>
          <strong>R</strong>
          <div><i /><i /><i /></div>
          <small>CLARITY / SYSTEM / GROWTH</small>
        </div>
        <div className={styles.ctaCopy}>
          <Label>СЛЕДУЮЩИЙ ШАГ</Label>
          <h2>Обсудим ваш<br />интерфейс?</h2>
          <p>Покажите продукт — мы обозначим точки роста и предложим понятный план работы.</p>
          <Link href="/#brief">Обсудить проект <span>↗</span></Link>
          <div><small>ИЛИ НАПИШИТЕ НАМ</small><a href="mailto:hello@kl-w.ru">hello@kl-w.ru</a><a href="tel:+74952150648">+7 495 215-06-48</a></div>
        </div>
      </section>
    </main>
  );
}

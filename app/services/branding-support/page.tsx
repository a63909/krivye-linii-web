import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import { breadcrumbJsonLd, JsonLd, serviceJsonLd } from "../../seo";
import styles from "./branding-support.module.css";

export const metadata: Metadata = {
  title: "Брендинг и поддержка",
  description:
    "Создаём айдентику, визуальные системы и бренд-материалы. Поддерживаем сайты и цифровые продукты после запуска.",
  alternates: { canonical: "/services/branding-support" },
  openGraph: {
    title: "Брендинг и поддержка — Кривые Линии WEB",
    description:
      "Формируем узнаваемый образ бизнеса и помогаем цифровым проектам оставаться актуальными после запуска.",
    url: "https://web.curvedlines.ru/services/branding-support",
    type: "website",
  },
};

const identity = [
  ["01", "Позиционирование", "Фиксируем характер бренда, аудиторию, ценность и отличия от конкурентов."],
  ["02", "Логотип и знак", "Создаём узнаваемую основу, которая работает в цифровой и печатной среде."],
  ["03", "Визуальный язык", "Типографика, цвет, графика, изображения и правила композиции."],
  ["04", "Носители", "Сайт, презентации, документы, соцсети, упаковка и деловые материалы."],
];

const support = [
  ["Контент и страницы", "Добавляем новые разделы, проекты, услуги и материалы без потери общей системы."],
  ["Дизайн-поддержка", "Готовим баннеры, презентации, документы и визуалы для регулярных задач."],
  ["Развитие продукта", "Проектируем новые сценарии и интерфейсы по мере роста бизнеса."],
  ["Техническая поддержка", "Следим за стабильностью, обновлениями, формами, интеграциями и скоростью."],
];

const stages = [
  ["01", "Контекст", "Изучаем продукт, рынок, аудиторию и существующий визуальный образ."],
  ["02", "Направление", "Формируем идею и согласовываем характер будущей системы."],
  ["03", "Айдентика", "Создаём знак, типографику, палитру, графику и ключевые носители."],
  ["04", "Правила", "Собираем понятный гайд и шаблоны для команды и подрядчиков."],
  ["05", "Развитие", "Поддерживаем бренд и цифровые продукты после запуска."],
];

const faq = [
  {
    question: "Можно обновить бренд, сохранив узнаваемость?",
    answer:
      "Да. Определяем элементы, которые уже работают и имеют ценность, затем обновляем систему вокруг них. Так бренд становится современнее, но не теряет накопленное узнавание.",
  },
  {
    question: "Что входит в базовый набор айдентики?",
    answer:
      "Обычно это логотип и его версии, палитра, типографика, графические принципы, базовые носители и краткое руководство. Точный состав зависит от задач бизнеса.",
  },
  {
    question: "Можно заказать поддержку уже существующего сайта?",
    answer:
      "Да. Сначала проводим короткий технический и визуальный аудит, фиксируем состояние проекта и предлагаем формат регулярной или разовой работы.",
  },
  {
    question: "Как устроена ежемесячная поддержка?",
    answer:
      "Согласуем объём часов или список приоритетов, планируем задачи короткими циклами и регулярно показываем результат. Срочные работы оговариваем отдельно.",
  },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className={styles.label}>{children}</p>;
}

export default function BrandingSupportPage() {
  return (
    <main className={styles.page}>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Главная", path: "/" }, { name: "Брендинг и поддержка", path: "/services/branding-support" }]),
        serviceJsonLd({
          name: "Брендинг и поддержка",
          description: "Создание айдентики, визуальных систем и бренд-материалов, а также поддержка сайтов и цифровых продуктов после запуска.",
          path: "/services/branding-support",
          serviceType: "Брендинг и дизайн-поддержка",
        }),
      ]} />
      <AboutHeader active={null} />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><i />BRAND IDENTITY / SUPPORT / GROWTH</p>
          <h1>
            Бренд, который
            <br />узнают. Система,
            <br />которую <em>развивают.</em>
          </h1>
          <p className={styles.heroLead}>
            Создаём визуальный язык бизнеса и остаёмся рядом после запуска —
            развиваем сайт, материалы и цифровые продукты в одной системе.
          </p>
          <div className={styles.heroActions}>
            <Link href="/#brief">Обсудить бренд <span>↗</span></Link>
            <a href="#identity">Что входит <span>↓</span></a>
          </div>
          <div className={styles.heroFacts}>
            <div><strong>от 4 недель</strong><span>айдентика</span></div>
            <div><strong>brand guide</strong><span>правила и шаблоны</span></div>
            <div><strong>ежемесячно</strong><span>поддержка и развитие</span></div>
          </div>
        </div>

        <div className={styles.heroVisual} aria-label="Визуальная система бренда VELA">
          <div className={styles.visualMeta}><span>IDENTITY SYSTEM</span><span>01 / 05</span></div>
          <div className={styles.poster}>
            <span>VELA / COFFEE</span>
            <strong>V</strong>
            <h2>Место,<br />где вкус<br />становится<br />ритуалом.</h2>
            <small>ETHIOPIA / GUJI NATURAL / 2026</small>
          </div>
          <div className={styles.brandCard}>
            <header><b>VELA</b><span>BRAND CARD / 02</span></header>
            <div className={styles.cardMark}>V</div>
            <div className={styles.cardBottom}><span>COFFEE ROASTERS</span><b>02—26</b></div>
          </div>
          <div className={styles.paletteCard}>
            <span>COLOR / CORE</span>
            <div><i /><i /><i /><i /></div>
            <small>INK / CREAM / CLAY / ACID</small>
          </div>
          <div className={styles.typeCard}>
            <span>TYPE / DISPLAY</span>
            <strong>Aa</strong>
            <small>CORMORANT / GEIST</small>
          </div>
          <div className={styles.visualCaption}>MEANING → IMAGE → SYSTEM</div>
        </div>
      </section>

      <section className={styles.idea}>
        <div className={styles.ideaIntro}>
          <Label>01 / ОСНОВА БРЕНДА</Label>
          <h2>Не просто логотип.<br />Характер бизнеса.</h2>
          <p>Айдентика помогает компании выглядеть цельно, говорить своим голосом и оставаться узнаваемой во всех точках контакта.</p>
        </div>
        <div className={styles.statement}>
          <span>БРЕНД =</span>
          <strong>смысл</strong>
          <i>×</i>
          <strong>образ</strong>
          <i>×</i>
          <strong>опыт</strong>
        </div>
      </section>

      <section className={styles.identity} id="identity">
        <div className={styles.identityHeading}>
          <Label>02 / АЙДЕНТИКА</Label>
          <h2>Собираем систему,<br />а не набор картинок.</h2>
        </div>
        <div className={styles.identityGrid}>
          {identity.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <div className={styles.identityMark}><i /><i /><i /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.showcase}>
        <div className={styles.showcaseCopy}>
          <Label>03 / СИСТЕМА В ДЕЙСТВИИ</Label>
          <h2>Один образ.<br />Разные носители.</h2>
          <p>
            Проверяем айдентику на реальных задачах: от маленькой иконки
            до первого экрана сайта, презентации и печатных материалов.
          </p>
          <ul>
            <li><span>01</span>Цифровые продукты и сайт</li>
            <li><span>02</span>Социальные сети и реклама</li>
            <li><span>03</span>Презентации и документы</li>
            <li><span>04</span>Упаковка и деловые носители</li>
          </ul>
        </div>
        <div className={styles.showcaseVisual}>
          <div className={styles.webMock}>
            <header><b>VELA</b><span>КАТАЛОГ&nbsp;&nbsp; О БРЕНДЕ&nbsp;&nbsp; КОНТАКТЫ</span></header>
            <div><small>SMALL BATCH COFFEE / MOSCOW</small><strong>Свежее зерно.<br />Честный вкус.</strong><button>Выбрать кофе ↗</button></div>
          </div>
          <div className={styles.packageMock}><span>VELA</span><strong>ETHIOPIA</strong><i>V</i><small>250 G / FILTER</small></div>
          <div className={styles.socialMock}><span>SOCIAL / 04</span><strong>COFFEE<br />WITH<br />A POINT<br />OF VIEW</strong><small>@VELA.COFFEE</small></div>
          <div className={styles.ticketMock}><span>ORDER / 0284</span><b>VELA</b><small>THANK YOU / ENJOY</small></div>
        </div>
      </section>

      <section className={styles.support}>
        <div className={styles.supportHeading}>
          <Label>04 / ПОСЛЕ ЗАПУСКА</Label>
          <h2>Бренд и продукт<br />продолжают жить.</h2>
          <p>Берём на себя регулярные изменения, чтобы материалы не расходились по стилю, а сайт и продукт не устаревали.</p>
        </div>
        <div className={styles.supportGrid}>
          {support.map(([title, text], index) => (
            <article key={title}>
              <div><span>0{index + 1}</span><i>↗</i></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processIntro}>
          <Label>05 / ПРОЦЕСС</Label>
          <h2>От первого смысла<br />до ежедневной работы.</h2>
          <p>Каждый этап имеет понятный результат. Финальная система остаётся удобной не только для дизайнеров, но и для вашей команды.</p>
        </div>
        <div className={styles.processGrid}>
          {stages.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.guide}>
        <div className={styles.guideCopy}>
          <Label>06 / BRAND GUIDE</Label>
          <h2>Правила, которыми<br />можно пользоваться.</h2>
          <p>Собираем всё в единый рабочий документ: версии знака, цвета, шрифты, сетки, примеры и ограничения.</p>
          <div className={styles.guideFacts}>
            <div><strong>01</strong><span>логотип и знак</span></div>
            <div><strong>02</strong><span>цвет и типографика</span></div>
            <div><strong>03</strong><span>шаблоны носителей</span></div>
          </div>
        </div>
        <div className={styles.guideBook}>
          <div className={styles.bookCover}><small>BRAND GUIDELINES / 2026</small><strong>V</strong><span>VELA COFFEE ROASTERS</span></div>
          <div className={styles.bookPage}>
            <header><span>02 / LOGO SYSTEM</span><b>VELA</b></header>
            <div className={styles.logoGrid}><strong>V</strong><strong>VELA</strong><strong>V</strong><strong>VELA</strong></div>
            <footer><span>MIN SIZE / 12 MM</span><span>SAFE AREA / 1X</span></footer>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div>
          <Label>07 / ВОПРОСЫ</Label>
          <h2>До начала<br />работы.</h2>
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
          <span>BRAND / GROWTH / 2026</span>
          <strong>B</strong>
          <div><i /><i /><i /></div>
          <small>BUILD / SUPPORT / EVOLVE</small>
        </div>
        <div className={styles.ctaCopy}>
          <Label>СЛЕДУЮЩИЙ ШАГ</Label>
          <h2>Обсудим ваш<br />бренд?</h2>
          <p>Расскажите о бизнесе и задаче — предложим состав проекта или удобный формат поддержки.</p>
          <Link href="/#brief">Обсудить проект <span>↗</span></Link>
          <div><small>ИЛИ НАПИШИТЕ НАМ</small><a href="mailto:hello@kl-w.ru">hello@kl-w.ru</a><a href="tel:+74952150648">+7 495 215-06-48</a></div>
        </div>
      </section>
    </main>
  );
}

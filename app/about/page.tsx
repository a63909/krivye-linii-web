/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "./about-header";

export const metadata: Metadata = {
  title: "О студии",
  description:
    "Кривые Линии WEB — цифровое направление бренда «Кривые Линии». Стратегия, веб-дизайн, разработка и поддержка цифровых продуктов для бизнеса.",
};

const principles = [
  {
    number: "01",
    title: "Сначала — смысл",
    text: "До первого макета разбираемся в продукте, аудитории и задаче. Дизайн начинается не с цвета кнопки, а с понимания бизнеса.",
  },
  {
    number: "02",
    title: "Система вместо декора",
    text: "Каждый экран, текст и сценарий работает на общую цель. Красота для нас — следствие точной структуры, а не отдельный эффект.",
  },
  {
    number: "03",
    title: "Один стандарт качества",
    text: "Стратегия, дизайн и разработка не спорят друг с другом. Мы ведём проект как единое целое и отвечаем за результат на каждом этапе.",
  },
  {
    number: "04",
    title: "Дальше запуска",
    text: "Сайт должен выдерживать рост бизнеса. Поэтому заранее думаем об аналитике, развитии, новых страницах и поддержке после релиза.",
  },
];

const capabilities = [
  ["Стратегия", "Исследование, позиционирование, структура и пользовательские сценарии."],
  ["Айдентика", "Логотип, визуальный язык, дизайн-система и правила применения."],
  ["Web-дизайн", "Лендинги, корпоративные сайты, каталоги и интерфейсы."],
  ["Разработка", "Адаптивная вёрстка, интеграции, аналитика и публикация."],
  ["Развитие", "Редизайн, новые разделы, поддержка и последовательное улучшение."],
];

const method = [
  ["01", "Понимаем", "Погружаемся в бизнес и формулируем задачу, которую должен решить цифровой продукт."],
  ["02", "Проектируем", "Выстраиваем архитектуру, смысловую подачу и визуальную систему до начала разработки."],
  ["03", "Запускаем", "Собираем, тестируем, публикуем и передаём продукт, готовый к реальной работе."],
];

export default function AboutPage() {
  return (
    <div className="site-shell about-shell">
      <AboutHeader />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="about-kicker">О СТУДИИ / КРИВЫЕ ЛИНИИ WEB</p>
            <h1>Не выпрямляем идеи. Придаём им форму.</h1>
            <p>
              Студия веб-дизайна «Кривые Линии WEB» — цифровое направление бренда
              «Кривые Линии». Мы объединяем стратегию, дизайн и разработку, чтобы
              бизнес получал не декорацию, а полноценный рабочий инструмент.
            </p>
            <Link className="button button-light" href="/#brief">
              Начать проект <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="about-hero-media">
            <img
              src="/images/hero/krivye-linii-serious.webp"
              alt="Рабочее пространство студии Кривые Линии WEB"
              width={1086}
              height={1417}
            />
          </div>
        </section>

        <section className="about-intro about-section">
          <p className="about-section-label">01 / КТО МЫ</p>
          <div className="about-intro-body">
            <h2>Мы не подгоняем бизнес под готовый шаблон.</h2>
            <div className="about-copy-columns">
              <p>
                Наш профессиональный опыт складывался годами — в дизайне,
                разработке, контенте и реальных бизнес-задачах. Это научило нас
                смотреть на сайт шире отдельного красивого экрана.
              </p>
              <p>
                Мы создаём цифровую систему, в которой всё связано: позиционирование,
                логика, тексты, визуальный язык, технология и путь клиента до действия.
                Поэтому результат не только хорошо выглядит — им удобно пользоваться,
                его легко объяснить и можно последовательно развивать.
              </p>
            </div>
          </div>
        </section>

        <section className="about-manifesto">
          <p>НАШ ВЗГЛЯД</p>
          <blockquote>
            Хороший дизайн не украшает бизнес. Он помогает увидеть его силу,
            понять его ценность и запомнить его имя.
          </blockquote>
        </section>

        <section className="about-principles about-section">
          <div className="about-heading">
            <p className="about-section-label">02 / ПРИНЦИПЫ</p>
            <h2>То, на чём держится наша работа.</h2>
          </div>
          <div className="about-principles-grid">
            {principles.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-capabilities">
          <div className="about-heading about-heading-light">
            <p className="about-section-label">03 / КОМПЕТЕНЦИИ</p>
            <h2>Закрываем весь путь цифрового продукта.</h2>
          </div>
          <div className="about-capability-list">
            {capabilities.map(([title, text], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-method about-section">
          <div className="about-heading">
            <p className="about-section-label">04 / ПОДХОД</p>
            <h2>Без хаоса между идеей и запуском.</h2>
          </div>
          <div className="about-method-grid">
            {method.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <p>ЕСТЬ ЗАДАЧА?</p>
          <h2>Давайте превратим её в сильный цифровой продукт.</h2>
          <Link className="button button-dark" href="/#brief">
            Обсудить проект <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>

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
            <p>Проектируем цифровой образ бизнеса — от позиционирования и айдентики до запуска сайта и дальнейшего развития.</p>
            <div className="footer-tags" aria-label="Направления студии">
              <span>WEB</span><span>BRAND</span><span>CODE</span>
            </div>
          </div>
          <section className="footer-column footer-services-column">
            <span className="footer-column-label">Услуги</span>
            <Link href="/#services">Сайты под ключ</Link>
            <Link href="/#services">UX/UI и редизайн</Link>
            <Link href="/#services">Логотипы и айдентика</Link>
            <Link href="/#services">Поддержка и развитие</Link>
          </section>
          <nav className="footer-column footer-navigation-column" aria-label="Навигация в подвале">
            <span className="footer-column-label">Навигация</span>
            <Link href="/#portfolio">Работы</Link>
            <Link href="/#services">Услуги</Link>
            <Link href="/#prices">Цены</Link>
            <Link href="/#brief">Контакты</Link>
            <Link href="/about">О нас</Link>
          </nav>
          <section className="footer-column footer-contact-column">
            <span className="footer-column-label">Контакты</span>
            <a className="footer-email" href="mailto:web@curvedlines.ru">web@curvedlines.ru</a>
            <div className="footer-legal-details">
              <strong>ИП Гладышев Андрей Иванович</strong>
              <span>ИНН 860219643299</span>
              <span>ОГРНИП 319861700068507</span>
              <span>Юридический адрес: Москва, Пресненская набережная, д. 12</span>
            </div>
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
    </div>
  );
}

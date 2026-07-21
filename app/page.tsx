"use client";

/* Static public assets are used directly because the Sites runtime does not
   provide the Next.js image-optimizer endpoint. */
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { projects } from "./work/projects";

const services = [
  {
    number: "01",
    title: "Сайты",
    text: "Лендинги, корпоративные сайты и каталоги — от архитектуры до публикации.",
    tags: ["UX", "UI", "Код", "Адаптив"],
  },
  {
    number: "02",
    title: "Логотипы",
    text: "Знак, типографика и набор версий, которые одинаково уверенно работают в digital и печати.",
    tags: ["Концепция", "Вектор", "Логобук"],
  },
  {
    number: "03",
    title: "Фирменный стиль",
    text: "Цвет, шрифты, графика и правила — единая визуальная система вместо разрозненных макетов.",
    tags: ["Айдентика", "Гайд", "Носители"],
  },
  {
    number: "04",
    title: "Редизайн",
    text: "Пересобираем устаревшие сайты, сохраняя сильное и убирая всё, что мешает заявкам.",
    tags: ["Аудит", "Прототип", "Перезапуск"],
  },
  {
    number: "05",
    title: "Digital-материалы",
    text: "Презентации, коммерческие предложения, баннеры и оформление социальных сетей.",
    tags: ["Презентации", "SMM", "Графика"],
  },
  {
    number: "06",
    title: "Развитие",
    text: "Базовое SEO, аналитика, техническая поддержка и последовательное развитие после запуска.",
    tags: ["SEO", "Метрика", "Поддержка"],
  },
];

const packages = [
  {
    name: "Старт",
    price: "59 000 ₽",
    lead: "Мини-лендинг",
    features: [
      "До 7 смысловых блоков",
      "Адаптивная версия",
      "Форма и базовая аналитика",
      "Публикация и 14 дней поддержки",
    ],
  },
  {
    name: "Бизнес",
    price: "89 000 ₽",
    lead: "Продающий лендинг",
    featured: true,
    features: [
      "Уникальная визуальная концепция",
      "8–12 смысловых блоков",
      "Тексты и авторская графика",
      "SEO-база и аналитика",
    ],
  },
  {
    name: "Система",
    price: "149 000 ₽",
    lead: "Сайт компании",
    features: [
      "До 7 страниц",
      "Дизайн-система проекта",
      "Формы и интеграции",
      "Подготовка к продвижению",
    ],
  },
];

const process = [
  ["01", "Погружаемся", "Разбираем продукт, аудиторию, конкурентов и задачу сайта."],
  ["02", "Проектируем", "Собираем структуру, сценарии и прототип до визуальной работы."],
  ["03", "Создаём стиль", "Формируем дизайн-направление и показываем систему на ключевых экранах."],
  ["04", "Собираем", "Верстаем, подключаем формы, аналитику и проверяем адаптивность."],
  ["05", "Запускаем", "Публикуем, передаём исходники и остаёмся рядом после релиза."],
];

const technologies = [
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "FIGMA",
  "VERCEL",
  "CLOUDFLARE",
  "GITHUB",
  "WORDPRESS",
  "TILDA",
  "ЯНДЕКС МЕТРИКА",
];

const faqs = [
  [
    "Сколько времени занимает запуск?",
    "Мини-лендинг обычно занимает 5–7 рабочих дней, полноценный лендинг — 10–14, сайт компании — от 15 рабочих дней. Срок фиксируем после короткого брифа.",
  ],
  [
    "Сколько вариантов дизайна входит?",
    "Мы разрабатываем одно сильное направление на основе согласованного мудборда и включаем два раунда правок. Для логотипа показываем две концепции.",
  ],
  [
    "Как и когда оплачивается работа?",
    "Проект оплачивается поэтапно: обычно 50% после согласования сметы и перед стартом, оставшиеся 50% — после утверждения результата, до публикации и передачи исходников. Оплата производится безналичным переводом по реквизитам исполнителя, указанным в счёте или договоре. После каждого платежа заказчик получает чек. Для крупных проектов делим оплату на дополнительные этапы и заранее фиксируем график.",
  ],
  [
    "Вы передаёте исходники?",
    "Да. После полной оплаты передаём согласованные дизайн-материалы, логотипы и исходный код проекта в предусмотренных договором форматах.",
  ],
  [
    "Что понадобится от меня?",
    "Факты о бизнесе, услуги, преимущества, контакты и материалы, которые уже есть. Структуру, подачу и базовые тексты мы соберём сами.",
  ],
  [
    "Можно развивать сайт после запуска?",
    "Да. Можно подключить поддержку или заказывать отдельные страницы, разделы, интеграции и рекламные материалы по мере роста.",
  ],
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [briefStatus, setBriefStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const briefStartedAt = useRef(0);

  useEffect(() => {
    briefStartedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const submitBrief = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setBriefStatus("sending");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          contact: String(data.get("contact") ?? ""),
          project: String(data.get("project") ?? ""),
          budget: String(data.get("budget") ?? ""),
          details: String(data.get("details") ?? ""),
          startedAt: briefStartedAt.current,
        }),
      });

      if (!response.ok) throw new Error("Lead delivery failed");

      form.reset();
      briefStartedAt.current = Date.now();
      window.ym?.(110842965, "reachGoal", "lead_form_submit");
      setBriefStatus("success");
    } catch {
      setBriefStatus("error");
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="header-brand" href="#top" aria-label="Кривые Линии WEB — на главную">
          <img
            src="/images/brand/krivye-linii-web-transparent.png"
            alt="Кривые Линии WEB"
            width={1020}
            height={720}
          />
          <span className="header-brand-slogan">
            <strong>КРИВЫЕ ЛИНИИ</strong>
            <em>изгибы совершенства</em>
          </span>
        </a>

        <nav
          className={menuOpen ? "header-nav is-open" : "header-nav"}
          id="main-navigation"
          aria-label="Главное меню"
        >
          <a href="#portfolio" onClick={closeMenu}>Работы</a>
          <a href="#services" onClick={closeMenu}>Услуги</a>
          <a href="#prices" onClick={closeMenu}>Цены</a>
          <a href="#process" onClick={closeMenu}>Процесс</a>
          <a href="/about" onClick={closeMenu}>О нас</a>
          <a className="header-cta" href="#brief" onClick={closeMenu}>
            Обсудить проект <ArrowIcon />
          </a>
        </nav>

        <button
          className={menuOpen ? "menu-button is-open" : "menu-button"}
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        >
          <i />
          <i />
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-background" aria-hidden="true">
            <picture className="hero-background-picture">
              <source
                media="(max-width: 680px)"
                srcSet="/images/hero/krivye-linii-mobile.webp"
                type="image/webp"
              />
              <img
                src="/images/hero/krivye-linii-serious.webp"
                alt=""
                className="hero-background-image"
                width={2400}
                height={1240}
                fetchPriority="high"
              />
            </picture>
          </div>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow"><span /> WEB-ДИЗАЙН / РАЗРАБОТКА / АЙДЕНТИКА</p>
            <h1>
              Создаём сайты,
              <br />которые работают
              <br />на бизнес.
            </h1>
            <p className="hero-lead">
              Стратегия, UX/UI-дизайн и разработка — в одной команде. Лендинги
              и корпоративные сайты под ключ, без шаблонных решений.
            </p>
            <div className="hero-actions">
              <a className="button button-light" href="#brief">Рассчитать проект <ArrowIcon /></a>
              <a className="text-link" href="#portfolio">Смотреть работы <span>↓</span></a>
            </div>
            <div className="hero-facts">
              <span><b>от 59 000 ₽</b> сайт под ключ</span>
              <span><b>от 7 дней</b> до запуска</span>
              <span><b>2 раунда</b> правок включены</span>
            </div>
          </div>

        </section>

        <section className="showreel" aria-label="Избранные проекты">
          <div className="showreel-heading">
            <span>SELECTED WORK</span>
            <span>SCROLLING / 01—04</span>
          </div>
          <div className="project-rail">
            <div className="project-track">
              {[...projects, ...projects].map((project, index) => (
                <article
                  className="rail-card"
                  key={`${project.slug}-${index}`}
                  aria-hidden={index >= projects.length}
                >
                  <img
                    src={project.image}
                    alt=""
                    width={1536}
                    height={1024}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="rail-card-shade" />
                  <div className="rail-card-copy">
                    <span>{project.category}</span>
                    <h2>{project.name}</h2>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio section" id="portfolio">
          <div className="section-intro">
            <p className="section-index">01 / ПОРТФОЛИО</p>
            <div>
              <h2>Работы говорят раньше нас.</h2>
              <p>Сайты и визуальные системы для разных рынков — от продукта до запуска.</p>
            </div>
          </div>

          <div className="portfolio-grid">
            {projects.map((project, index) => (
              <article className={`project-card project-card-${index + 1}`} key={project.slug}>
                <Link
                  className="project-card-link"
                  href={`/work/${project.slug}`}
                  aria-label={`Открыть кейс ${project.name}`}
                >
                  <div className="project-image-wrap">
                    <img
                      src={project.image}
                      alt={`${project.name} — дизайн-проект`}
                      width={1536}
                      height={1024}
                      loading="lazy"
                    />
                    <span className="project-number">0{index + 1}</span>
                    <span className="project-open" aria-hidden="true">КЕЙС ↗</span>
                  </div>
                  <div className="project-meta">
                    <div>
                      <p>{project.category}</p>
                      <h3>{project.name}</h3>
                    </div>
                    <p>{project.description}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-intro light-intro">
            <p className="section-index">02 / УСЛУГИ</p>
            <div>
              <h2>От первого смысла до работающего сайта.</h2>
              <p>Берём на себя все ключевые точки цифрового образа компании.</p>
            </div>
          </div>

          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.number}>
                <span className="service-number">{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="tag-list">
                  {service.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="statement">
          <p>КРИВЫЕ ЛИНИИ / WEB</p>
          <h2>
            Красивого недостаточно.{" "}
            <br />Дизайн должен <em>объяснять, убеждать</em>{" "}
            <br />и приводить к действию.
          </h2>
          <div className="statement-pixels" aria-hidden="true">
            {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
          </div>
        </section>

        <section className="prices section" id="prices">
          <div className="section-intro">
            <p className="section-index">03 / ПАКЕТЫ</p>
            <div>
              <h2>Прозрачный старт без агентской математики.</h2>
              <p>Фиксируем состав и стоимость до начала работы. Никаких сюрпризов в финальной смете.</p>
            </div>
          </div>

          <div className="price-grid">
            {packages.map((item) => (
              <article className={item.featured ? "price-card is-featured" : "price-card"} key={item.name}>
                {item.featured && <span className="popular-chip">Оптимальный выбор</span>}
                <div className="price-card-head">
                  <span>{item.name}</span>
                  <p>{item.lead}</p>
                </div>
                <strong>{item.price}</strong>
                <ul>
                  {item.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a href="#brief">Выбрать пакет <ArrowIcon /></a>
              </article>
            ))}
          </div>
          <p className="price-note">
            Нужен каталог, редизайн или фирменный стиль? Рассчитаем отдельно после короткого брифа.
          </p>
        </section>

        <section className="process section" id="process">
          <div className="section-intro light-intro">
            <p className="section-index">04 / ПРОЦЕСС</p>
            <div>
              <h2>Пять понятных шагов. Один ответственный результат.</h2>
            </div>
          </div>
          <div className="process-list">
            {process.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <i aria-hidden="true">→</i>
              </article>
            ))}
          </div>
        </section>

        <section className="tech-marquee" aria-label="Инструменты и платформы">
          <div className="tech-label">
            <span>ТЕХНОЛОГИИ И ПЛАТФОРМЫ</span>
            <span>TOOLS / STACK / PLATFORMS</span>
          </div>
          <div className="tech-rail">
            <div className="tech-track">
              {[...technologies, ...technologies].map((technology, index) => (
                <span key={`${technology}-${index}`} aria-hidden={index >= technologies.length}>
                  {technology}<i />
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="faq section">
          <div className="section-intro">
            <p className="section-index">05 / ВОПРОСЫ</p>
            <div><h2>Всё важное до начала работы.</h2></div>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary><span>0{index + 1}</span>{question}<i aria-hidden="true">+</i></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="brief" id="brief">
          <div className="brief-copy">
            <p className="section-index">06 / НОВЫЙ ПРОЕКТ</p>
            <h2>Давайте сделаем так, чтобы ваш сайт запомнили.</h2>
            <p>
              Расскажите о задаче — подготовим предварительную оценку, состав работ и сроки.
            </p>
            <a href="mailto:web@curvedlines.ru">web@curvedlines.ru <ArrowIcon /></a>
          </div>

          <form className="brief-form" onSubmit={submitBrief}>
            <label>
              <span>Ваше имя</span>
              <input name="name" required autoComplete="name" placeholder="Как к вам обращаться?" />
            </label>
            <label>
              <span>Телефон, Telegram или email</span>
              <input
                name="contact"
                required
                autoComplete="email"
                placeholder="Удобный способ связи"
              />
            </label>
            <div className="form-row">
              <label>
                <span>Что нужно?</span>
                <select name="project" defaultValue="Сайт компании">
                  <option>Лендинг</option>
                  <option>Сайт компании</option>
                  <option>Сайт-каталог</option>
                  <option>Логотип</option>
                  <option>Фирменный стиль</option>
                  <option>Редизайн</option>
                  <option>Другое</option>
                </select>
              </label>
              <label>
                <span>Ориентир по бюджету</span>
                <select name="budget" defaultValue="80–150 тыс. ₽">
                  <option>До 80 тыс. ₽</option>
                  <option>80–150 тыс. ₽</option>
                  <option>150–300 тыс. ₽</option>
                  <option>От 300 тыс. ₽</option>
                </select>
              </label>
            </div>
            <label>
              <span>Коротко о задаче</span>
              <textarea name="details" rows={4} placeholder="Что вы хотите запустить или изменить?" />
            </label>
            <label className="consent-label">
              <input type="checkbox" required />
              <span>
                Согласен на обработку данных для ответа на обращение согласно{" "}
                <a href="/privacy">политике конфиденциальности</a>
              </span>
            </label>
            <button className="button button-dark" type="submit" disabled={briefStatus === "sending"}>
              {briefStatus === "sending" ? "Отправляем…" : "Сформировать заявку"} <ArrowIcon />
            </button>
            <p className={`brief-status brief-status-${briefStatus}`} role="status" aria-live="polite">
              {briefStatus === "success" && "Спасибо. Заявка отправлена — свяжемся с вами в ближайшее рабочее время."}
              {briefStatus === "error" && (
                <>Не удалось отправить заявку. Напишите нам на <a href="mailto:web@curvedlines.ru">web@curvedlines.ru</a>.</>
              )}
            </p>
          </form>
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
            <a href="#services">Сайты под ключ</a>
            <a href="#services">UX/UI и редизайн</a>
            <a href="#services">Логотипы и айдентика</a>
            <a href="#services">Поддержка и развитие</a>
          </section>
          <nav className="footer-column footer-navigation-column" aria-label="Навигация в подвале">
            <span className="footer-column-label">Навигация</span>
            <a href="#portfolio">Работы</a>
            <a href="#services">Услуги</a>
            <a href="#prices">Цены</a>
            <a href="#brief">Контакты</a>
            <a href="/about">О нас</a>
            <a href="/documents">Документы</a>
          </nav>
          <section className="footer-column footer-contact-column">
            <span className="footer-column-label">Контакты</span>
            <a className="footer-email" href="mailto:web@curvedlines.ru">web@curvedlines.ru</a>
            <div className="footer-legal-details">
              <strong>ИП Гладышев Андрей Иванович</strong>
              <span>ИНН 860219643299</span>
              <span>ОГРНИП 3198611700068507</span>
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
            <a href="/privacy">Политика конфиденциальности</a>
            <a href="/consent">Согласие на обработку данных</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
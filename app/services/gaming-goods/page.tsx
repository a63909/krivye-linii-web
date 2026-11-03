import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import styles from "./gaming-goods.module.css";

const description =
  "Игровые товары Кривых Линий WEB: информация о готовящемся направлении, ассортименте и условиях запуска.";

export const metadata: Metadata = {
  title: "Игровые товары",
  description,
  alternates: { canonical: "/services/gaming-goods" },
  openGraph: {
    title: "Игровые товары — Кривые Линии WEB",
    description,
    url: "https://web.curvedlines.ru/services/gaming-goods",
    type: "website",
  },
};

const details = [
  ["01", "Точный состав", "В карточке будут указаны платформа, вид товара и объём передачи — чтобы до заказа было понятно, что вы получаете."],
  ["02", "Стоимость до оплаты", "Цена и итоговая сумма заказа будут доступны до перехода к оплате. Сейчас цены не опубликованы и заказы не принимаются."],
  ["03", "Понятное получение", "Способ передачи, срок исполнения и условия возврата появятся вместе с доступным ассортиментом."],
];

export default function GamingGoodsPage() {
  return (
    <main className={styles.page}>
      <AboutHeader active={null} />

      <section className={styles.hero} aria-labelledby="gaming-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>КРИВЫЕ ЛИНИИ / ИГРОВОЕ НАПРАВЛЕНИЕ</p>
          <h1 id="gaming-title">Игровые<br /><em>товары.</em></h1>
          <p className={styles.lead}>
            Новый раздел Кривых Линий WEB. Готовим направление игровых товаров
            с понятным описанием, стоимостью и условиями передачи.
          </p>
          <div className={styles.actions}>
            <a href="#catalog">Посмотреть направление <span aria-hidden="true">↓</span></a>
            <a href="mailto:hello@kl-w.ru?subject=Игровые%20товары%20—%20вопрос%20о%20запуске">Уточнить запуск <span aria-hidden="true">↗</span></a>
          </div>
          <p className={styles.launchNote}><i aria-hidden="true" />Готовится к запуску · приём заказов пока закрыт</p>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualTop}><span>GAMING / DIGITAL GOODS</span><span>KL — 07</span></div>
          <div className={styles.orbit}><div className={styles.token}><span>КЛ</span><small>PLAY / DIGITAL</small></div></div>
          <div className={styles.visualBottom}><span>НОВОЕ НАПРАВЛЕНИЕ</span><strong>Скоро<br />в игре.</strong></div>
        </div>
      </section>

      <section className={styles.catalog} id="catalog" aria-labelledby="catalog-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / НАПРАВЛЕНИЕ</p>
          <h2 id="catalog-title">Что готовим<br />к запуску.</h2>
          <p>Сейчас раздел информационный. Ассортимент и условия продаж будут опубликованы перед открытием заказов.</p>
        </div>
        <article className={styles.product}>
          <div className={styles.productTop}><span>POKEROK</span><span className={styles.badge}>Планируется</span></div>
          <h3>Фишки и игровой баланс</h3>
          <p>Планируемое направление — передача игрового баланса PokerOK между пользователями. Возможность запуска и условия приёма платежей уточняются.</p>
          <dl>
            <div><dt>Доступность</dt><dd>Заказы пока закрыты</dd></div>
            <div><dt>Объём и стоимость</dt><dd>Будут опубликованы при запуске</dd></div>
            <div><dt>Передача и сроки</dt><dd>Условия готовятся</dd></div>
          </dl>
          <a className={styles.productLink} href="mailto:hello@kl-w.ru?subject=Вопрос%20о%20направлении%20PokerOK">Задать вопрос о запуске <span aria-hidden="true">↗</span></a>
        </article>
      </section>

      <section className={styles.conditions} aria-labelledby="conditions-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>02 / ПЕРЕД ЗАКАЗОМ</p>
          <h2 id="conditions-title">Всё о товаре.<br />До оплаты.</h2>
        </div>
        <div className={styles.detailsGrid}>
          {details.map(([number, title, text]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.contact} aria-labelledby="contact-title">
        <div><p className={styles.eyebrow}>ЕСТЬ ВОПРОС?</p><h2 id="contact-title">Остаёмся<br /><em>на связи.</em></h2></div>
        <div className={styles.contactCopy}>
          <p>Пишите, если хотите уточнить статус направления или задать вопрос о будущем ассортименте.</p>
          <a className={styles.email} href="mailto:hello@kl-w.ru?subject=Игровые%20товары">hello@kl-w.ru <span aria-hidden="true">↗</span></a>
          <div className={styles.documentLinks}><Link href="/clients/requisites">Реквизиты</Link><Link href="/documents">Документы</Link><Link href="/privacy">Конфиденциальность</Link></div>
        </div>
      </section>
    </main>
  );
}

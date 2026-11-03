import type { Metadata } from "next";
import Link from "next/link";
import AboutHeader from "../../about/about-header";
import GamingCatalog from "./catalog";
import { catalogItems } from "./catalog-data";
import styles from "./gaming-goods.module.css";

const description =
  "Скины CS2 и предметы Dota 2 под заказ: каталог, подбор экземпляра и согласование цены и передачи до оплаты.";

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
  ["01", "Выберите предмет", "Найдите скин или предмет героя в каталоге. Укажите нужное состояние, вариант, стиль и бюджет в запросе на подбор."],
  ["02", "Согласуем экземпляр", "Подтвердим возможность подбора, покажем точный предмет, согласуем цену в рублях и срок. Отправка запроса бесплатна."],
  ["03", "Передадим через Steam", "Передача согласованного предмета оформляется предложением обмена. Ограничения и возможные задержки Steam проверяются до оплаты."],
];

export default function GamingGoodsPage() {
  return (
    <main className={styles.page}>
      <AboutHeader active={null} />

      <section className={styles.hero} aria-labelledby="gaming-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>КРИВЫЕ ЛИНИИ / ИГРОВОЕ НАПРАВЛЕНИЕ</p>
          <h1 id="gaming-title">Твой стиль.<br /><em>Твоя игра.</em></h1>
          <p className={styles.lead}>
            Скины CS2 и предметы героев Dota 2 под заказ.
            Выбирай из каталога — конкретный экземпляр, цену и передачу согласуем до оплаты.
          </p>
          <div className={styles.actions}>
            <a href="#catalog">Открыть каталог <span aria-hidden="true">↓</span></a>
            <a href="#how-to-order">Как получить предмет <span aria-hidden="true">↗</span></a>
          </div>
          <p className={styles.launchNote}><i aria-hidden="true" />{catalogItems.length} позиций · 2 игры · подбор под заказ</p>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualTop}><span>GAMING / DIGITAL GOODS</span><span>KL — 07</span></div>
          <div className={styles.heroArt} />
          <div className={styles.visualBottom}><span>CS2 / DOTA 2</span><strong>Выбери<br />свой предмет.</strong></div>
        </div>
      </section>

      <section className={styles.catalogSection} id="catalog" aria-labelledby="catalog-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>01 / НАПРАВЛЕНИЕ</p>
          <h2 id="catalog-title">Собери свой<br />инвентарь.</h2>
          <p>От лаконичных скинов до Arcana для любимого героя. Не нашли нужный предмет? Напишите — проверим возможность подбора.</p>
        </div>
        <GamingCatalog />
      </section>

      <section className={styles.conditions} id="how-to-order" aria-labelledby="conditions-title">
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
          <p>Нужен другой скин или предмет? Укажите игру, название и желаемые параметры. Проверим возможность подбора и ответим с условиями.</p>
          <a className={styles.email} href="mailto:web@curvedlines.ru?subject=Игровые%20товары">web@curvedlines.ru <span aria-hidden="true">↗</span></a>
          <div className={styles.documentLinks}><Link href="/terms">Заказ и получение</Link><Link href="/refunds">Возврат денег</Link><Link href="/clients/requisites">Реквизиты</Link><Link href="/privacy">Конфиденциальность</Link></div>
          <p className={styles.affiliation}>CS2, Dota 2 и Steam — обозначения их правообладателей. Кривые Линии WEB не являются представителем Valve.</p>
        </div>
      </section>
    </main>
  );
}

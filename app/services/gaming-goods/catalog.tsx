"use client";

/* Category illustrations are served as static, optimized WebP assets. */
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { catalogCategories, catalogItems, type CatalogCategoryId } from "./catalog-data";
import styles from "./gaming-goods.module.css";

export default function GamingCatalog() {
  const [category, setCategory] = useState<CatalogCategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("ru-RU");
    return catalogItems.filter((item) => {
      const group = catalogCategories.find((entry) => entry.id === item.category)!;
      return (category === "all" || item.category === category) &&
        (!search || `${item.name} ${item.hero ?? ""} ${group.game} ${group.label} ${item.description}`.toLocaleLowerCase("ru-RU").includes(search));
    });
  }, [category, query]);

  return (
    <div className={styles.catalogBody}>
      <div className={styles.catalogTools}>
        <div className={styles.filters} role="group" aria-label="Категории товаров">
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>Все <span>{catalogItems.length}</span></button>
          {catalogCategories.map((group) => (
            <button type="button" key={group.id} aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{group.label} <span>{catalogItems.filter((item) => item.category === group.id).length}</span></button>
          ))}
        </div>
        <label className={styles.search}>Найти предмет
          <input type="search" placeholder="Название, игра или герой" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
        </label>
      </div>
      <p className={styles.resultCount} aria-live="polite" aria-atomic="true">Найдено: {visibleItems.length} из {catalogItems.length}</p>
      <div className={styles.productGrid}>
        {visibleItems.map((item) => {
          const group = catalogCategories.find((entry) => entry.id === item.category)!;
          const requestUrl = `mailto:web@curvedlines.ru?subject=${encodeURIComponent(`Подбор игрового предмета: ${item.name}`)}&body=${encodeURIComponent(`Здравствуйте!\nИнтересует ${item.name} (${group.game}).\nЖелаемые параметры и бюджет: \nКонтакт для ответа: \n\nПрошу подтвердить возможность подбора, стоимость и срок передачи до оплаты.`)}`;
          return (
            <article className={styles.itemCard} key={item.id}>
              <div className={styles.itemArt}>
                <img src={group.image} width={720} height={720} loading="lazy" alt={`Авторская иллюстрация категории «${group.label}»`} />
                <span className={styles.gameTag}>{group.game}</span>
                <span className={styles.artLabel}>Иллюстрация категории</span>
              </div>
              <div className={styles.itemCopy}>
                <p className={styles.itemCategory}>{item.hero ? `ARCANA / ${item.hero}` : group.label}</p>
                <h3>{item.name}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
                <details className={styles.itemDetails}>
                  <summary>Параметры и получение <span aria-hidden="true">+</span></summary>
                  <p>{item.detail}</p>
                  <p>Передача: предложение обмена Steam после согласования конкретного экземпляра. Задержки и ограничения Steam учитываются до оплаты.</p>
                  <a href={item.referenceUrl} target="_blank" rel="noopener noreferrer">Посмотреть предмет в Steam ↗</a>
                </details>
                <div className={styles.itemPrice}><span>Под заказ</span><strong>Цена по запросу</strong></div>
                <a className={styles.itemRequest} href={requestUrl}>Запросить подбор <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          );
        })}
      </div>
      {visibleItems.length === 0 && (
        <div className={styles.emptyState}><h3>Предмет не найден</h3><p>Измените запрос или сбросьте фильтры. Другой предмет можно запросить по почте.</p><button type="button" onClick={() => { setCategory("all"); setQuery(""); }}>Сбросить фильтры</button></div>
      )}
      <p className={styles.catalogNote}>Каталог показывает направления подбора, а не складские остатки. Конкретный экземпляр, его изображение, возможность передачи, итоговая цена в рублях и срок согласовываются до заказа и оплаты. Иллюстрации категорий не воспроизводят внешний вид выбранного скина или предмета.</p>
    </div>
  );
}

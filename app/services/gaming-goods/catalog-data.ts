export const catalogCategories = [
  { id: "rifles", label: "Автоматы", game: "CS2", image: "/images/gaming/rifles.webp" },
  { id: "snipers", label: "Снайперские винтовки", game: "CS2", image: "/images/gaming/snipers.webp" },
  { id: "pistols", label: "Пистолеты", game: "CS2", image: "/images/gaming/pistols.webp" },
  { id: "artifacts", label: "Предметы героев", game: "Dota 2", image: "/images/gaming/fantasy.webp" },
] as const;

export type CatalogCategoryId = (typeof catalogCategories)[number]["id"];

export type CatalogItem = {
  id: string;
  name: string;
  category: CatalogCategoryId;
  description: string;
  detail: string;
  hero?: string;
  referenceUrl: string;
};

const skin = (id: string, name: string, category: CatalogCategoryId, description: string): CatalogItem => ({
  id,
  name,
  category,
  description,
  detail: "Перед заказом согласуем состояние (wear), float, вариант исполнения, наклейки при наличии и конкретный экземпляр. Доступность обмена и срок передачи проверяются отдельно.",
  referenceUrl: `https://steamcommunity.com/market/search?appid=730&q=${encodeURIComponent(name)}`,
});

const arcana = (id: string, name: string, hero: string, description: string): CatalogItem => ({
  id,
  name,
  category: "artifacts",
  hero,
  description,
  detail: "Перед заказом согласуем состав предмета или комплекта, стиль и его разблокировку, качество экземпляра и возможность обмена. Уровни и дополнительные стили не включены автоматически.",
  referenceUrl: `https://steamcommunity.com/market/listings/570/${encodeURIComponent(name)}`,
});

export const catalogItems: CatalogItem[] = [
  skin("ak-redline", "AK-47 | Redline", "rifles", "Карбоновая графика и красные акценты для AK-47."),
  skin("ak-asiimov", "AK-47 | Asiimov", "rifles", "Контрастное оформление AK-47 из серии Asiimov."),
  skin("m4-decimator", "M4A1-S | Decimator", "rifles", "Неоновое оформление M4A1-S с геометрическими акцентами."),
  skin("m4-desolate", "M4A4 | Desolate Space", "rifles", "Космическая иллюстрация для M4A4."),
  skin("aug-momentum", "AUG | Momentum", "rifles", "Яркое геометрическое оформление AUG."),
  skin("sg-pulse", "SG 553 | Pulse", "rifles", "Контрастный рисунок Pulse для SG 553."),
  skin("awp-atheris", "AWP | Atheris", "snipers", "Зелёная змеиная графика на тёмном корпусе AWP."),
  skin("awp-hyper", "AWP | Hyper Beast", "snipers", "Экспрессивное оформление AWP из серии Hyper Beast."),
  skin("awp-fever", "AWP | Fever Dream", "snipers", "Рисунки и контрастные цветные акценты для AWP."),
  skin("ssg-dragon", "SSG 08 | Dragonfire", "snipers", "Огненная графика с драконом для SSG 08."),
  skin("ssg-ghost", "SSG 08 | Ghost Crusader", "snipers", "Холодное бело-синее оформление SSG 08."),
  skin("scar-bloodsport", "SCAR-20 | Bloodsport", "snipers", "Спортивная графика Bloodsport для SCAR-20."),
  skin("usp-cortex", "USP-S | Cortex", "pistols", "Розовые акценты и узнаваемый рисунок Cortex."),
  skin("glock-water", "Glock-18 | Water Elemental", "pistols", "Яркий водный мотив для Glock-18."),
  skin("de-mecha", "Desert Eagle | Mecha Industries", "pistols", "Технологичное оформление Desert Eagle."),
  skin("p250-asiimov", "P250 | Asiimov", "pistols", "Белые, чёрные и оранжевые акценты серии Asiimov."),
  skin("five-monkey", "Five-SeveN | Monkey Business", "pistols", "Ироничный банановый мотив Monkey Business."),
  skin("tec-fuel", "Tec-9 | Fuel Injector", "pistols", "Механические мотивы и жёлтые акценты для Tec-9."),
  arcana("pa-paradox", "Manifold Paradox", "Phantom Assassin", "Парные клинки Arcana для Phantom Assassin."),
  arcana("sf-demon", "Demon Eater", "Shadow Fiend", "Косметический предмет Arcana для Shadow Fiend."),
  arcana("tb-fractal", "Fractal Horns of Inner Abysm", "Terrorblade", "Предмет Arcana для образа Terrorblade."),
  arcana("jug-bladeform", "Bladeform Legacy", "Juggernaut", "Косметический предмет Arcana для Juggernaut."),
  arcana("mk-reckoning", "Great Sage's Reckoning", "Monkey King", "Предмет Arcana с вариантами оформления для Monkey King."),
  arcana("lc-voth", "Blades of Voth Domosh", "Legion Commander", "Парные клинки Arcana для Legion Commander."),
];

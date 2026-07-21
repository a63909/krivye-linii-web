export type ProjectCase = {
  slug: string;
  name: string;
  category: string;
  shortCategory: string;
  description: string;
  image: string;
  gallery: [string, string, string];
  accent: string;
  challenge: string;
  challengeHeading: string;
  approach: string;
  direction: string;
  experience: string;
  system: string;
  scopeHeading: string;
  deliverables: string[];
};

export const projects: ProjectCase[] = [
  {
    slug: "northline",
    name: "Northline Residence",
    category: "Real estate · Brand & Web",
    shortCategory: "Недвижимость",
    description:
      "Цифровая витрина и визуальная система жилого пространства с архитектурным характером.",
    image: "/images/portfolio/northline/01-cover.webp",
    gallery: [
      "/images/portfolio/northline/01-cover.webp",
      "/images/portfolio/northline/02-catalog.webp",
      "/images/portfolio/northline/03-residence-detail.webp",
    ],
    accent: "#c9b990",
    challenge:
      "Собрать премиальную подачу жилого проекта без привычного рекламного шума и сохранить в центре внимания саму архитектуру.",
    challengeHeading: "Премиальность без рекламного шума.",
    approach:
      "Мы выстроили спокойный редакционный ритм: крупные планы, ясная типографика и последовательный путь от атмосферы проекта к содержательной информации.",
    direction:
      "Тёплая нейтральная палитра, архитектурная сетка и крупная фотография формируют ощущение пространства ещё до знакомства с деталями.",
    experience:
      "Структура ведёт пользователя от первого впечатления к ключевым преимуществам, планировкам и целевому обращению без резких переключений.",
    system:
      "Модульная система позволяет расширять проект новыми корпусами, типами квартир и информационными разделами, не разрушая визуальную логику.",
    scopeHeading: "Единая подача — от атмосферы до планировки.",
    deliverables: ["Арт-дирекшн", "UX-структура", "Адаптивный UI", "Визуальная система"],
  },
  {
    slug: "vela",
    name: "Vela Coffee",
    category: "Hospitality · Identity & E-commerce",
    shortCategory: "HoReCa и retail",
    description:
      "Айдентика, упаковка и тёплый digital-опыт для specialty-бренда.",
    image: "/images/portfolio/vela/01-cover.webp",
    gallery: [
      "/images/portfolio/vela/01-cover.webp",
      "/images/portfolio/vela/02-shop.webp",
      "/images/portfolio/vela/03-product.webp",
    ],
    accent: "#de8e78",
    challenge:
      "Передать характер specialty-бренда и одновременно сделать выбор продукта понятным для человека, который не обязан разбираться в кофейной терминологии.",
    challengeHeading: "Понятно новичку, убедительно для ценителя.",
    approach:
      "В основе решения — живой цвет, выразительная продуктовая композиция и простая навигация, которая не спорит с эмоциональной подачей бренда.",
    direction:
      "Тёплые оттенки, тактильные фактуры и контрастная типографика связывают упаковку, коммуникации и интерфейс в один узнаваемый образ.",
    experience:
      "Каталог помогает сравнивать позиции по понятным параметрам, а контент раскрывает происхождение и характер продукта без перегрузки.",
    system:
      "Компоненты рассчитаны на сезонные коллекции, новые категории, подарочные наборы и редакционные материалы о продукте.",
    scopeHeading: "Один характер — от упаковки до покупки.",
    deliverables: ["Айдентика", "Цифровая концепция", "Каталог", "Дизайн-система"],
  },
  {
    slug: "atlas",
    name: "Atlas Node",
    category: "B2B · Corporate & Interface",
    shortCategory: "B2B и технологии",
    description:
      "Сайт и интерфейс международной логистической платформы с ясной системой данных.",
    image: "/images/portfolio/atlas/01-cover.webp",
    gallery: [
      "/images/portfolio/atlas/01-cover.webp",
      "/images/portfolio/atlas/02-dashboard.webp",
      "/images/portfolio/atlas/03-shipment.webp",
    ],
    accent: "#6d8cff",
    challenge:
      "Объяснить сложный B2B-продукт людям с разными ролями: от руководителя до специалиста, который ежедневно работает с данными и маршрутами.",
    challengeHeading: "Сложный B2B-продукт нужно объяснять просто.",
    approach:
      "Мы разделили маркетинговую подачу и рабочие сценарии, сохранив для них единый визуальный язык, терминологию и логику взаимодействия.",
    direction:
      "Строгая сетка, холодный акцентный цвет и структурная типографика подчёркивают технологичность без визуальной перегрузки.",
    experience:
      "Ключевые возможности продукта объясняются через сценарии, а данные организованы так, чтобы важные состояния и действия считывались сразу.",
    system:
      "Единый набор компонентов связывает корпоративные страницы, продуктовые разделы и интерфейс личного кабинета.",
    scopeHeading: "Одна логика — для сайта и рабочего интерфейса.",
    deliverables: ["Продуктовая структура", "Корпоративный сайт", "Концепция интерфейса", "Компоненты"],
  },
  {
    slug: "mira",
    name: "Mira Skin Lab",
    category: "Beauty · Brand & Commerce",
    shortCategory: "Beauty и commerce",
    description:
      "Минималистичная бренд-система и цифровая витрина косметической лаборатории.",
    image: "/images/portfolio/mira/01-cover.webp",
    gallery: [
      "/images/portfolio/mira/01-cover.webp",
      "/images/portfolio/mira/02-collection.webp",
      "/images/portfolio/mira/03-product.webp",
    ],
    accent: "#b8aee8",
    challenge:
      "Соединить лабораторную точность и эмоциональность beauty-категории, не превращая интерфейс ни в медицинский справочник, ни в декоративную витрину.",
    challengeHeading: "Точность лаборатории без холодной подачи.",
    approach:
      "Мы построили подачу вокруг понятной пользы продукта, состава и сценария применения, оставив визуалу достаточно воздуха и характера.",
    direction:
      "Светлая основа, мягкие акценты и аккуратная предметная подача создают чистый образ без клише массовой косметики.",
    experience:
      "Карточки и категории помогают выбирать по задаче кожи, а информационные блоки поддерживают решение фактами и понятными объяснениями.",
    system:
      "Гибкая витрина рассчитана на развитие ассортимента, наборы, образовательный контент и новые продуктовые линии.",
    scopeHeading: "Чистая система — от состава до выбора продукта.",
    deliverables: ["Направление бренда", "UX интернет-магазина", "Адаптивный интерфейс", "Контент-система"],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

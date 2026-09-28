const SITE_URL = "https://web.curvedlines.ru";
const BUSINESS_ID = `${SITE_URL}/#business`;

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": BUSINESS_ID,
  name: "Кривые Линии WEB",
  legalName: "ИП Гладышев Андрей Иванович",
  url: SITE_URL,
  logo: `${SITE_URL}/images/brand/krivye-linii-web.webp`,
  email: "web@curvedlines.ru",
};

export const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#professional-service`,
  name: "Кривые Линии WEB",
  description: "Стратегия, UX/UI-дизайн, разработка сайтов, цифровых сервисов и Android-приложений для бизнеса.",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: "web@curvedlines.ru",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Пресненская набережная, д. 12",
    addressLocality: "Москва",
    addressCountry: "RU",
  },
  parentOrganization: { "@id": BUSINESS_ID },
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}) {
  const url = new URL(path, SITE_URL).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description,
    serviceType,
    url,
    areaServed: "Россия",
    provider: { "@id": BUSINESS_ID },
  };
}

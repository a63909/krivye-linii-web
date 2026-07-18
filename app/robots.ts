import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://web.curvedlines.ru/sitemap.xml",
    host: "https://web.curvedlines.ru",
  };
}

import type { MetadataRoute } from "next";
import { portfolioProjects } from "./portfolio/projects";

const baseUrl = "https://web.curvedlines.ru";
const lastModified = new Date("2026-09-28T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {


  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/sites`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/android`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/web-services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/ux-ui-redesign`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/integrations-automation`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/branding-support`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/documents`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.55,
    },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...portfolioProjects.map(project => ({ url: `${baseUrl}/portfolio/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/consent`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}

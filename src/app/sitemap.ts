import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

const pages = [
  "/",
  "/how-it-works",
  "/safety",
  "/pricing",
  "/about",
  "/pilot",
  "/privacy",
  "/terms",
];

const url = (locale: string, path: string) =>
  `${site.url}${locale === routing.defaultLocale ? "" : `/${locale}`}${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      lastModified: new Date("2026-10-02"),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path === "/privacy" || path === "/terms" ? 0.3 : 0.7,
      alternates: {
        languages: Object.fromEntries(routing.locales.map((l) => [l, url(l, path)])),
      },
    })),
  );
}

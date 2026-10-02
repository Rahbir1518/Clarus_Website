import type { Metadata } from "next";
import { site } from "@/content/site";
import { routing } from "@/i18n/routing";

const localePath = (locale: string, path: string) =>
  `${locale === routing.defaultLocale ? "" : `/${locale}`}${path === "/" ? "" : path}` || "/";

/** Title, description, canonical URL and hreflang alternates for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)]));
  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: { ...languages, "x-default": localePath(routing.defaultLocale, path) },
    },
    openGraph: {
      title,
      description,
      url: localePath(locale, path),
      siteName: site.name,
      locale: locale === "bn" ? "bn_BD" : locale === "ar" ? "ar_AE" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

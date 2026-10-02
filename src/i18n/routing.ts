import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bn", "ar"],
  defaultLocale: "en",
  // English lives at `/`, the others at `/bn/...` and `/ar/...`.
  localePrefix: "as-needed",
  // hreflang alternates come from each page's metadata; the middleware's
  // Link header would duplicate them with the request host.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: ReadonlySet<Locale> = new Set(["ar"]);

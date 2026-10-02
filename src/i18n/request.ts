import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // bn and ar ship partial translations; anything missing falls back to English.
  const en = (await import("../messages/en.json")).default;
  const own = locale === "en" ? en : (await import(`../messages/${locale}.json`)).default;

  return { locale, messages: deepMerge(en, own) };
});

type Messages = { [key: string]: string | Messages };

function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const prev = out[key];
    out[key] =
      typeof value === "object" && typeof prev === "object" ? deepMerge(prev, value) : value;
  }
  return out;
}

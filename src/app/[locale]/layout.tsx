import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Hind_Siliguri, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/content/site";
import { routing, rtlLocales } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import "lenis/dist/lenis.css";
import "../globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
// Bangla and Arabic load on demand by unicode-range, so English pages that show
// a single Bangla line don't pay for preloading the whole face.
const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hind-siliguri",
  // optional, not swap: a late swap reflows whole Bangla paragraphs (CLS).
  // The system Bangla face is used until this one is cached.
  display: "optional",
  preload: false,
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  // optional, not swap: on /ar a late swap moved the hero (CLS 0.16).
  display: "optional",
  preload: false,
});

export const viewport: Viewport = { themeColor: "#E6EAF2" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(site.url),
    title: { default: t("title"), template: "%s · Clarus" },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html
      lang={locale}
      dir={rtlLocales.has(locale) ? "rtl" : "ltr"}
      className={cn(geist.variable, geistMono.variable, hind.variable, plexArabic.variable)}
    >
      <body>
        <a
          href="#main"
          className="fixed start-4 top-4 z-[60] -translate-y-24 rounded-full bg-ink px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            {children}
            <SmoothScroll />
          </MotionProvider>
          <AnalyticsProvider />
        </NextIntlClientProvider>
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  );
}

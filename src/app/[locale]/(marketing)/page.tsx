import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import {
  FeatureCardsIsland,
  HearACallIsland,
  HowItWorksIsland,
  RoiCalculatorIsland,
  SideBySideIsland,
} from "@/components/sections/islands";
import { MarketProvider } from "@/components/sections/MarketContext";
import { PilotCta } from "@/components/sections/PilotCta";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { SafetyStrip } from "@/components/sections/SafetyStrip";
import { Stats } from "@/components/sections/Stats";
import { faq } from "@/content/faq";
import { JsonLd, organizationLd, softwareLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "/", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <MarketProvider>
      <JsonLd data={organizationLd} />
      <JsonLd data={softwareLd} />
      <Hero />
      <Stats />
      <HowItWorksIsland />
      <FeatureCardsIsland />
      <SideBySideIsland />
      <HearACallIsland />
      <SafetyStrip />
      <RoiCalculatorIsland />
      <PricingPreview />
      <PilotCta />
      <Faq items={faq} />
    </MarketProvider>
  );
}

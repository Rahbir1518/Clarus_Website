import { Check, Minus } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GradientScene } from "@/components/glass/GradientScene";
import { Faq } from "@/components/sections/Faq";
import { MarketProvider } from "@/components/sections/MarketContext";
import { PageHeader } from "@/components/sections/PageHeader";
import { PilotCta } from "@/components/sections/PilotCta";
import { MarketSwitcher, PricingCards } from "@/components/sections/PricingCards";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { Section, SectionHeader } from "@/components/sections/SectionHeader";
import { home } from "@/content/copy";
import { comparison, plans, pricingFaq, pricingNotes } from "@/content/pricing";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({
    locale,
    path: "/pricing",
    title: t("pricing"),
    description: home.pricing.sub,
  });
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <MarketProvider>
      <PageHeader eyebrow={t("pricing")} title={home.pricing.title} sub={home.pricing.sub}>
        <div className="mt-8">
          <MarketSwitcher location="pricing_page" />
        </div>
      </PageHeader>

      <Section className="pt-8 sm:pt-12">
        <h2 className="sr-only">Plans</h2>
        <GradientScene scene="violet" className="rounded-panel p-4 sm:p-8 lg:py-12">
          <PricingCards location="pricing_page" />
        </GradientScene>
      </Section>

      <Section>
        <SectionHeader
          title="Compare every plan"
          sub={`${pricingNotes.overage} ${pricingNotes.groups}`}
        />
        <div
          className="mt-10 overflow-x-auto rounded-panel bg-white/55 ring-1 ring-white/80"
          data-lenis-prevent
        >
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-5 py-4 text-start font-mono text-[11px] font-normal text-ink-muted uppercase">
                  Feature
                </th>
                {plans.map((p) => (
                  <th key={p.id} className="px-5 py-4 text-center text-base font-semibold">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-3.5 text-start font-medium">
                    {row.feature}
                  </th>
                  {plans.map((p) => {
                    const v = row.plans[p.id];
                    return (
                      <td key={p.id} className="px-5 py-3.5 text-center">
                        {v === true ? (
                          <Check
                            className="mx-auto size-4 text-success-ink"
                            strokeWidth={2.5}
                            aria-label="Included"
                          />
                        ) : v === false ? (
                          <Minus className="mx-auto size-4 text-ink/30" aria-label="Not included" />
                        ) : (
                          <span className="text-xs text-ink-muted">{v}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <RoiCalculator />
      <Faq items={pricingFaq} title="Pricing questions" />
      <PilotCta location="pricing_page" />
    </MarketProvider>
  );
}

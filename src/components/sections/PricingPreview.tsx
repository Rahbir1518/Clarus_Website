import { ArrowRight } from "lucide-react";
import { GradientScene } from "@/components/glass/GradientScene";
import { Button } from "@/components/ui/button";
import { home } from "@/content/copy";
import { Link } from "@/i18n/navigation";
import { MarketSwitcher, PricingCards } from "./PricingCards";
import { Section, SectionHeader } from "./SectionHeader";

export function PricingPreview() {
  const c = home.pricing;
  return (
    <Section id="pricing">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
        <MarketSwitcher location="home_pricing" />
      </div>
      <GradientScene scene="violet" className="mt-10 rounded-panel p-4 sm:p-8 lg:py-12">
        <PricingCards location="home_pricing" />
      </GradientScene>
      <div className="mt-6 flex justify-center">
        <Button asChild variant="ghost">
          <Link href="/pricing">
            {c.full} <ArrowRight className="rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}

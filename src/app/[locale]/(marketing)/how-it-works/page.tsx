import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SequenceDiagram } from "@/components/demo/SequenceDiagram";
import { GradientScene } from "@/components/glass/GradientScene";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { PageHeader } from "@/components/sections/PageHeader";
import { PilotCta } from "@/components/sections/PilotCta";
import { Section, SectionHeader } from "@/components/sections/SectionHeader";
import { howItWorksPage as c } from "@/content/copy";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({
    locale,
    path: "/how-it-works",
    title: t("howItWorks"),
    description: c.sub,
  });
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <>
      <PageHeader eyebrow={t("howItWorks")} title={c.title} sub={c.sub} />
      <HowItWorks withHeader={false} />

      <Section>
        <SectionHeader title={c.sequence.title} sub={c.sequence.sub} />
        <GradientScene scene="teal" className="mt-10 rounded-panel p-4 sm:p-10">
          <div className="rounded-card bg-white/55 p-4 ring-1 ring-white/70 sm:p-8">
            <SequenceDiagram />
          </div>
        </GradientScene>
      </Section>

      <Section>
        <SectionHeader title={c.whatIf.title} />
        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {c.whatIf.items.map((item) => (
            <div key={item.q} className="rounded-panel bg-white/55 p-6 ring-1 ring-white/80 sm:p-7">
              <dt className="text-h3">
                <span className="text-ink-muted">What happens when </span>
                {item.q}
              </dt>
              <dd className="mt-3 leading-relaxed text-ink-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <PilotCta location="how_it_works" />
    </>
  );
}

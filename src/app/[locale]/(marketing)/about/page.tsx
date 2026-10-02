import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GradientScene } from "@/components/glass/GradientScene";
import { MarketsMap } from "@/components/sections/MarketsMap";
import { PageHeader } from "@/components/sections/PageHeader";
import { PilotCta } from "@/components/sections/PilotCta";
import { Section, SectionHeader } from "@/components/sections/SectionHeader";
import { aboutPage as c } from "@/content/copy";
import { markets, team } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/about", title: t("about"), description: c.mission[0]! });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <>
      <PageHeader eyebrow={t("about")} title={c.title}>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-muted sm:text-xl">
          {c.mission.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </PageHeader>

      <Section>
        <SectionHeader title={c.teamTitle} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {team.map((m, i) => (
            <li key={m.name}>
              <GradientScene
                scene={(["teal", "violet", "rose"] as const)[i]!}
                className="rounded-panel p-2"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px]">
                  <Image
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover saturate-[0.9]"
                  />
                </div>
                <div className="relative mx-3 -mt-16 mb-1 rounded-card glass-1 px-4 py-3">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm text-ink-muted">{m.role}</div>
                </div>
              </GradientScene>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeader title={c.marketsTitle} />
        <div className="mt-10 rounded-panel bg-white/45 p-4 ring-1 ring-white/80 sm:p-8">
          <MarketsMap />
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((m) => (
            <li key={m.id} className="rounded-panel bg-white/55 p-6 ring-1 ring-white/80">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-h3">{m.name}</h3>
                <span className="font-mono text-xs text-ink-muted">{m.city}</span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">{m.focus}</p>
            </li>
          ))}
        </ul>
      </Section>

      <PilotCta location="about" />
    </>
  );
}

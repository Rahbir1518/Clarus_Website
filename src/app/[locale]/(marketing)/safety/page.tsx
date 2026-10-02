import { Check, MessageSquareOff } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SafetyGates } from "@/components/demo/SafetyGates";
import { GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { GateCards } from "@/components/sections/GateCards";
import { PageHeader } from "@/components/sections/PageHeader";
import { PilotCta } from "@/components/sections/PilotCta";
import { Section, SectionHeader } from "@/components/sections/SectionHeader";
import { safetyPage as c } from "@/content/copy";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, path: "/safety", title: t("safety"), description: c.sub });
}

export default async function SafetyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <>
      <PageHeader eyebrow={t("safety")} title={c.title} sub={c.sub} />

      {/* Gate passes / gate fails closed, side by side. */}
      <Section className="pt-10 sm:pt-14">
        <div className="grid gap-4 lg:grid-cols-2">
          <GradientScene scene="teal" className="rounded-panel p-5 sm:p-8">
            <p className="mb-4 text-eyebrow text-success-ink">Every gate passes</p>
            <SafetyGates initialVariant="pass" />
          </GradientScene>
          <GradientScene scene="rose" className="rounded-panel p-5 sm:p-8">
            <p className="mb-4 text-eyebrow text-danger-ink">One gate fails closed</p>
            <SafetyGates initialVariant="fail" />
          </GradientScene>
        </div>
      </Section>

      <Section>
        <GradientScene scene="night" className="rounded-panel p-6 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-eyebrow text-white/72">{c.rule.eyebrow}</p>
              <h2 className="mt-4 text-h2 text-white">{c.rule.title}</h2>
              <p className="mt-5 max-w-xl text-lg text-white/80">{c.rule.body}</p>
            </div>
            <GlassPanel tier="dark" rim className="p-5 sm:p-6">
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/72 uppercase">
                <MessageSquareOff className="size-3.5" /> Patient asks
              </div>
              <p className="mt-2 text-white">“Is it bad? What were the numbers?”</p>
              <div className="mt-5 font-mono text-[11px] text-white/72 uppercase">
                Clarus replies
              </div>
              <p className="mt-2 text-white">
                “I can&apos;t discuss results on this call. Dr. Jahan will go through them with you
                at the appointment. Would Thursday at 10:30 suit you?”
              </p>
            </GlassPanel>
          </div>
        </GradientScene>
      </Section>

      <Section>
        <SectionHeader title={c.gatesTitle} sub={c.gatesSub} />
        <div className="mt-10">
          <GateCards />
        </div>
      </Section>

      <Section>
        <SectionHeader title={c.data.title} />
        <div
          className="mt-10 overflow-x-auto rounded-panel bg-white/55 ring-1 ring-white/80"
          data-lenis-prevent
        >
          <table className="w-full min-w-[560px] text-start text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[11px] text-ink-muted uppercase">
                <th className="px-5 py-4 text-start font-normal">Where</th>
                <th className="px-5 py-4 text-start font-normal">Clinical detail?</th>
                <th className="px-5 py-4 text-start font-normal">What goes there</th>
              </tr>
            </thead>
            <tbody>
              {c.data.rows.map((r) => (
                <tr key={r.where} className="border-b border-line last:border-0">
                  <td className="px-5 py-4 font-medium">{r.where}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
                        r.clinical === "Never"
                          ? "bg-success/15 text-success-ink"
                          : "bg-ink/6 text-ink",
                      )}
                    >
                      {r.clinical}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-muted">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.hosting.map((h) => (
            <div key={h.title} className="rounded-panel bg-white/55 p-6 ring-1 ring-white/80">
              <h3 className="font-semibold">{h.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{h.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <GradientScene scene="violet" className="rounded-panel p-6 sm:p-12">
          <SectionHeader title={c.before.title} sub={c.before.sub} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {c.before.items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-card glass-1 p-4 font-medium"
              >
                <Check className="size-5 shrink-0 text-success-ink" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </GradientScene>
      </Section>

      <PilotCta location="safety" />
    </>
  );
}

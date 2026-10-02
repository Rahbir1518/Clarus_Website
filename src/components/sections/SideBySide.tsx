"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ClinicDashboard } from "@/components/demo/ClinicDashboard";
import { DemoTimeline, useDemo } from "@/components/demo/DemoTimeline";
import { PhoneScreen } from "@/components/demo/PhoneScreen";
import { GlassChip } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { home } from "@/content/copy";
import type { CallLanguage } from "@/content/demo-call";
import { track } from "@/lib/analytics";
import { Section, SectionHeader } from "./SectionHeader";

/** Both halves subscribe to one timeline, so they can't drift. */
export function SideBySide() {
  const c = home.sideBySide;
  const locale = useLocale();
  const lang = (locale === "en" ? "en" : locale) as CallLanguage;

  return (
    <Section>
      <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <DemoTimeline
        lang={lang}
        autoplay
        onPhase={(phase) => track("demo_step_viewed", { scene: "side_by_side", phase, lang })}
      >
        <GradientScene scene="violet" className="mt-12 rounded-panel p-4 sm:p-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
            <div>
              <GlassChip size="sm" className="mb-4">
                {c.patient}
              </GlassChip>
              <PhoneScreen />
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <GlassChip size="sm">{c.clinic}</GlassChip>
                <Controls />
              </div>
              <ClinicDashboard />
            </div>
          </div>
        </GradientScene>
      </DemoTimeline>
    </Section>
  );
}

function Controls() {
  const { playing, toggle, restart, state, duration } = useDemo();
  const t = useTranslations("demo");
  const ended = state.t >= duration;
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={ended ? restart : toggle}
        aria-label={ended ? t("replay") : playing ? t("pause") : t("play")}
        className="grid size-9 place-items-center rounded-full glass-1 hover:bg-white/80"
      >
        {ended ? (
          <RotateCcw className="size-4" />
        ) : playing ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        )}
      </button>
    </div>
  );
}

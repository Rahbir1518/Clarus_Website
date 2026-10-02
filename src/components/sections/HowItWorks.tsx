"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m, useInView } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AuditLog } from "@/components/demo/AuditLog";
import { ChannelPreview } from "@/components/demo/ChannelPreview";
import { AppWindow, ClinicCalendar } from "@/components/demo/ClinicCalendar";
import { DemoTimeline, useDemo } from "@/components/demo/DemoTimeline";
import { LabReportCard } from "@/components/demo/LabReportCard";
import { SafetyGates } from "@/components/demo/SafetyGates";
import { WorkflowCanvas } from "@/components/demo/WorkflowCanvas";
import { GradientScene } from "@/components/glass/GradientScene";
import { home } from "@/content/copy";
import { phaseAt, type CallLanguage } from "@/content/demo-call";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "./SectionHeader";

function StepScene({ index, lang }: { index: number; lang: CallLanguage }) {
  switch (index) {
    case 0:
      return <LabReportCard />;
    case 1:
      return <WorkflowCanvas className="max-w-[440px]" />;
    case 2:
      return <SafetyGates interactive className="w-full max-w-xl" />;
    case 3:
      return <ChannelPreview lang={lang} />;
    default:
      return <OutcomeScene lang={lang} />;
  }
}

/** Step 5: the call has just ended; the slot locks and the audit row lands. */
function OutcomeScene({ lang }: { lang: CallLanguage }) {
  return (
    <DemoTimeline
      lang={lang}
      autoplay
      initialT={phaseAt.booked - 1500}
      className="w-full max-w-xl space-y-3"
    >
      <AppWindow title="Appointments" meta={<span>Week of 5 Oct</span>}>
        <ClinicCalendar dense />
      </AppWindow>
      <OutcomeLog />
    </DemoTimeline>
  );
}

function OutcomeLog() {
  const { state } = useDemo();
  return (
    <div className="rounded-card bg-white/60 p-3 ring-1 ring-white/70">
      <AuditLog events={state.audit} max={3} className="min-h-[6.4rem]" />
    </div>
  );
}

export function HowItWorks({ withHeader = true }: { withHeader?: boolean }) {
  const c = home.howItWorks;
  const locale = useLocale();
  const lang: CallLanguage = locale === "ar" ? "ar" : locale === "bn" ? "bn" : "en";
  const [active, setActive] = useState(0);

  return (
    <Section id="how-it-works" aria-label={c.title}>
      {withHeader ? (
        <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      ) : (
        <h2 className="sr-only">{c.title}</h2>
      )}

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* Desktop: one pinned scene that changes as the steps scroll past. */}
        <div className="hidden min-w-0 lg:block">
          <div className="sticky top-28">
            <GradientScene
              scene="violet"
              className="grid h-[min(620px,calc(100vh-9rem))] grid-cols-[minmax(0,1fr)] place-items-center rounded-panel p-8"
            >
              <AnimatePresence mode="wait">
                <m.div
                  key={active}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: glide }}
                  className="flex w-full justify-center"
                >
                  <StepScene index={active} lang={lang} />
                </m.div>
              </AnimatePresence>
              <span className="absolute start-6 top-5 font-mono text-[11px] text-ink-muted">
                Product demo
              </span>
              <Progress active={active} />
            </GradientScene>
          </div>
        </div>

        <ol className="min-w-0 space-y-6 lg:space-y-0">
          {c.steps.map((step, i) => (
            <Step
              key={step.title}
              index={i}
              active={active === i}
              onActive={() => setActive(i)}
              step={step}
            >
              {/* Mobile: each step carries its own scene. */}
              <GradientScene
                scene="violet"
                className="mt-6 grid min-h-[380px] grid-cols-[minmax(0,1fr)] place-items-center rounded-panel px-4 py-10 lg:hidden"
              >
                <StepScene index={i} lang={lang} />
              </GradientScene>
            </Step>
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Step({
  index,
  active,
  onActive,
  step,
  children,
}: {
  index: number;
  active: boolean;
  onActive: () => void;
  step: (typeof home.howItWorks.steps)[number];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // The step crossing the middle of the viewport is the active one.
  const inMiddle = useInView(ref, { margin: "-48% 0px -48% 0px" });
  useEffect(() => {
    if (inMiddle) onActive();
  }, [inMiddle, onActive]);

  return (
    <li ref={ref} className="lg:flex lg:min-h-[78vh] lg:items-center">
      <div
        // Inactive steps stay fully legible (dimming them failed AA contrast); the
        // active one gets an accent rule on its leading edge instead.
        className={cn(
          "border-s-2 border-transparent transition-colors duration-500 lg:ps-6",
          active && "lg:border-ink",
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full font-mono text-sm transition-colors duration-300",
              active ? "bg-ink text-white" : "bg-white/60 text-ink ring-1 ring-ink/10",
            )}
          >
            {index + 1}
          </span>
          <span className="text-eyebrow text-ink-muted">Step {index + 1} of 5</span>
        </div>
        <h3 className="mt-5 text-[clamp(1.6rem,1.2rem+1.4vw,2.25rem)] leading-tight font-[550] tracking-[-0.025em]">
          {step.title}
        </h3>
        <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink-muted">{step.body}</p>
        <ul className="mt-5 space-y-2">
          {step.facts.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-success-ink" strokeWidth={2.5} />
              {f}
            </li>
          ))}
        </ul>
        {children}
      </div>
    </li>
  );
}

function Progress({ active }: { active: number }) {
  return (
    <div className="absolute end-6 top-5 flex gap-1.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            i === active ? "w-6 bg-ink" : "w-1.5 bg-ink/25",
          )}
        />
      ))}
    </div>
  );
}

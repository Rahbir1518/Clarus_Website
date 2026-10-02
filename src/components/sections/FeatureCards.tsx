"use client";

import { CalendarClock, Clock3, MessageCircle, MousePointer2, PhoneCall, Zap } from "lucide-react";
import { AnimatePresence, m, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AuditLog } from "@/components/demo/AuditLog";
import { WorkflowNode } from "@/components/demo/WorkflowCanvas";
import { GlassChip, GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { home } from "@/content/copy";
import { auditEvents, type CallLanguage } from "@/content/demo-call";
import type { SceneName } from "@/lib/scenes";
import { glide } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "./SectionHeader";

/** Counts 0…n once the element is on screen. Reduced motion: straight to n. */
function useSequence(n: number, stepMs: number) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= n) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [inView, reduced, n, stepMs]);
  return { ref, step: reduced ? n : step };
}

const reveal = (on: boolean) => ({
  initial: false as const,
  animate: on ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.97 },
  transition: { duration: 0.4, ease: glide },
});

function FreeTimesMock() {
  const { ref, step } = useSequence(4, 700);
  return (
    <div ref={ref} className="flex w-full max-w-sm flex-col gap-2.5">
      <m.div
        {...reveal(step >= 1)}
        className="self-end rounded-2xl rounded-se-md bg-white px-3.5 py-2 text-sm shadow-sm"
      >
        Friday evening?
      </m.div>
      <m.div {...reveal(step >= 2)} className="self-start">
        <GlassChip size="sm" className="text-warning-ink">
          <Clock3 className="size-3.5" /> Closed on Fridays
        </GlassChip>
      </m.div>
      <m.div
        {...reveal(step >= 3)}
        className="self-start rounded-2xl rounded-ss-md glass-2 px-3.5 py-2.5 text-sm shadow-none"
      >
        I can offer Thursday 10:30 or Saturday 11:00.
      </m.div>
      <m.div {...reveal(step >= 4)} className="flex gap-2 self-start">
        {["Thu 10:30", "Sat 11:00"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-2/14 px-3 py-1.5 font-mono text-xs text-[#3442C9] ring-1 ring-brand-2/40"
          >
            <CalendarClock className="size-3.5" /> {t} · free
          </span>
        ))}
      </m.div>
    </div>
  );
}

const phrase: Record<CallLanguage, string> = {
  bn: "বৃহস্পতিবার সকাল ১০:৩০ খালি আছে। বুক করে দেব?",
  ar: "الخميس الساعة 10:30 متاح. هل أحجزه لك؟",
  en: "Thursday at 10:30 is free. Shall I book it?",
};
const langOrder: CallLanguage[] = ["bn", "ar", "en"];
const langName: Record<CallLanguage, string> = { bn: "বাংলা", ar: "العربية", en: "English" };

function LanguageMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = usePrefersReducedMotion();
  const [lang, setLang] = useState<CallLanguage>("bn");
  const [touched, setTouched] = useState(false);

  // One pass through the three languages (under 5 seconds), then it stays put.
  useEffect(() => {
    if (!inView || reduced || touched) return;
    const timers = [1600, 3200].map((ms, i) => setTimeout(() => setLang(langOrder[i + 1]!), ms));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced, touched]);

  return (
    <div ref={ref} className="w-full max-w-sm">
      <div
        role="radiogroup"
        aria-label="Language"
        className="mb-3 inline-flex rounded-full glass-1 p-1 text-xs"
      >
        {langOrder.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={lang === l}
            onClick={() => {
              setTouched(true);
              setLang(l);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 font-medium transition-colors",
              lang === l ? "bg-ink text-white" : "text-ink-muted hover:text-ink",
            )}
          >
            {langName[l]}
          </button>
        ))}
      </div>
      <GlassPanel radius="card" className="min-h-[7.5rem] p-4">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-wide text-ink-muted uppercase">
          <PhoneCall className="size-3" /> Clarus
        </div>
        <AnimatePresence mode="wait">
          <m.p
            key={lang}
            lang={lang}
            dir={lang === "ar" ? "rtl" : "ltr"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: glide }}
            className="text-lg leading-snug font-medium"
          >
            {phrase[lang]}
          </m.p>
        </AnimatePresence>
      </GlassPanel>
    </div>
  );
}

function DragMock() {
  const { ref, step } = useSequence(3, 900);
  const placed = step >= 2;
  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div className="space-y-3">
        <WorkflowNode
          node={{ title: "Appointment missed", sub: "trigger", icon: Zap, kind: "trigger" }}
        />
        <div className="ms-6 h-4 w-px bg-ink/25" aria-hidden />
        <div
          className={cn(
            "rounded-chip transition-all duration-300",
            placed ? "" : "border border-dashed border-ink/30 bg-white/30 p-[3px]",
          )}
        >
          {placed ? (
            <m.div
              initial={{ scale: 0.94, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: glide }}
            >
              <WorkflowNode
                node={{
                  title: "Send WhatsApp",
                  sub: "reason: missed_appointment",
                  icon: MessageCircle,
                  kind: "action",
                }}
                active
              />
            </m.div>
          ) : (
            <div className="grid h-[2.85rem] place-items-center font-mono text-[11px] text-ink-muted">
              drop an action here
            </div>
          )}
        </div>
      </div>

      {/* The node being dragged in from the palette, and the cursor carrying it. */}
      {!placed && (
        <m.div
          aria-hidden
          initial={false}
          animate={step >= 1 ? { x: 0, y: 0, opacity: 1 } : { x: 70, y: 70, opacity: 0.9 }}
          transition={{ duration: 0.8, ease: glide }}
          className="pointer-events-none absolute start-0 top-[5.45rem] w-full rotate-[-2deg]"
        >
          <div className="opacity-80">
            <WorkflowNode
              node={{
                title: "Send WhatsApp",
                sub: "reason: missed_appointment",
                icon: MessageCircle,
                kind: "action",
              }}
            />
          </div>
          <MousePointer2 className="absolute end-6 -bottom-3 size-5 fill-ink text-white" />
        </m.div>
      )}
    </div>
  );
}

function AuditMock() {
  const { ref, step } = useSequence(auditEvents.length, 450);
  return (
    <div ref={ref} className="w-full max-w-md">
      <GlassPanel tier="dark" radius="card" className="p-3">
        <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] tracking-wide text-white/72 uppercase">
          <span>Rafiq Ahmed · audit trail</span>
          <span>8 Oct</span>
        </div>
        <AuditLog
          events={auditEvents.slice(0, Math.max(1, step))}
          max={6}
          tone="dark"
          className="min-h-[13rem]"
        />
      </GlassPanel>
    </div>
  );
}

const mocks = [FreeTimesMock, LanguageMock, DragMock, AuditMock];
const sceneFor: SceneName[] = ["teal", "violet", "rose", "night"];

export function FeatureCards() {
  const c = home.features;
  return (
    <Section>
      <SectionHeader eyebrow={c.eyebrow} title={c.title} />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {c.cards.map((card, i) => {
          const Mock = mocks[i]!;
          const dark = sceneFor[i] === "night";
          return (
            <GradientScene
              key={card.title}
              scene={sceneFor[i]!}
              className="flex min-h-[440px] flex-col rounded-panel p-6 sm:p-8"
            >
              <div className="grid flex-1 grid-cols-[minmax(0,1fr)] place-items-center py-6">
                <Mock />
              </div>
              <h3 className={cn("text-h3", dark && "text-white")}>{card.title}</h3>
              <p className={cn("mt-2 max-w-md", dark ? "text-white/80" : "text-ink-muted")}>
                {card.body}
              </p>
            </GradientScene>
          );
        })}
      </div>
    </Section>
  );
}

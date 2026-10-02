"use client";

import { PhoneOff } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { patient } from "@/content/demo-call";
import { GlassPanel } from "@/components/glass/Glass";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useDemo } from "./DemoTimeline";
import { TranscriptLine } from "./TranscriptLine";
import { Waveform } from "./Waveform";

/** The dark floating AI call panel: who, how long, a live waveform and the last few lines. */
export function CallPanel({
  window = 3,
  gloss = true,
  className,
  transcriptClassName,
}: {
  window?: number;
  gloss?: boolean;
  className?: string;
  transcriptClassName?: string;
}) {
  const { state } = useDemo();
  const ended = state.phase === "logged";
  const status =
    state.phase === "idle"
      ? "Ready"
      : state.phase === "dialing"
        ? "Dialing…"
        : ended
          ? "Call ended"
          : "On call";
  const lines = state.lines.slice(-window);

  return (
    <GlassPanel tier="dark" rim className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-center gap-3">
        <span
          dir="ltr"
          className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/12 text-sm font-medium ring-1 ring-white/20"
        >
          {patient.initials}
          {!ended && state.phase !== "idle" && (
            <span className="absolute -end-0.5 -bottom-0.5 size-3 rounded-full bg-success ring-2 ring-[#1b2433]" />
          )}
        </span>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{patient.name}</div>
          <div className="font-mono text-xs text-white/72">
            {status} · {state.timer}
          </div>
        </div>
        {ended ? (
          <PhoneOff aria-hidden className="ms-auto size-4 text-white/72" />
        ) : (
          <Waveform active={state.speaking !== null} bars={16} className="ms-auto text-white/85" />
        )}
      </div>

      <div
        aria-live="polite"
        className={cn(
          "mt-4 flex h-[13.5rem] flex-col justify-end gap-3 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_22%)]",
          transcriptClassName,
        )}
      >
        <AnimatePresence initial={false}>
          {lines.map((line) => (
            <m.div
              key={line.index}
              layout="position"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: glide }}
            >
              <TranscriptLine line={line} lang={state.lang} gloss={gloss} size="sm" />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}

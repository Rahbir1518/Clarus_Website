"use client";

import { MessageSquare, Mic, PhoneOff, Volume2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { clinic } from "@/content/demo-call";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useDemo } from "./DemoTimeline";
import { TranscriptLine } from "./TranscriptLine";
import { Waveform } from "./Waveform";

/** What the patient hears: their phone, mid-call. */
export function PhoneScreen({ className }: { className?: string }) {
  const { state } = useDemo();
  const ended = state.phase === "logged";
  const lines = state.lines.slice(-3);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[300px] rounded-[44px] bg-[#0b111c] p-2.5 shadow-[0_40px_80px_-30px_rgb(14_23_38/0.6)] ring-1 ring-black/40",
        className,
      )}
    >
      <div
        className="relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[36px] px-4 pt-3 pb-5 text-white"
        style={{
          background:
            "radial-gradient(at 20% 0%, #2f3b77 0, transparent 60%), radial-gradient(at 100% 60%, #1c5a63 0, transparent 55%), #111827",
        }}
      >
        <div className="mx-auto mb-3 h-5 w-24 rounded-full bg-black" aria-hidden />

        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-white/12 text-sm font-semibold ring-1 ring-white/20">
            GR
          </div>
          <div className="mt-2 text-[0.95rem] font-semibold">{clinic.name}</div>
          <div className="font-mono text-[11px] text-white/72">
            {ended ? "Call ended" : "Automated call"} · {state.timer}
          </div>
          {!ended && (
            <Waveform
              active={state.speaking === "agent"}
              bars={14}
              className="mx-auto mt-2 h-5 justify-center text-white/80"
            />
          )}
        </div>

        <div
          aria-live="polite"
          className="mt-3 flex flex-1 flex-col justify-end gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_20%)]"
        >
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <m.div
                key={line.index}
                layout="position"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: glide }}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3 py-2",
                  line.speaker === "agent"
                    ? "self-start rounded-ss-md bg-white/10"
                    : "self-end rounded-se-md bg-[#5B6CFF]/55",
                )}
              >
                <TranscriptLine
                  line={line}
                  lang={state.lang}
                  gloss={false}
                  size="sm"
                  className="[&>div:first-child]:hidden"
                />
              </m.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {ended && (
              <m.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: glide }}
                className="mt-1 rounded-2xl bg-white px-3 py-2.5 text-ink"
              >
                <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-ink-muted uppercase">
                  <MessageSquare className="size-3" /> Message · now
                </div>
                <p className="mt-1 text-xs leading-snug">
                  Your appointment is confirmed: <b>Thu 8 Oct, 10:30</b> with {clinic.doctorShort}.
                </p>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex justify-center gap-5" aria-hidden>
          <span className="grid size-11 place-items-center rounded-full bg-white/12">
            <Mic className="size-4" />
          </span>
          <span
            className={cn(
              "grid size-11 place-items-center rounded-full",
              ended ? "bg-white/12" : "bg-danger",
            )}
          >
            <PhoneOff className="size-4" />
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-white/12">
            <Volume2 className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

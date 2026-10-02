"use client";

import { Check, Loader, RotateCcw } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useState } from "react";
import { GlassChip, GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { Button } from "@/components/ui/button";
import { floatIn, glide, pop } from "@/lib/motion";

const line = "Thursday at 10:30 works. I've booked it for you.";

/** float in → chip pops → line types → slot pulses → slot locks green. */
export function MotionDemo() {
  const reduced = usePrefersReducedMotion();
  const [run, setRun] = useState(0);
  const [played, setStep] = useState(0);
  const step = reduced ? 4 : played;

  useEffect(() => {
    if (reduced) return;
    const timers = [400, 1000, 2600, 3800].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => {
      timers.forEach(clearTimeout);
      setStep(0);
    };
  }, [run, reduced]);

  return (
    <GradientScene scene="teal" className="rounded-panel p-6 sm:p-10">
      <div className="flex min-h-[260px] flex-col items-start gap-5 sm:flex-row sm:items-center">
        <m.div
          key={run}
          variants={floatIn}
          initial={reduced ? "show" : "hidden"}
          animate="show"
          className="w-full max-w-sm"
        >
          <GlassPanel tier="dark" rim className="p-5">
            <div className="text-eyebrow text-white/72">Transcript</div>
            <p className="mt-3 min-h-[3em] font-mono text-sm leading-relaxed" aria-live="polite">
              {step >= 2 ? <Typed text={line} instant={!!reduced} /> : " "}
            </p>
          </GlassPanel>
        </m.div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {step >= 1 && step < 4 && (
              <m.div key="chip" variants={pop} initial="hidden" animate="show" exit="hidden">
                <GlassChip>
                  <Loader className="size-4 text-brand-2" /> Checking free slots…
                </GlassChip>
              </m.div>
            )}
          </AnimatePresence>
          <div className="flex gap-2">
            {["09:00", "10:30", "12:00"].map((t) => {
              const isTarget = t === "10:30";
              const booked = isTarget && step >= 4;
              const checking = isTarget && step === 3;
              return (
                <m.div
                  key={t}
                  animate={{ scale: booked ? [1, 1.06, 1] : 1 }}
                  transition={{ duration: 0.4, ease: glide }}
                  className={[
                    "flex h-14 w-20 flex-col items-center justify-center rounded-chip text-xs ring-1 transition-colors duration-300",
                    booked
                      ? "bg-success text-white ring-success"
                      : checking
                        ? "animate-pulse-slot bg-white/70 ring-brand-2"
                        : "bg-white/55 text-ink ring-white/70",
                  ].join(" ")}
                >
                  <span className="font-mono">{t}</span>
                  {booked && <Check className="mt-0.5 size-3.5" strokeWidth={3} />}
                </m.div>
              );
            })}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="sm:ms-auto"
          onClick={() => setRun((r) => r + 1)}
          disabled={!!reduced}
        >
          <RotateCcw /> Replay
        </Button>
      </div>
    </GradientScene>
  );
}

function Typed({ text, instant }: { text: string; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) return;
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 22);
    return () => clearInterval(id);
  }, [text, instant]);
  return (
    <>
      <span>{text.slice(0, n)}</span>
      <span className="sr-only">{text.slice(n)}</span>
    </>
  );
}

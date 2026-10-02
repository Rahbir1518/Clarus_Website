"use client";

import { Check, Phone, RotateCcw, ShieldX, X } from "lucide-react";
import { m, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { demoFailingGate, gates } from "@/content/gates";
import { glide } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type Variant = "pass" | "fail";

/**
 * The 8 checks, ticking green one by one. The "fail" variant stops at a
 * failing gate: it turns red, and nothing after it runs. No call is made.
 */
export function SafetyGates({
  initialVariant = "pass",
  interactive = false,
  className,
}: {
  initialVariant?: Variant;
  interactive?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);

  const failIndex = variant === "fail" ? gates.findIndex((g) => g.id === demoFailingGate) : -1;
  const stopAt = failIndex >= 0 ? failIndex + 1 : gates.length;
  const shown = reduced ? stopAt : step;

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= stopAt) clearInterval(id);
    }, 260);
    return () => {
      clearInterval(id);
      setStep(0);
    };
  }, [inView, reduced, stopAt, run]);

  const done = shown >= stopAt;
  const failed = failIndex >= 0 && done;

  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      {interactive && (
        <div
          role="radiogroup"
          aria-label="Show"
          className="inline-flex rounded-full glass-1 p-1 text-xs"
        >
          {(["pass", "fail"] as const).map((v) => (
            <button
              key={v}
              role="radio"
              aria-checked={variant === v}
              onClick={() => {
                setVariant(v);
                setRun((r) => r + 1);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 font-medium transition-colors",
                variant === v ? "bg-ink text-white" : "text-ink-muted hover:text-ink",
              )}
            >
              {v === "pass" ? "All gates pass" : "A gate fails"}
            </button>
          ))}
        </div>
      )}

      <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {gates.map((g, i) => {
          const state =
            i < shown
              ? i === failIndex
                ? "fail"
                : "pass"
              : failIndex >= 0 && i > failIndex && done
                ? "skipped"
                : "pending";
          return (
            <li
              key={g.id}
              className={cn(
                "flex items-center gap-2.5 rounded-chip glass-1 px-3 py-2 text-[0.82rem] transition-opacity duration-300",
                state === "skipped" && "opacity-45",
                state === "fail" && "bg-danger/12 ring-1 ring-danger/50",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-200",
                  state === "pass" && "bg-success text-white",
                  state === "fail" && "bg-danger text-white",
                  (state === "pending" || state === "skipped") && "ring-1 ring-ink/20 ring-inset",
                )}
              >
                {state === "pass" && <Check className="size-3" strokeWidth={3} />}
                {state === "fail" && <X className="size-3" strokeWidth={3} />}
              </span>
              <span className="font-mono text-[10px] text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={cn("font-medium", state === "fail" && "text-danger-ink")}>
                {g.label}
              </span>
              <span className="sr-only">
                {state === "pass"
                  ? "passed"
                  : state === "fail"
                    ? "failed"
                    : state === "skipped"
                      ? "not run"
                      : "pending"}
              </span>
            </li>
          );
        })}
      </ol>

      <div aria-live="polite" className="min-h-12">
        {done && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: glide }}
            className={cn(
              "flex items-start gap-3 rounded-chip px-4 py-3 text-sm",
              failed
                ? "bg-danger/10 text-danger-ink ring-1 ring-danger/40"
                : "bg-success/12 text-success-ink ring-1 ring-success/40",
            )}
          >
            {failed ? (
              <ShieldX className="mt-0.5 size-4 shrink-0" />
            ) : (
              <Phone className="mt-0.5 size-4 shrink-0" />
            )}
            <div>
              <div className="font-semibold">
                {failed ? "Failed closed. No call made." : "All 8 passed. Dialling."}
              </div>
              {failed && <div className="mt-0.5 text-ink-muted">{gates[failIndex]!.failure}</div>}
            </div>
            {interactive && (
              <button
                onClick={() => setRun((r) => r + 1)}
                className="ms-auto shrink-0 rounded-full p-1 text-ink-muted hover:bg-ink/5 hover:text-ink"
                aria-label="Replay"
              >
                <RotateCcw className="size-4" />
              </button>
            )}
          </m.div>
        )}
      </div>
    </div>
  );
}

"use client";

import { FileText, ShieldCheck } from "lucide-react";
import { m, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { GlassChip } from "@/components/glass/Glass";
import { glide } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const fields = [
  { k: "Patient", v: "Rafiq Ahmed", extract: true },
  { k: "Collected", v: "28 Sep 2026", extract: false },
  { k: "Test", v: "HbA1c", extract: true },
  { k: "Result", v: "6.4 %  (target < 7.0 %)", extract: true },
  { k: "Follow-up", v: "Due within 2 weeks", extract: true },
];

/** A lab report PDF arriving, with the fields Clarus reads lighting up in turn. */
export function LabReportCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [lit, setLit] = useState(0);
  const extractable = fields.filter((f) => f.extract).length;
  const shown = reduced ? extractable : lit;

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setLit(i);
      if (i >= extractable) clearInterval(id);
    }, 450);
    return () => clearInterval(id);
  }, [inView, reduced, extractable]);

  let n = 0;
  return (
    <div ref={ref} className={cn("relative mx-auto w-full max-w-sm", className)}>
      <m.div
        initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : -24, rotate: reduced ? 0 : -3 }}
        animate={inView || reduced ? { opacity: 1, y: 0, rotate: -1.5 } : undefined}
        transition={{ duration: 0.6, ease: glide }}
        className="rounded-card bg-white p-5 shadow-[0_30px_60px_-25px_rgb(14_23_38/0.45)] ring-1 ring-ink/5"
      >
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <span className="grid size-8 place-items-center rounded-lg bg-danger/10 text-danger-ink">
            <FileText className="size-4" />
          </span>
          <div>
            <div className="text-sm font-semibold">Laboratory report</div>
            <div className="font-mono text-[10px] text-ink-faint">lab-report-RA-0928.pdf</div>
          </div>
        </div>
        <dl className="mt-3 space-y-1.5 text-xs">
          {fields.map((f) => {
            const on = f.extract && ++n <= shown;
            return (
              <div
                key={f.k}
                className={cn(
                  "flex justify-between gap-3 rounded-md px-2 py-1.5 transition-colors duration-300",
                  on ? "bg-brand-2/12 ring-1 ring-brand-2/40" : "",
                )}
              >
                <dt className="text-ink-muted">{f.k}</dt>
                <dd className="font-medium">{f.v}</dd>
              </div>
            );
          })}
        </dl>
        <div className="mt-3 space-y-1" aria-hidden>
          <div className="h-1.5 w-11/12 rounded bg-ink/6" />
          <div className="h-1.5 w-3/4 rounded bg-ink/6" />
        </div>
      </m.div>

      <GlassChip className="absolute start-1/2 -bottom-5 -translate-x-1/2 text-xs whitespace-normal sm:whitespace-nowrap rtl:translate-x-1/2">
        <ShieldCheck className="size-4 shrink-0 text-success-ink" />
        Parsed on our servers. Never sent to an AI model.
      </GlassChip>
    </div>
  );
}

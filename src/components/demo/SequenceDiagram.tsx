"use client";

import { ChevronRight, RotateCw } from "lucide-react";
import { m, useInView } from "motion/react";
import { useRef } from "react";
import { glide } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const actors = ["Clinic", "Clarus", "Calendar", "Patient"] as const;
type Actor = 0 | 1 | 2 | 3;

const messages: { from: Actor; to: Actor; label: string; tone?: "check" | "book" }[] = [
  { from: 0, to: 1, label: "Lab result PDF arrives" },
  { from: 1, to: 1, label: "Workflow + 8 safety checks", tone: "check" },
  { from: 1, to: 3, label: "Call: your results are ready" },
  { from: 3, to: 1, label: "“Friday evening?”" },
  { from: 1, to: 2, label: "Which times are free?" },
  { from: 2, to: 1, label: "Fri closed · Thu 10:30, Sat 11:00" },
  { from: 1, to: 3, label: "“Thursday 10:30 or Saturday 11:00”" },
  { from: 3, to: 1, label: "“Thursday 10:30”" },
  { from: 1, to: 2, label: "Book Thu 10:30", tone: "book" },
  { from: 1, to: 0, label: "Summary, transcript, audit entry" },
];

/** The call as a sequence diagram: who talks to whom, in order. */
export function SequenceDiagram({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const reduced = usePrefersReducedMotion();
  const show = inView || reduced;
  const col = (i: number) => `${((i + 0.5) / actors.length) * 100}%`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <ol className="sr-only">
        {messages.map((msg, i) => (
          <li key={i}>
            {actors[msg.from]} to {actors[msg.to]}: {msg.label}
          </li>
        ))}
      </ol>

      <div aria-hidden>
        <div className="grid grid-cols-4 gap-2">
          {actors.map((a, i) => (
            <div
              key={a}
              className={cn(
                "mx-auto rounded-full glass-2 px-3 py-1.5 text-center text-xs font-semibold shadow-none sm:px-4 sm:text-sm",
                i === 1 && "bg-ink text-white",
              )}
            >
              {a}
            </div>
          ))}
        </div>

        <div className="relative mt-3">
          {/* lifelines */}
          {actors.map((a, i) => (
            <span
              key={a}
              className="absolute top-0 bottom-0 w-px border-s border-dashed border-ink/20"
              style={{ insetInlineStart: col(i) }}
            />
          ))}

          <ol className="relative space-y-1">
            {messages.map((msg, i) => {
              const self = msg.from === msg.to;
              const lo = Math.min(msg.from, msg.to);
              const hi = Math.max(msg.from, msg.to);
              const toEnd = msg.to > msg.from;
              return (
                <m.li
                  key={i}
                  initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 6 }}
                  animate={show ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.35, delay: reduced ? 0 : i * 0.18, ease: glide }}
                  className="relative h-12 sm:h-11"
                >
                  {self ? (
                    <div
                      className="absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[10px] font-medium whitespace-nowrap text-success-ink sm:text-xs"
                      style={{ insetInlineStart: `calc(${col(msg.from)} + 10px)` }}
                    >
                      <RotateCw className="size-3" /> {msg.label}
                    </div>
                  ) : (
                    <div
                      className="absolute bottom-2.5"
                      style={{
                        insetInlineStart: col(lo),
                        width: `${((hi - lo) / actors.length) * 100}%`,
                      }}
                    >
                      <div className="mb-1 truncate px-1 text-center text-[10px] text-ink-muted sm:text-xs">
                        {msg.label}
                      </div>
                      <div
                        className={cn("flex items-center", toEnd ? "justify-end" : "justify-start")}
                      >
                        {!toEnd && (
                          <ChevronRight className="-me-1.5 size-3.5 shrink-0 rotate-180 text-ink/60 rtl:rotate-0" />
                        )}
                        <span
                          className={cn(
                            "h-px flex-1",
                            msg.tone === "book" ? "bg-success" : "bg-ink/50",
                          )}
                        />
                        {toEnd && (
                          <ChevronRight className="-ms-1.5 size-3.5 shrink-0 text-ink/60 rtl:rotate-180" />
                        )}
                      </div>
                    </div>
                  )}
                </m.li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

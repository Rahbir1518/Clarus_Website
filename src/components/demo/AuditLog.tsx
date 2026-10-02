"use client";

import { AnimatePresence, m } from "motion/react";
import type { auditEvents } from "@/content/demo-call";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Event = (typeof auditEvents)[number];

/** Timestamped audit rows. New rows slide in; the newest sits at the bottom. */
export function AuditLog({
  events,
  max = 6,
  tone = "light",
  className,
}: {
  events: readonly Event[];
  max?: number;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  const rows = events.slice(-max);
  return (
    <ol aria-label="Audit log" className={cn("space-y-1.5 font-mono text-[11px]", className)}>
      <AnimatePresence initial={false}>
        {rows.map((e) => (
          <m.li
            key={e.event}
            layout="position"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: glide }}
            className={cn(
              "flex min-w-0 items-center gap-2 rounded-lg px-2.5 py-1.5",
              dark ? "bg-white/8 text-white" : "bg-white/60 text-ink ring-1 ring-white/70",
            )}
          >
            <span className={dark ? "text-white/72" : "text-ink-muted"}>{e.time}</span>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5",
                e.event === "appointment.created"
                  ? "bg-success/15 text-success-ink"
                  : dark
                    ? "bg-white/10"
                    : "bg-ink/6",
                dark && e.event === "appointment.created" && "bg-success/25 text-white",
              )}
            >
              {e.event}
            </span>
            <span
              className={cn(
                "truncate font-sans text-xs",
                dark ? "text-white/80" : "text-ink-muted",
              )}
            >
              {e.detail}
            </span>
          </m.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}

"use client";

import { Check, Lock } from "lucide-react";
import { m } from "motion/react";
import {
  bookings,
  clinic,
  days,
  offered,
  picked,
  times,
  type AppointmentKind,
  type DayKey,
} from "@/content/demo-call";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { atLeast, useDemoPhase } from "./DemoTimeline";

const kindStyle: Record<AppointmentKind, string> = {
  "follow-up": "bg-[#E6E9FF] border-[#5B6CFF]",
  "check-up": "bg-[#DCF2EA] border-[#2A9D80]",
  "lab-review": "bg-[#F5E4F3] border-[#A65A9E]",
  new: "bg-[#ECEFF4] border-[#7D889B]",
};

const kindLabel: Record<AppointmentKind, string> = {
  "follow-up": "Follow-up",
  "check-up": "Check-up",
  "lab-review": "Lab review",
  new: "New patient",
};

/** On phones only Wed–Sat fit; the call is about Thu, Fri and Sat. */
const mobileHidden: DayKey[] = ["Mon", "Tue"];

/**
 * Clarus's appointments week view, driven by the demo timeline:
 * checking → Friday shows closed and free cells are scanned;
 * offering → the two offered cells pulse; booked → Thu 10:30 locks green.
 */
export function ClinicCalendar({
  dense = false,
  className,
}: {
  dense?: boolean;
  className?: string;
}) {
  const phase = useDemoPhase();
  const checking = phase === "checking";
  const offering = phase === "offering";
  const booked = atLeast(phase, "booked");

  // Dense everywhere on phones; roomier rows from sm up unless asked to stay dense.
  const rowH = dense ? "h-9" : "h-9 sm:h-11";

  return (
    <div
      role="grid"
      aria-label="Appointments, week of 5 October"
      className={cn(
        "grid gap-1 text-[11px]",
        "[grid-template-columns:2.25rem_repeat(4,minmax(0,1fr))] sm:[grid-template-columns:2.75rem_repeat(6,minmax(0,1fr))]",
        className,
      )}
    >
      {/* header */}
      <Row>
        <div role="columnheader" aria-label="Time" />
        {days.map((d) => (
          <div
            key={d.key}
            role="columnheader"
            className={cn(
              "pb-1 text-center",
              mobileHidden.includes(d.key) && "hidden sm:block",
              d.key === clinic.closedDay ? "text-ink-faint" : "text-ink-muted",
            )}
          >
            <span className="font-medium">{d.key}</span> <span className="font-mono">{d.date}</span>
          </div>
        ))}
      </Row>

      {times.map((time, row) => (
        <Row key={time}>
          <div
            role="rowheader"
            className={cn("flex items-start pt-1 font-mono text-[10px] text-ink-faint", rowH)}
          >
            {time}
          </div>
          {days.map((d) => {
            const hide = mobileHidden.includes(d.key) && "hidden sm:block";
            if (d.key === clinic.closedDay) {
              // One tall cell for the whole closed day, placed on the first row.
              return row === 0 ? (
                <ClosedDay key={d.key} highlight={checking} rows={times.length} />
              ) : null;
            }
            const booking = bookings.find((b) => b.day === d.key && b.time === time);
            const isPicked = picked.day === d.key && picked.time === time;
            const isOffered = offered.some((o) => o.day === d.key && o.time === time);

            if (booking) {
              return (
                <div
                  key={d.key}
                  role="gridcell"
                  className={cn(
                    "min-w-0 overflow-hidden rounded-[7px] border-s-2 px-1.5 py-1 text-ink",
                    rowH,
                    kindStyle[booking.kind],
                    hide,
                  )}
                  title={`${booking.who} · ${kindLabel[booking.kind]}`}
                >
                  <div className="truncate font-medium">{booking.who}</div>
                  {!dense && (
                    <div className="hidden truncate text-[10px] text-ink-muted sm:block">
                      {kindLabel[booking.kind]}
                    </div>
                  )}
                </div>
              );
            }

            if (isPicked && booked) {
              return (
                <m.div
                  key={d.key}
                  role="gridcell"
                  initial={{ scale: 0.92 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.45, ease: glide }}
                  className={cn(
                    "relative z-10 flex min-w-0 flex-col justify-center overflow-hidden rounded-[7px] bg-success px-1.5 text-white shadow-[0_8px_20px_-8px_rgb(24_169_87/0.8)]",
                    rowH,
                    hide,
                  )}
                >
                  <div className="flex items-center gap-1 truncate font-semibold">
                    <Lock className="size-3 shrink-0" strokeWidth={2.5} /> R. Ahmed
                  </div>
                  {!dense && (
                    <div className="hidden truncate text-[10px] text-white/90 sm:block">
                      Booked by Clarus
                    </div>
                  )}
                </m.div>
              );
            }

            const glowing = offering && isOffered;
            return (
              <div
                key={d.key}
                role="gridcell"
                aria-label={glowing ? `${d.key} ${time}, free, offered` : `${d.key} ${time}, free`}
                className={cn(
                  "relative rounded-[7px] border border-dashed transition-colors duration-300",
                  rowH,
                  glowing
                    ? "animate-pulse-slot border-solid border-brand-2 bg-brand-2/12"
                    : checking
                      ? "border-brand-2/40 bg-brand-2/6"
                      : "border-ink/12 bg-white/40",
                  hide,
                )}
              >
                {glowing && (
                  <span className="absolute inset-0 grid place-items-center font-medium text-[#3442C9]">
                    Free
                  </span>
                )}
                {checking && (
                  <span className="absolute inset-0 animate-scan rounded-[7px] bg-brand-2/10" />
                )}
              </div>
            );
          })}
        </Row>
      ))}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  // `display: contents` keeps the grid flat while giving assistive tech a row.
  return (
    <div role="row" className="contents">
      {children}
    </div>
  );
}

function ClosedDay({ highlight, rows }: { highlight: boolean; rows: number }) {
  return (
    <div
      role="gridcell"
      aria-label="Friday, clinic closed"
      style={{ gridRow: `span ${rows}` }}
      className={cn(
        "relative grid place-items-center rounded-[7px] border transition-colors duration-300",
        "bg-[repeating-linear-gradient(135deg,rgb(14_23_38/0.05)_0_6px,transparent_6px_12px)]",
        highlight ? "border-warning bg-warning/10" : "border-ink/8",
      )}
    >
      <span
        className={cn(
          "font-mono text-[10px] tracking-[0.1em] uppercase [writing-mode:vertical-rl]",
          highlight ? "font-semibold text-warning-ink" : "text-ink-faint",
        )}
      >
        Closed
      </span>
    </div>
  );
}

/** The app chrome around the calendar, so it reads as Clarus rather than a table. */
export function AppWindow({
  title,
  meta,
  children,
  className,
}: {
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card bg-white/80 shadow-[0_30px_60px_-30px_rgb(14_23_38/0.35)] ring-1 ring-white/80",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="text-sm font-semibold tracking-[-0.01em]">{title}</span>
        <div className="ms-auto flex items-center gap-2 text-xs text-ink-muted">{meta}</div>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

export function BookedBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-success-ink">
      <Check className="size-3.5" strokeWidth={2.5} /> Booked
    </span>
  );
}

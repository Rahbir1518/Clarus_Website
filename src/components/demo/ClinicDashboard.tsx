"use client";

import { m } from "motion/react";
import type { Phase } from "@/content/demo-call";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { AuditLog } from "./AuditLog";
import { useDemo } from "./DemoTimeline";

type Tone = "neutral" | "live" | "offer" | "success" | "review";

const toneStyle: Record<Tone, string> = {
  neutral: "bg-ink/6 text-ink-muted",
  live: "bg-brand-2/14 text-[#3442C9]",
  offer: "bg-brand-2/14 text-[#3442C9]",
  success: "bg-success/15 text-success-ink",
  review: "bg-danger/10 text-danger-ink",
};

function liveStatus(phase: Phase): { label: string; tone: Tone } {
  switch (phase) {
    case "idle":
      return { label: "Queued", tone: "neutral" };
    case "dialing":
      return { label: "Dialing", tone: "live" };
    case "verifying":
      return { label: "Calling", tone: "live" };
    case "checking":
      return { label: "Checking calendar", tone: "live" };
    case "offering":
      return { label: "Slot offered", tone: "offer" };
    case "booked":
      return { label: "Booked Thu 10:30", tone: "success" };
    case "logged":
      return { label: "Booked · transcript saved", tone: "success" };
  }
}

const others: { name: string; reason: string; channel: string; status: string; tone: Tone }[] = [
  {
    name: "Shirin Akter",
    reason: "Recall",
    channel: "WhatsApp",
    status: "Booked Wed 09:30",
    tone: "success",
  },
  {
    name: "Nadia Islam",
    reason: "Lab result",
    channel: "None",
    status: "Doctor review",
    tone: "review",
  },
  {
    name: "Kamal Hossain",
    reason: "Missed visit",
    channel: "SMS",
    status: "Reminder sent",
    tone: "neutral",
  },
];

/** What the front desk sees: the follow-up queue updating live, plus the audit trail. */
export function ClinicDashboard({ className }: { className?: string }) {
  const { state } = useDemo();
  const status = liveStatus(state.phase);
  const live = state.phase !== "idle" && state.phase !== "logged" && state.phase !== "booked";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-card bg-white/80 shadow-[0_30px_60px_-30px_rgb(14_23_38/0.35)] ring-1 ring-white/80",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="text-sm font-semibold">Follow-ups · Today</span>
        <span className="ms-auto inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <span className="size-1.5 rounded-full bg-success" /> Live
        </span>
      </div>

      <table className="w-full text-start text-xs">
        <thead className="sr-only">
          <tr>
            <th>Patient</th>
            <th>Reason</th>
            <th>Channel</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line bg-brand-2/4">
            <td className="py-2.5 ps-4 font-medium">Rafiq Ahmed</td>
            <td className="hidden py-2.5 text-ink-muted sm:table-cell">Results ready</td>
            <td className="hidden py-2.5 text-ink-muted md:table-cell">AI call</td>
            <td className="py-2.5 pe-4 text-end">
              <m.span
                key={status.label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: glide }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium whitespace-nowrap",
                  toneStyle[status.tone],
                )}
              >
                {live && <span className="size-1.5 animate-scan rounded-full bg-current" />}
                {status.label}
              </m.span>
            </td>
          </tr>
          {others.map((o) => (
            <tr key={o.name} className="border-b border-line last:border-0">
              <td className="py-2.5 ps-4 font-medium">{o.name}</td>
              <td className="hidden py-2.5 text-ink-muted sm:table-cell">{o.reason}</td>
              <td className="hidden py-2.5 text-ink-muted md:table-cell">{o.channel}</td>
              <td className="py-2.5 pe-4 text-end">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 font-medium whitespace-nowrap",
                    toneStyle[o.tone],
                  )}
                >
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-line bg-canvas/50 p-3">
        <div className="mb-2 px-1 font-mono text-[10px] tracking-[0.08em] text-ink-muted uppercase">
          Audit trail
        </div>
        <AuditLog events={state.audit} max={4} className="min-h-[8.5rem]" />
      </div>
    </div>
  );
}

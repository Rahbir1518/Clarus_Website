"use client";

import {
  CalendarCheck,
  FileText,
  FlaskConical,
  GitBranch,
  PhoneCall,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { m, useInView } from "motion/react";
import { useRef } from "react";
import { glide } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type NodeKind = "trigger" | "condition" | "action" | "guard";

type FlowNode = {
  id: string;
  x: number;
  y: number;
  title: string;
  sub: string;
  icon: LucideIcon;
  kind: NodeKind;
};

/*
 * The workflow as the engine actually runs it: an abnormal result is routed
 * to a doctor and never becomes a call. Only the routine branch calls.
 * Coordinates are percentages of a 4:5 box.
 */
const nodes: FlowNode[] = [
  {
    id: "trigger",
    x: 50,
    y: 9,
    title: "Lab result received",
    sub: "HbA1c · from PDF",
    icon: FlaskConical,
    kind: "trigger",
  },
  {
    id: "condition",
    x: 50,
    y: 30,
    title: "HbA1c above 7%?",
    sub: "condition",
    icon: GitBranch,
    kind: "condition",
  },
  {
    id: "review",
    x: 25,
    y: 53,
    title: "Doctor review",
    sub: "abnormal · no call",
    icon: ShieldAlert,
    kind: "guard",
  },
  {
    id: "call",
    x: 74,
    y: 53,
    title: "Call patient",
    sub: "reason: results_ready",
    icon: PhoneCall,
    kind: "action",
  },
  {
    id: "book",
    x: 74,
    y: 74,
    title: "Book visit",
    sub: "free slots only",
    icon: CalendarCheck,
    kind: "action",
  },
  {
    id: "summary",
    x: 74,
    y: 93,
    title: "Summary to doctor",
    sub: "transcript + outcome",
    icon: FileText,
    kind: "action",
  },
];

const edges = [
  { d: "M50 14.5 L50 24.5" },
  { d: "M50 35.5 C50 42 25 40 25 47.5", label: { x: 33.5, y: 41.5, text: "Yes" }, guard: true },
  { d: "M50 35.5 C50 42 74 40 74 47.5", label: { x: 65, y: 41.5, text: "No" } },
  { d: "M74 58.5 L74 68.5" },
  { d: "M74 79.5 L74 87.5" },
];

const kindStyle: Record<NodeKind, string> = {
  trigger: "text-brand-2",
  condition: "text-[#8A4FD6]",
  action: "text-ink",
  guard: "text-danger-ink",
};

export function WorkflowCanvas({ className, active }: { className?: string; active?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = usePrefersReducedMotion();
  const show = inView || reduced;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Workflow: when a lab result arrives, if HbA1c is above 7% it goes to doctor review and no call is made; otherwise Clarus calls the patient with the approved reason, books a free slot and sends the doctor a summary."
      className={cn("relative aspect-[4/5] w-full", className)}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {edges.map((e, i) => (
          <m.path
            key={i}
            d={e.d}
            fill="none"
            stroke={e.guard ? "#E5484D" : "#0E1726"}
            strokeOpacity={e.guard ? 0.7 : 0.35}
            strokeWidth={1.5}
            strokeDasharray={e.guard ? "4 3" : undefined}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: reduced ? 1 : 0 }}
            animate={{ pathLength: show ? 1 : 0 }}
            transition={{ duration: 0.5, delay: reduced ? 0 : 0.25 + i * 0.28, ease: glide }}
          />
        ))}
      </svg>

      {edges.map(
        (e, i) =>
          e.label && (
            <m.span
              key={`l${i}`}
              aria-hidden
              initial={{ opacity: reduced ? 1 : 0 }}
              animate={{ opacity: show ? 1 : 0 }}
              transition={{ delay: reduced ? 0 : 0.5 + i * 0.28 }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 px-1.5 py-0.5 font-mono text-[10px]",
                e.guard ? "text-danger-ink" : "text-ink-muted",
              )}
              style={{ left: `${e.label.x}%`, top: `${e.label.y}%` }}
            >
              {e.label.text}
            </m.span>
          ),
      )}

      {nodes.map((n, i) => (
        <m.div
          key={n.id}
          initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.9 }}
          animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
          transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.25, ease: glide }}
          className="absolute w-[46%] -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <WorkflowNode node={n} active={active === n.id} />
        </m.div>
      ))}
    </div>
  );
}

export function WorkflowNode({
  node,
  active,
}: {
  node: Pick<FlowNode, "title" | "sub" | "icon" | "kind">;
  active?: boolean;
}) {
  const Icon = node.icon;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-chip glass-2 px-2.5 py-2 shadow-none sm:px-3",
        node.kind === "guard" && "ring-1 ring-danger/40",
        active && "ring-2 ring-brand-2",
      )}
    >
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-lg bg-white/70",
          kindStyle[node.kind],
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11px] font-semibold sm:text-xs">{node.title}</span>
        <span className="block truncate font-mono text-[9.5px] text-ink-muted sm:text-[10px]">
          {node.sub}
        </span>
      </span>
    </div>
  );
}

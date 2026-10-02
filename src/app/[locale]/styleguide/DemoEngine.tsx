"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { AuditLog } from "@/components/demo/AuditLog";
import { CallPanel } from "@/components/demo/CallPanel";
import { ClinicDashboard } from "@/components/demo/ClinicDashboard";
import { AppWindow, ClinicCalendar } from "@/components/demo/ClinicCalendar";
import { atLeast, DemoTimeline, useDemo } from "@/components/demo/DemoTimeline";
import { LabReportCard } from "@/components/demo/LabReportCard";
import { PhoneScreen } from "@/components/demo/PhoneScreen";
import { SafetyGates } from "@/components/demo/SafetyGates";
import { SequenceDiagram } from "@/components/demo/SequenceDiagram";
import { Toast } from "@/components/demo/Toast";
import { WorkflowCanvas } from "@/components/demo/WorkflowCanvas";
import { GradientScene } from "@/components/glass/GradientScene";
import { phaseAt, phaseOrder } from "@/content/demo-call";
import { cn } from "@/lib/utils";

/** Every demo component in isolation, all driven by one scrubbable timeline. */
export function DemoEngine() {
  return (
    <div className="space-y-6">
      <DemoTimeline lang="bn" initialT={phaseAt.offering + 500}>
        <Scrubber />
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Specimen label="CallPanel · Waveform · TranscriptLine">
            <CallPanel className="w-full max-w-sm" />
          </Specimen>
          <Specimen label="ClinicCalendar · SlotCell · Toast">
            <div className="relative w-full">
              <AppWindow title="Appointments">
                <ClinicCalendar />
              </AppWindow>
              <BookedToast />
            </div>
          </Specimen>
          <Specimen label="PhoneScreen">
            <PhoneScreen />
          </Specimen>
          <Specimen label="ClinicDashboard · AuditLog">
            <ClinicDashboard className="w-full" />
          </Specimen>
        </div>
        <Specimen label="AuditLog (dark)" scene="night" className="mt-4">
          <DarkAudit />
        </Specimen>
      </DemoTimeline>

      <div className="grid gap-4 lg:grid-cols-2">
        <Specimen label="WorkflowCanvas · WorkflowNode">
          <WorkflowCanvas className="max-w-[420px]" />
        </Specimen>
        <Specimen label="SafetyGates (interactive)">
          <SafetyGates interactive className="w-full" />
        </Specimen>
        <Specimen label="LabReportCard">
          <LabReportCard />
        </Specimen>
        <Specimen label="SequenceDiagram">
          <div className="w-full rounded-card bg-white/55 p-4">
            <SequenceDiagram />
          </div>
        </Specimen>
      </div>
    </div>
  );
}

function Specimen({
  label,
  scene = "violet",
  className,
  children,
}: {
  label: string;
  scene?: "violet" | "night" | "teal";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GradientScene
      scene={scene}
      className={cn(
        "grid grid-cols-[minmax(0,1fr)] place-items-center rounded-panel p-5 pt-12 sm:p-8 sm:pt-12",
        className,
      )}
    >
      <span
        className={cn(
          "absolute start-5 top-4 font-mono text-[11px]",
          scene === "night" ? "text-white/72" : "text-ink-muted",
        )}
      >
        {label}
      </span>
      {children}
    </GradientScene>
  );
}

function Scrubber() {
  const { state, playing, toggle, restart, seek, duration } = useDemo();
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-card glass-1 p-3">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="grid size-9 place-items-center rounded-full bg-ink text-white"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
      <button
        onClick={restart}
        aria-label="Restart"
        className="grid size-9 place-items-center rounded-full bg-white/70"
      >
        <RotateCcw className="size-4" />
      </button>
      <input
        type="range"
        min={-1}
        max={duration}
        step={100}
        value={state.t}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Timeline"
        className="range min-w-48 flex-1"
        style={{ ["--fill" as string]: `${(Math.max(0, state.t) / duration) * 100}%` }}
      />
      <ol className="flex flex-wrap gap-1 font-mono text-[11px]">
        {phaseOrder.slice(1).map((p) => (
          <li key={p}>
            <button
              onClick={() => seek(phaseAt[p as Exclude<typeof p, "idle">])}
              className={cn(
                "rounded-full px-2 py-1",
                state.phase === p ? "bg-ink text-white" : "bg-white/60 text-ink-muted",
              )}
            >
              {p}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function BookedToast() {
  const { state } = useDemo();
  return (
    <div className="pointer-events-none absolute end-3 bottom-3">
      <Toast show={atLeast(state.phase, "booked")}>Thu 10:30 booked · added to calendar</Toast>
    </div>
  );
}

function DarkAudit() {
  const { state } = useDemo();
  return <AuditLog events={state.audit} tone="dark" className="w-full max-w-xl" />;
}

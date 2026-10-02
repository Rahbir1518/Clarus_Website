import { ArrowDown, Check, X } from "lucide-react";
import { gates } from "@/content/gates";
import { cn } from "@/lib/utils";

/** One card per gate: what it checks, and the two ways it can go. */
export function GateCards() {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {gates.map((g, i) => (
        <li key={g.id} className="flex flex-col rounded-panel glass-2 p-6 shadow-none">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-sm text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              {g.group === "content" ? "What may be said" : "Whether to dial"}
            </span>
          </div>
          <h3 className="mt-4 text-h3">{g.label}</h3>
          <p className="mt-2 text-ink-muted">{g.short}</p>
          <div className="mt-5 grid flex-1 gap-2 sm:grid-cols-2">
            <Outcome pass>Check passes, the run continues to the next check.</Outcome>
            <Outcome>{g.failure}</Outcome>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Outcome({ pass, children }: { pass?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-chip p-3 text-xs leading-snug ring-1",
        pass
          ? "bg-success/10 text-success-ink ring-success/30"
          : "bg-danger/8 text-danger-ink ring-danger/30",
      )}
    >
      <div className="mb-1 flex items-center gap-1.5 font-semibold">
        {pass ? (
          <Check className="size-3.5" strokeWidth={3} />
        ) : (
          <X className="size-3.5" strokeWidth={3} />
        )}
        {pass ? "Passes" : "Fails closed"}
        {pass && <ArrowDown className="ms-auto size-3.5 opacity-60" />}
      </div>
      <p className="text-ink-muted">{children}</p>
    </div>
  );
}

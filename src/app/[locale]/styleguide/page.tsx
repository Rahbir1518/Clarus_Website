import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Check, CircleAlert, Clock3, Loader, Phone, ShieldX } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { GlassChip, GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { Button } from "@/components/ui/button";
import { glassContrast, over, parseColor, toHex } from "@/lib/contrast";
import { glassTiers, type GlassTier } from "@/lib/glass";
import { sceneList, type Scene, type SceneName } from "@/lib/scenes";
import { cn } from "@/lib/utils";
import { DemoEngine } from "./DemoEngine";
import { MotionDemo } from "./MotionDemo";

export const metadata: Metadata = {
  title: "Styleguide · Clarus",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "canvas", hex: "#E6EAF2", role: "Page background", dark: false },
  { name: "ink", hex: "#0E1726", role: "Text, primary button", dark: true },
  { name: "ink-muted", hex: "#3E4A5C", role: "Secondary text", dark: true },
  { name: "brand", hex: "#C43B3B", role: "Logo, small accents", dark: true },
  { name: "brand-2", hex: "#5B6CFF", role: "Focus, slot being checked", dark: true },
  { name: "success", hex: "#18A957", role: "Booked. Nothing else.", dark: true },
  { name: "warning", hex: "#E8A23A", role: "Outside hours / closed", dark: false },
  { name: "danger", hex: "#E5484D", role: "Gate failed closed", dark: true },
];

/** Which tiers each scene is allowed to carry. Light glass on Night fails AA. */
const allowed: Record<SceneName, GlassTier[]> = {
  teal: ["glass-1", "glass-2", "glass-dark"],
  violet: ["glass-1", "glass-2", "glass-dark"],
  rose: ["glass-1", "glass-2", "glass-dark"],
  night: ["glass-dark"],
};

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-32 sm:px-6 lg:px-10">
      <header className="flex items-center justify-between py-6">
        <Logo />
        <span className="text-eyebrow text-ink-muted">Styleguide</span>
      </header>

      <section className="pt-10 pb-16 sm:pt-16">
        <p className="text-eyebrow text-brand-ink">Design system</p>
        <h1 className="mt-4 max-w-[14ch] text-display">Clinical glass.</h1>
        <p className="mt-6 max-w-[58ch] text-lg text-ink-muted">
          A calm canvas, colour only inside scenes, and frosted panels that always have something to
          blur. Every ratio on this page is computed from the same tokens the site renders with,
          including the browser&apos;s <code className="font-mono text-[0.9em]">saturate()</code>{" "}
          step, against the worst colour in each scene.
        </p>
      </section>

      {/* ------------------------------------------------------------ colour */}
      <Section index="01" title="Colour">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {colours.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-card bg-white/60 ring-1 ring-line">
              <div
                className={cn(
                  "flex h-24 items-end p-3 font-mono text-xs",
                  c.dark ? "text-white" : "text-ink",
                )}
                style={{ background: c.hex }}
              >
                {c.hex}
              </div>
              <div className="p-3">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-ink-muted">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- type */}
      <Section index="02" title="Type">
        <div className="space-y-8 rounded-panel bg-white/50 p-6 ring-1 ring-line sm:p-10">
          <TypeRow label="Display · Geist 560 · −0.03em · clamp 44→88">
            <p className="text-display">Every free slot filled.</p>
          </TypeRow>
          <TypeRow label="H2 · Geist 550 · clamp 32→56">
            <p className="text-h2">From clinical event to booked visit.</p>
          </TypeRow>
          <TypeRow label="H3 · Geist 550">
            <p className="text-h3">Only offers times that are free.</p>
          </TypeRow>
          <TypeRow label="Body · Geist 400 · 17px">
            <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed text-ink-muted">
              Clarus turns lab results and missed appointments into automatic follow-ups by
              WhatsApp, SMS or AI voice call, and books the next visit straight into your calendar.
            </p>
          </TypeRow>
          <TypeRow label="Mono · Geist Mono · transcripts, timestamps">
            <p className="font-mono text-sm">
              14:02:11 · call.completed · booked Thu 10:30 · transcript ↗
            </p>
          </TypeRow>
          <TypeRow label="Bangla · Hind Siliguri">
            <p lang="bn" className="text-2xl font-medium">
              আপনার জন্য বৃহস্পতিবার সকাল ১০:৩০ খালি আছে।
            </p>
            <p className="mt-1 text-sm text-ink-muted">Thursday 10:30 is free for you.</p>
          </TypeRow>
          <TypeRow label="Arabic · IBM Plex Sans Arabic · RTL">
            <p lang="ar" dir="rtl" className="text-2xl font-medium">
              لدينا موعد متاح يوم الخميس الساعة ١٠:٣٠ صباحًا.
            </p>
            <p className="mt-1 text-sm text-ink-muted">We have Thursday at 10:30 free.</p>
          </TypeRow>
        </div>
      </Section>

      {/* ------------------------------------------------- glass over scenes */}
      <Section
        index="03"
        title="Glass over every scene"
        note="Ratios are the minimum across each scene's colours, the two orbs behind the panels, and every 50/50 blend of those, after the tier's saturate() and tint. AA for body text is 4.5:1. Rule found here: crisp saturated shapes behind light glass stay at 50% strength or less (at 80%, secondary text drops to 3.9:1)."
      >
        <div className="space-y-6">
          {sceneList.map((scene) => (
            <div key={scene.name} className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
              <GradientScene scene={scene.name} className="min-h-[340px] rounded-panel p-5 sm:p-7">
                <SceneSpecimen scene={scene.name} />
              </GradientScene>
              <ContrastTable scene={scene.name} />
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ status */}
      <Section
        index="04"
        title="Status chips"
        note="Colour carries meaning, and an icon and a word always carry it too."
      >
        <GradientScene scene="teal" className="flex flex-wrap gap-3 rounded-panel p-6">
          <GlassChip>
            <Loader className="size-4 animate-spin text-brand-2" /> Checking free slots…
          </GlassChip>
          <GlassChip className="text-success-ink">
            <Check className="size-4" strokeWidth={2.5} /> Booked by Clarus
          </GlassChip>
          <GlassChip className="text-warning-ink">
            <Clock3 className="size-4" /> Closed on Fridays
          </GlassChip>
          <GlassChip className="text-danger-ink">
            <ShieldX className="size-4" /> Failed closed. No call made.
          </GlassChip>
          <GlassChip size="sm" className="font-mono">
            reason: follow_up
          </GlassChip>
        </GradientScene>
      </Section>

      {/* ----------------------------------------------------------- buttons */}
      <Section index="05" title="Buttons">
        <GradientScene
          scene="violet"
          className="flex flex-wrap items-center gap-3 rounded-panel p-6"
        >
          <Button size="lg">Join the founding pilot</Button>
          <Button size="lg" variant="secondary">
            <Phone /> Hear a call
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
        </GradientScene>
      </Section>

      {/* ------------------------------------------------------------ radius */}
      <Section index="06" title="Radius">
        <div className="flex flex-wrap items-end gap-4">
          {[
            ["chip", "12px", "rounded-chip"],
            ["card", "20px", "rounded-card"],
            ["panel", "28px", "rounded-panel"],
          ].map(([name, px, cls]) => (
            <div key={name} className="text-center">
              <div className={cn("size-28 bg-white/60 ring-1 ring-line", cls)} />
              <div className="mt-2 font-mono text-xs text-ink-muted">
                {name} · {px}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ motion */}
      <Section
        index="07"
        title="Motion"
        note="Panels float in, chips pop, transcript lines type, slots pulse then lock. Only transform and opacity animate. With reduced motion, everything shows its final state."
      >
        <MotionDemo />
      </Section>

      {/* ------------------------------------------------------ demo engine */}
      <Section
        index="08"
        title="Demo engine"
        note="Every demo scene in isolation. The top group shares one DemoTimeline: scrub it and every view follows, because time is the only state."
      >
        <DemoEngine />
      </Section>

      {/* ---------------------------------------------------------- fallback */}
      <Section
        index="09"
        title="No backdrop-filter fallback"
        note="What a browser without backdrop-filter sees: the same panels at 85% (light) and 94% (dark) opacity."
      >
        <GradientScene scene="rose" className="grid gap-4 rounded-panel p-6 sm:grid-cols-2">
          <div className="rounded-card border border-white/50 bg-white/85 p-5">
            <div className="text-h3">glass-2, solid</div>
            <p className="mt-1 text-sm text-ink-muted">Readable without blur.</p>
          </div>
          <div className="rounded-card bg-ink/94 p-5 text-white">
            <div className="text-h3">glass-dark, solid</div>
            <p className="mt-1 text-sm text-white/72">Readable without blur.</p>
          </div>
        </GradientScene>
      </Section>
    </div>
  );
}

function Section({
  index,
  title,
  note,
  children,
}: {
  index: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-14">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="font-mono text-sm text-brand-ink">{index}</span>
        <div>
          <h2 className="text-h3">{title}</h2>
          {note && <p className="mt-1 max-w-[70ch] text-sm text-ink-muted">{note}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function TypeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[220px_1fr] md:gap-8">
      <div className="pt-2 font-mono text-xs text-ink-faint">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** A small product moment per scene, using every tier the scene allows. */
function SceneSpecimen({ scene }: { scene: SceneName }) {
  const light = allowed[scene].includes("glass-2");
  return (
    <div className="flex h-full flex-col gap-4">
      {/* Something crisp behind the glass, so the blur is visible: a calendar grid and two orbs. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${light ? "rgb(255 255 255 / .55)" : "rgb(255 255 255 / .07)"} 1px, transparent 1px), linear-gradient(to bottom, ${light ? "rgb(255 255 255 / .55)" : "rgb(255 255 255 / .07)"} 1px, transparent 1px)`,
            backgroundSize: "56px 44px",
          }}
        />
        <div className="absolute top-[38%] left-[34%] size-36 rounded-full bg-brand-2/50 sm:size-44" />
        <div className="absolute right-[6%] bottom-[8%] size-20 rounded-full bg-brand/40" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className={cn("text-eyebrow", light ? "text-ink" : "text-white/80")}>{scene}</span>
        {light && (
          <GlassChip size="sm">
            <Loader className="size-3.5 text-brand-2" /> Checking free slots…
          </GlassChip>
        )}
      </div>

      <div className="grid flex-1 gap-4 sm:grid-cols-2">
        {light ? (
          <GlassPanel radius="card" className="p-5">
            <div className="text-eyebrow text-ink-muted">glass-2</div>
            <div className="mt-3 text-h3">Thu 10:30</div>
            <p className="mt-1 text-sm text-ink-muted">Free · 20 min · Dr. Nusrat Jahan</p>
            <div className="mt-4 flex gap-2">
              <span className="h-8 flex-1 rounded-lg bg-white/60 ring-1 ring-white/70" />
              <span className="h-8 flex-1 animate-pulse-slot rounded-lg bg-brand-2/15 ring-1 ring-brand-2/50" />
              <span className="h-8 flex-1 rounded-lg bg-success/20 ring-1 ring-success/60" />
            </div>
          </GlassPanel>
        ) : (
          <div className="flex items-center rounded-card border border-dashed border-white/25 p-5 text-sm text-white/72">
            Light glass is not used on Night: it fails AA (see table).
          </div>
        )}

        <GlassPanel tier="dark" radius="card" rim className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full bg-white/12 text-sm font-medium">
              R.A.
            </span>
            <div>
              <div className="text-sm font-medium">Calling…</div>
              <div className="font-mono text-xs text-white/72">00:14</div>
            </div>
            <span className="ms-auto text-eyebrow text-white/72">glass-dark</span>
          </div>
          <p lang="bn" className="mt-4 text-[0.95rem]">
            বৃহস্পতিবার সকাল ১০:৩০ কি আপনার সুবিধা হবে?
          </p>
          <p className="mt-1 text-xs text-white/72">Would Thursday 10:30 suit you?</p>
        </GlassPanel>
      </div>
    </div>
  );
}

function ContrastTable({ scene }: { scene: SceneName }) {
  const s = sceneList.find((x) => x.name === scene)!;
  return (
    <div className="rounded-panel bg-white/55 p-5 ring-1 ring-line">
      <table className="w-full text-sm">
        <caption className="mb-3 text-start font-medium">
          {s.label} scene · worst-case contrast
        </caption>
        <thead>
          <tr className="text-start font-mono text-[11px] text-ink-faint uppercase">
            <th className="pb-2 text-start font-normal">Tier</th>
            <th className="pb-2 text-start font-normal">Text</th>
            <th className="pb-2 text-end font-normal">Min</th>
            <th className="pb-2 text-end font-normal">AA</th>
          </tr>
        </thead>
        <tbody>
          {glassTiers.flatMap((tier) =>
            glassContrast(tier, s, orbBackdrops(s)).map((r, i) => {
              const used = allowed[scene].includes(tier.tier);
              return (
                <tr
                  key={tier.tier + r.text}
                  className={cn("border-t border-line", !used && "opacity-55")}
                >
                  <td className="py-2 font-mono text-xs">{i === 0 ? tier.tier : ""}</td>
                  <td className="py-2">{r.text}</td>
                  <td className="py-2 text-end font-mono tabular-nums">
                    <span
                      className="me-2 inline-block size-3 rounded-sm align-middle ring-1 ring-line"
                      style={{ background: toHex(r.worstSurface) }}
                      title={`Worst surface ${toHex(r.worstSurface)}`}
                    />
                    {r.min.toFixed(2)}
                  </td>
                  <td className="py-2 text-end">
                    {r.passesAA ? (
                      <span className="inline-flex items-center gap-1 text-success-ink">
                        <Check className="size-3.5" strokeWidth={2.5} /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-danger-ink">
                        <CircleAlert className="size-3.5" /> {used ? "Fail" : "Not used"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
}

/** The two orbs behind each specimen, as opaque colours over the scene base. Keep in step with their classes above. */
function orbBackdrops(scene: Scene): string[] {
  const base = parseColor(scene.base).slice(0, 3) as [number, number, number];
  const solid = (hex: string, alpha: number) =>
    toHex(over(parseColor(hex).slice(0, 3) as [number, number, number], alpha, base));
  return [solid("#5B6CFF", 0.5), solid("#C43B3B", 0.4)];
}

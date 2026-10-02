import { GlassCard } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { home } from "@/content/copy";
import { evidence, problemStats } from "@/content/stats";
import { CountUp } from "./CountUp";
import { Section, SectionHeader } from "./SectionHeader";

export function Stats() {
  const c = home.problem;
  return (
    <Section aria-labelledby="problem-title">
      <SectionHeader
        eyebrow={c.eyebrow}
        title={<span id="problem-title">{c.title}</span>}
        sub={c.sub}
      />
      <GradientScene
        scene="rose"
        className="mt-12 grid gap-4 rounded-panel p-4 sm:p-6 md:grid-cols-3"
      >
        {problemStats.map((s) => (
          <GlassCard key={s.source} className="flex flex-col p-6 sm:p-7">
            <div className="text-[clamp(2.75rem,2rem+2.5vw,4rem)] leading-none font-[560] tracking-[-0.04em]">
              {s.display ?? (
                <>
                  {s.approx && <span className="text-ink-muted">~</span>}
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </>
              )}
            </div>
            <p className="mt-4 flex-1 text-[0.95rem] leading-snug">{s.label}</p>
            <p className="mt-5 font-mono text-[11px] text-ink-muted">
              Source:{" "}
              {s.href ? (
                <a
                  href={s.href}
                  className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.source}
                </a>
              ) : (
                s.source
              )}
            </p>
          </GlassCard>
        ))}
      </GradientScene>
      <p className="mt-5 max-w-3xl text-sm text-ink-muted">
        {evidence.reminderLift}{" "}
        <span className="font-mono text-[11px]">({evidence.reminderSource})</span>
      </p>
    </Section>
  );
}

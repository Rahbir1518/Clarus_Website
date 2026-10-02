import {
  ArrowRight,
  Building2,
  FileLock2,
  Globe2,
  ListChecks,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { GradientScene } from "@/components/glass/GradientScene";
import { Button } from "@/components/ui/button";
import { home } from "@/content/copy";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Section, SectionHeader } from "./SectionHeader";

const icons = [ShieldCheck, FileLock2, ScrollText, Globe2, Building2, ListChecks];

export function SafetyStrip() {
  const c = home.safety;
  return (
    <Section>
      <GradientScene scene="rose" className="rounded-panel px-5 py-12 sm:px-10 sm:py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/safety">
              {c.cta} <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {c.tiles.map((tile, i) => {
            const Icon = icons[i]!;
            return (
              <li
                key={tile.title}
                className={cn(
                  "flex gap-4 rounded-card glass-1 p-5",
                  tile.roadmap && "border-dashed",
                )}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-chip bg-white/70 text-ink">
                  <Icon className="size-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    {tile.title}
                    {tile.roadmap && (
                      <span className="rounded-full bg-ink/8 px-2 py-0.5 font-mono text-[10px] tracking-wide text-ink-muted uppercase">
                        Roadmap
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{tile.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </GradientScene>
    </Section>
  );
}

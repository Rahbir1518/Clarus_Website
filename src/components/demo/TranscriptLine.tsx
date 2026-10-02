import type { CallLanguage } from "@/content/demo-call";
import { cn } from "@/lib/utils";
import type { LineState } from "./DemoTimeline";

type Props = {
  line: LineState;
  lang: CallLanguage;
  tone?: "dark" | "light";
  /** Show the English caption under a Bangla or Arabic line. */
  gloss?: boolean;
  /**
   * typed: words appear as they're spoken (layout reserved, so nothing jumps).
   * karaoke: every word visible, spoken words in full ink.
   */
  mode?: "typed" | "karaoke";
  size?: "sm" | "md";
  className?: string;
};

/**
 * One transcript line, revealed word by word. Words rather than characters,
 * because slicing Bangla or Arabic by character breaks joined letters.
 * Screen readers get the whole line at once.
 */
export function TranscriptLine({
  line,
  lang,
  tone = "dark",
  gloss = true,
  mode = "typed",
  size = "md",
  className,
}: Props) {
  const words = line.text.split(" ");
  const shown = line.progress >= 1 ? words.length : Math.ceil(line.progress * words.length);
  const agent = line.speaker === "agent";
  const dark = tone === "dark";

  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "mb-1 font-mono text-[10px] tracking-[0.08em] uppercase",
          dark ? "text-white/72" : "text-ink-muted",
        )}
      >
        {agent ? "Clarus" : "Patient"}
      </div>
      <p
        lang={lang}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className={cn(
          size === "sm" ? "text-[0.85rem] leading-snug" : "text-[0.95rem] leading-relaxed",
          lang === "bn" && "leading-[1.6]",
          !agent && (dark ? "text-white" : "text-ink"),
        )}
      >
        <span className="sr-only">{line.text}</span>
        <span aria-hidden>
          {words.map((w, i) => (
            <span
              key={i}
              className={cn(
                "transition-opacity duration-200",
                i < shown ? "opacity-100" : mode === "typed" ? "opacity-0" : "opacity-35",
              )}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </p>
      {gloss && line.gloss && (
        <p
          className={cn(
            "mt-1 text-xs leading-snug transition-opacity duration-300",
            dark ? "text-white/72" : "text-ink-muted",
            line.progress > 0.3 ? "opacity-100" : "opacity-0",
          )}
        >
          {line.gloss}
        </p>
      )}
    </div>
  );
}

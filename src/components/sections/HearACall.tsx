"use client";

import { Info, Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { AppWindow, ClinicCalendar } from "@/components/demo/ClinicCalendar";
import { atLeast, DemoTimeline, useDemo } from "@/components/demo/DemoTimeline";
import { Toast } from "@/components/demo/Toast";
import { TranscriptLine } from "@/components/demo/TranscriptLine";
import { Waveform } from "@/components/demo/Waveform";
import { GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { home } from "@/content/copy";
import { callAudio, languageLabel, type CallLanguage, type Phase } from "@/content/demo-call";
import { track } from "@/lib/analytics";
import { glide } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { HEAR_CALL_EVENT, hearCallRequest } from "./HeroDemo";
import { Section, SectionHeader } from "./SectionHeader";

const phaseLabel: Record<Phase, string> = {
  idle: "Ready",
  dialing: "Dialing",
  verifying: "Confirming identity",
  checking: "Checking the calendar",
  offering: "Offering free times",
  booked: "Booked",
  logged: "Logged",
};

export function HearACall() {
  const c = home.hearACall;
  const locale = useLocale();
  const [lang, setLang] = useState<CallLanguage>(
    locale === "bn" ? "bn" : locale === "ar" ? "ar" : "en",
  );
  const audioRef = useRef<HTMLAudioElement>(null);
  const audio = callAudio[lang];

  return (
    <Section id="hear-a-call">
      <SectionHeader eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <DemoTimeline
        key={lang}
        lang={lang}
        initialT={-1}
        audioRef={audioRef}
        onPhase={(phase) => track("demo_step_viewed", { scene: "hear_a_call", phase, lang })}
      >
        {audio && <audio ref={audioRef} src={audio} preload="metadata" />}
        <GradientScene scene="teal" className="mt-12 rounded-panel p-3 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Player lang={lang} setLang={setLang} hasAudio={!!audio} />
            <CalendarSide />
          </div>
        </GradientScene>
      </DemoTimeline>
    </Section>
  );
}

function Player({
  lang,
  setLang,
  hasAudio,
}: {
  lang: CallLanguage;
  setLang: (l: CallLanguage) => void;
  hasAudio: boolean;
}) {
  const { state, playing, toggle, play, restart, seek, speed, setSpeed, duration } = useDemo();
  const t = useTranslations("demo");
  const ended = state.t >= duration;
  const listRef = useRef<HTMLOListElement>(null);

  // "Hear a call" in the hero scrolls here and presses play.
  useEffect(() => {
    const onHear = () => {
      hearCallRequest.pending = false;
      setTimeout(play, 600);
    };
    if (hearCallRequest.pending) onHear();
    window.addEventListener(HEAR_CALL_EVENT, onHear);
    return () => window.removeEventListener(HEAR_CALL_EVENT, onHear);
  }, [play]);

  // Keep the newest line in view inside the transcript box.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [state.lines.length]);

  const pct = Math.max(0, Math.min(100, (state.t / duration) * 100));
  const secs = (ms: number) => `0:${String(Math.max(0, Math.floor(ms / 1000))).padStart(2, "0")}`;

  return (
    <GlassPanel className="flex flex-col p-4 sm:p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={ended ? restart : toggle}
          aria-label={ended ? t("replay") : playing ? t("pause") : t("play")}
          className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-white shadow-[0_12px_30px_-10px_rgb(14_23_38/0.7)] transition-transform hover:scale-[1.04] active:scale-95"
        >
          {ended ? (
            <RotateCcw className="size-5" />
          ) : playing ? (
            <Pause className="size-5" />
          ) : (
            <Play className="size-5 translate-x-px" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium">{phaseLabel[state.phase]}</span>
            <span className="font-mono text-xs text-ink-muted tabular-nums">
              {secs(state.t)} / {secs(duration)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            step={100}
            value={Math.max(0, state.t)}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={t("progress")}
            className="range mt-2"
            style={{ ["--fill" as string]: `${pct}%` }}
          />
        </div>
        <Waveform
          active={playing && state.speaking !== null}
          bars={10}
          className="hidden text-ink/70 sm:flex"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          value={lang}
          onValueChange={(v) => v && setLang(v as CallLanguage)}
          aria-label={t("language")}
        >
          {(["en", "bn", "ar"] as const).map((l) => (
            <ToggleGroupItem key={l} value={l} lang={l} className="h-8 px-3 text-xs">
              {languageLabel[l]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <ToggleGroup
          type="single"
          value={String(speed)}
          onValueChange={(v) => v && setSpeed(Number(v))}
          aria-label={t("speed")}
        >
          {["1", "1.5"].map((s) => (
            <ToggleGroupItem key={s} value={s} className="h-8 px-3 font-mono text-xs">
              {s}×
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ol
        ref={listRef}
        data-lenis-prevent
        aria-live="polite"
        aria-label={t("transcript")}
        className="mt-5 h-[19rem] space-y-4 overflow-y-auto rounded-card bg-white/50 p-4 ring-1 ring-white/70"
      >
        {state.lines.length === 0 && (
          <li className="grid h-full place-items-center text-center text-sm text-ink-muted">
            Press play to hear Clarus call Rafiq Ahmed about a follow-up.
          </li>
        )}
        {state.lines.map((line) => {
          const current = line.progress < 1;
          return (
            <m.li
              key={line.index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: glide }}
              className={cn(
                "rounded-chip px-3 py-2 transition-colors",
                current && "bg-white/70 ring-1 ring-brand-2/30",
                line.speaker === "patient" && "ms-6",
              )}
            >
              <TranscriptLine
                line={line}
                lang={state.lang}
                tone="light"
                mode="karaoke"
                gloss={lang !== "en"}
              />
            </m.li>
          );
        })}
      </ol>

      {!hasAudio && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
          <Info className="size-3.5 shrink-0" /> {t("audioSoon")}
        </p>
      )}
    </GlassPanel>
  );
}

function CalendarSide() {
  const { state } = useDemo();
  return (
    <div className="relative flex flex-col">
      <AppWindow
        title="Appointments"
        className="flex-1"
        meta={
          <AnimatePresence mode="wait">
            <m.span
              key={state.phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium",
                atLeast(state.phase, "booked")
                  ? "bg-success/15 text-success-ink"
                  : "bg-ink/6 text-ink",
              )}
            >
              {phaseLabel[state.phase]}
            </m.span>
          </AnimatePresence>
        }
      >
        <ClinicCalendar />
      </AppWindow>
      <div className="pointer-events-none absolute end-4 bottom-4">
        <Toast show={atLeast(state.phase, "booked")}>Thu 10:30 booked · added to calendar</Toast>
      </div>
    </div>
  );
}

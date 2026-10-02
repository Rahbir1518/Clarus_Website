"use client";

/**
 * DemoTimeline: the single source of timing for every demo scene.
 *
 * A demo is a pure function of `t`, the milliseconds since the call started
 * (`deriveState`). The provider owns a clock that advances `t`; scenes read the
 * derived state through `useDemo()`. Because nothing else holds time, the
 * transcript, calendar, dashboard and audit log can never drift apart, and
 * reduced motion is simply "t = the end".
 *
 * idle → dialing → verifying → checking → offering → booked → logged
 */

import { useInView } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type RefObject,
} from "react";
import {
  auditEvents,
  callDuration,
  phaseAt,
  phaseOrder,
  script,
  type CallLanguage,
  type Phase,
  type ScriptLine,
  type Speaker,
} from "@/content/demo-call";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export type LineState = ScriptLine & { index: number; progress: number };

export type DemoState = {
  t: number;
  phase: Phase;
  /** Lines that have started, oldest first. */
  lines: LineState[];
  speaking: Speaker | null;
  audit: typeof auditEvents;
  /** Connected-call timer, "00:14". */
  timer: string;
  lang: CallLanguage;
};

const scripts = new Map<CallLanguage, ScriptLine[]>();
const scriptFor = (lang: CallLanguage) => {
  if (!scripts.has(lang)) scripts.set(lang, script(lang));
  return scripts.get(lang)!;
};

export function deriveState(t: number, lang: CallLanguage): DemoState {
  let phase: Phase = "idle";
  if (t >= 0)
    for (const p of phaseOrder.slice(1) as Exclude<Phase, "idle">[]) if (t >= phaseAt[p]) phase = p;

  const lines: LineState[] = [];
  scriptFor(lang).forEach((line, index) => {
    if (t >= line.at)
      lines.push({ ...line, index, progress: Math.min(1, (t - line.at) / line.dur) });
  });
  const live = lines.findLast((l) => l.progress < 1);

  const connected = Math.max(0, Math.min(t, phaseAt.logged) - phaseAt.verifying) / 1000;
  const timer = `${String(Math.floor(connected / 60)).padStart(2, "0")}:${String(Math.floor(connected % 60)).padStart(2, "0")}`;

  return {
    t,
    phase,
    lines,
    speaking: live?.speaker ?? null,
    audit: auditEvents.filter((e) => t >= e.at),
    timer,
    lang,
  };
}

export type DemoController = {
  state: DemoState;
  playing: boolean;
  /** True when the visitor prefers reduced motion and hasn't pressed play. */
  still: boolean;
  speed: number;
  duration: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  restart: () => void;
  seek: (t: number) => void;
  setSpeed: (s: number) => void;
};

/** Runs `fn` on the demo's audio element, if there is one and it has loaded. */
function withAudio(
  ref: RefObject<HTMLAudioElement | null> | undefined,
  fn: (el: HTMLAudioElement) => void,
) {
  const el = ref?.current;
  if (el && el.readyState > 0) fn(el);
}

const DemoContext = createContext<DemoController | null>(null);

/**
 * Just the phase. It changes six times a call, so heavy scenes that only care
 * about the phase (the 60-cell calendar) skip the ~16 ticks a second.
 */
const DemoPhaseContext = createContext<Phase | null>(null);

export function useDemoPhase(): Phase {
  const phase = useContext(DemoPhaseContext);
  if (phase === null) throw new Error("useDemoPhase() must be used inside <DemoTimeline>");
  return phase;
}

export function useDemo(): DemoController {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo() must be used inside <DemoTimeline>");
  return ctx;
}

type Options = {
  lang: CallLanguage;
  /** Start playing as soon as the scene is on screen. */
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  /** Where the clock starts. Also what server-rendered HTML shows. */
  initialT?: number;
  /** When set and loaded, the clock follows this audio element. */
  audioRef?: RefObject<HTMLAudioElement | null>;
  onPhase?: (phase: Phase) => void;
};

function useDemoClock(
  {
    lang,
    autoplay = false,
    loop = false,
    speed: initialSpeed = 1,
    initialT = 0,
    audioRef,
    onPhase,
  }: Options,
  visible: boolean,
): DemoController {
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState(initialT);
  const [playing, setPlaying] = useState(autoplay);
  const [userStarted, setUserStarted] = useState(false);
  const [speed, setSpeedState] = useState(initialSpeed);

  const tRef = useRef(t);
  const speedRef = useRef(speed);
  const loopRef = useRef(loop);
  useEffect(() => {
    speedRef.current = speed;
    loopRef.current = loop;
  }, [speed, loop]);

  const audio = () => {
    const el = audioRef?.current;
    return el && el.readyState > 0 ? el : null;
  };

  // Autoplay waits for the browser to go idle, so the demo never competes with
  // the page's first paint and hydration.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 1200);
    return () => clearTimeout(id);
  }, []);

  const still = reduced && !userStarted;
  const running = playing && visible && !still && (idle || userStarted);

  useEffect(() => {
    if (!running) {
      audio()?.pause();
      return;
    }
    const el = audio();
    if (el) {
      el.currentTime = tRef.current / 1000;
      el.playbackRate = speedRef.current;
      void el.play().catch(() => {});
    }
    let raf = 0;
    let last = performance.now();
    let pending = 0;
    const tick = (now: number) => {
      pending += (now - last) * speedRef.current;
      last = now;
      // ~16 updates a second is smooth enough for word-by-word transcripts
      // and keeps re-renders cheap.
      if (pending >= 60) {
        const a = audio();
        let next = a ? a.currentTime * 1000 : tRef.current + pending;
        pending = 0;
        if (next >= callDuration) {
          if (loopRef.current) next = 0;
          else {
            next = callDuration;
            setPlaying(false);
          }
        }
        tRef.current = next;
        setT(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // audio() reads a ref; re-subscribing on every render isn't needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const shownT = still ? callDuration : t;
  const state = useMemo(() => deriveState(shownT, lang), [shownT, lang]);

  const lastPhase = useRef<Phase | null>(null);
  useEffect(() => {
    if (state.phase !== lastPhase.current) {
      lastPhase.current = state.phase;
      if (running || userStarted) onPhase?.(state.phase);
    }
  }, [state.phase, running, userStarted, onPhase]);

  const seek = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(callDuration, next));
      tRef.current = clamped;
      setT(clamped);
      withAudio(audioRef, (el) => (el.currentTime = clamped / 1000));
    },
    [audioRef],
  );

  const play = useCallback(() => {
    setUserStarted(true);
    if (tRef.current >= callDuration) seek(0);
    setPlaying(true);
  }, [seek]);
  const pause = useCallback(() => setPlaying(false), []);

  return {
    state,
    playing: running || (playing && !visible && !still),
    still,
    speed,
    duration: callDuration,
    play,
    pause,
    toggle: () => (playing && !still ? pause() : play()),
    restart: () => {
      seek(0);
      setUserStarted(true);
      setPlaying(true);
    },
    seek,
    setSpeed: (s) => {
      setSpeedState(s);
      withAudio(audioRef, (el) => (el.playbackRate = s));
    },
  };
}

type ProviderProps = Options & Omit<ComponentProps<"div">, keyof Options>;

/**
 * Wrap a demo scene in this. The clock pauses whenever the wrapper is off
 * screen, so a looping hero costs nothing once you've scrolled past it.
 */
export function DemoTimeline({
  lang,
  autoplay,
  loop,
  speed,
  initialT,
  audioRef,
  onPhase,
  children,
  ...rest
}: ProviderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.25 });
  const controller = useDemoClock(
    { lang, autoplay, loop, speed, initialT, audioRef, onPhase },
    visible,
  );
  return (
    <DemoContext.Provider value={controller}>
      <DemoPhaseContext.Provider value={controller.state.phase}>
        <div ref={ref} {...rest}>
          {children}
        </div>
      </DemoPhaseContext.Provider>
    </DemoContext.Provider>
  );
}

/** Phase helpers for scenes. */
export const atLeast = (phase: Phase, target: Phase) =>
  phaseOrder.indexOf(phase) >= phaseOrder.indexOf(target);

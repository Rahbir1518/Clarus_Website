"use client";

import { Loader, Pause, Phone, Play } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { CallPanel } from "@/components/demo/CallPanel";
import { AppWindow, ClinicCalendar } from "@/components/demo/ClinicCalendar";
import { atLeast, DemoTimeline, useDemo } from "@/components/demo/DemoTimeline";
import { Toast } from "@/components/demo/Toast";
import { GlassChip } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { getLenis } from "@/components/providers/SmoothScroll";
import { Button } from "@/components/ui/button";
import { clinic, type CallLanguage } from "@/content/demo-call";
import { track } from "@/lib/analytics";
import { pop } from "@/lib/motion";

export const HEAR_CALL_EVENT = "clarus:hear-call";

/** Set when "Hear a call" is pressed, so a player that hydrates later still starts. */
export const hearCallRequest = { pending: false };

/** The hero scene: the clinic's week, with the AI call floating over it, looping. */
export function HeroDemo({
  lang,
  gloss,
  caption,
  checking,
  toast,
}: {
  lang: CallLanguage;
  gloss: boolean;
  caption: string;
  checking: string;
  toast: string;
}) {
  return (
    // Starts mid-call so the first paint already shows the product working.
    <DemoTimeline lang={lang} autoplay loop speed={1.35} initialT={9200}>
      <GradientScene scene="teal" className="rounded-panel p-3 pb-4 sm:p-5 sm:pb-44">
        <AppWindow
          title="Appointments"
          meta={
            <>
              <span className="hidden sm:inline">Week of 5 Oct</span>
              <span className="rounded-full bg-ink/6 px-2.5 py-1 font-medium text-ink">
                {clinic.doctor}
              </span>
              <PauseButton />
            </>
          }
        >
          <ClinicCalendar />
        </AppWindow>

        <Overlays gloss={gloss} checking={checking} toast={toast} />
      </GradientScene>
      <p className="mt-3 text-center font-mono text-[11px] text-ink-muted">{caption}</p>
    </DemoTimeline>
  );
}

function Overlays({ gloss, checking, toast }: { gloss: boolean; checking: string; toast: string }) {
  const { state } = useDemo();
  const showChip = state.phase === "checking" || state.phase === "offering";

  return (
    <>
      <CallPanel
        gloss={gloss}
        className="relative z-20 mx-2 -mt-20 sm:absolute sm:start-7 sm:bottom-7 sm:mx-0 sm:mt-0 sm:w-[min(320px,56%)]"
        transcriptClassName="h-[12.5rem]"
      />

      <AnimatePresence>
        {showChip && (
          <m.div
            key="chip"
            variants={pop}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="absolute end-5 top-[4.6rem] z-20 sm:end-8 sm:top-20"
          >
            <GlassChip size="sm" className="shadow-float">
              <Loader className="size-3.5 animate-spin text-brand-2 [animation-duration:2s]" />
              {checking}
            </GlassChip>
          </m.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute end-4 bottom-4 z-30 sm:end-7 sm:bottom-10">
        <Toast show={atLeast(state.phase, "booked")}>{toast}</Toast>
      </div>
    </>
  );
}

/** WCAG 2.2.2: anything that moves on its own for more than 5 seconds can be paused. */
function PauseButton() {
  const { playing, toggle } = useDemo();
  const t = useTranslations("demo");
  return (
    <button
      onClick={toggle}
      aria-label={playing ? t("pause") : t("play")}
      className="grid size-7 place-items-center rounded-full bg-ink/6 text-ink transition-colors hover:bg-ink/12"
    >
      {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
    </button>
  );
}

/** "Hear a call": scrolls to the player and starts it. */
export function HearCallButton({ label }: { label: string }) {
  return (
    <Button asChild variant="secondary" size="lg">
      <a
        href="#hear-a-call"
        onClick={(e) => {
          e.preventDefault();
          track("cta_click", { cta: "hear_a_call", location: "hero" });
          const target = document.getElementById("hear-a-call");
          if (!target) return;
          // Render the sections in between first: until they've rendered their
          // heights are estimates, and the scroll would land in the wrong place.
          document.querySelectorAll<HTMLElement>("[data-cv]").forEach((el) => {
            el.style.contentVisibility = "visible";
          });
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(target, { offset: -80 });
          else target.scrollIntoView({ behavior: "smooth" });
          hearCallRequest.pending = true;
          window.dispatchEvent(new Event(HEAR_CALL_EVENT));
        }}
      >
        <Phone /> {label}
      </a>
    </Button>
  );
}

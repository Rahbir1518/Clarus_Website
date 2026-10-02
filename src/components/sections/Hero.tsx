import { getLocale, getTranslations } from "next-intl/server";
import { GlassChip } from "@/components/glass/Glass";
import { PilotLink } from "@/components/pilot/PilotDialog";
import type { CallLanguage } from "@/content/demo-call";
import { HearCallButton, HeroDemo } from "./HeroDemo";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  // English visitors see a Bangla call with English captions: the language is the point.
  const lang: CallLanguage = locale === "ar" ? "ar" : "bn";

  return (
    <section className="relative px-4 pt-6 pb-20 sm:px-6 lg:pt-14">
      {/* A faint wash of colour behind the hero, so the page doesn't start flat. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[680px] opacity-70"
        style={{
          background:
            "radial-gradient(40% 50% at 15% 30%, rgb(159 227 214 / .45), transparent), radial-gradient(35% 45% at 85% 20%, rgb(169 184 255 / .45), transparent)",
        }}
      />
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.04fr)] lg:gap-12">
        <div>
          <GlassChip>
            <span className="size-1.5 rounded-full bg-brand" />
            {t("eyebrow")}
          </GlassChip>
          <h1 className="mt-6 text-[clamp(2.6rem,1.5rem+3.3vw,4.15rem)] leading-[0.98] font-[560] tracking-[-0.035em] text-balance">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-muted sm:text-[1.2rem]">
            {t("sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PilotLink location="hero" size="lg">
              {t("ctaPrimary")}
            </PilotLink>
            <HearCallButton label={t("ctaSecondary")} />
          </div>
          <ul className="mt-10 hidden flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ink-muted sm:flex">
            {t("facts")
              .split("|")
              .map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
          </ul>
        </div>

        <HeroDemo
          lang={lang}
          gloss={locale === "en"}
          caption={t("caption")}
          checking={t("checking")}
          toast={t("toast")}
        />
      </div>
    </section>
  );
}

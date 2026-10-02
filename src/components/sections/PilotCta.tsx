import { Check } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { GlassPanel } from "@/components/glass/Glass";
import { GradientScene } from "@/components/glass/GradientScene";
import { PilotFormLazy } from "@/components/pilot/PilotFormLazy";
import { team } from "@/content/site";
import { Section } from "./SectionHeader";

export async function PilotCta({ location = "home_band" }: { location?: string }) {
  const t = await getTranslations("pilot");
  return (
    <Section id="pilot">
      <GradientScene
        scene="teal"
        className="grid gap-10 rounded-panel p-4 sm:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 lg:p-12"
      >
        <div className="px-2 pt-4 sm:px-0">
          <p className="text-eyebrow text-brand-ink">{t("eyebrow")}</p>
          <h2 className="mt-4 text-h2">{t("title")}</h2>
          <p className="mt-5 text-lg text-ink-muted">{t("intro")}</p>
          <ul className="mt-8 space-y-3">
            {(["free", "setup", "founders"] as const).map((k) => (
              <li key={k} className="flex items-center gap-3 font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-success text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {t(`benefits.${k}`)}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {team.map((m) => (
                <Image
                  key={m.name}
                  src={m.photo}
                  alt={m.name}
                  width={44}
                  height={44}
                  className="size-11 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>
            <p className="text-sm text-ink-muted">You&apos;ll talk to the founders directly.</p>
          </div>
        </div>
        <GlassPanel className="p-5 sm:p-8">
          <PilotFormLazy location={location} />
        </GlassPanel>
      </GradientScene>
    </Section>
  );
}

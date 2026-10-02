"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, useState, type MouseEvent, type ReactNode } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { PilotFormLazy } from "./PilotFormLazy";

type Ctx = { open: (location: string) => void };
const PilotContext = createContext<Ctx | null>(null);

/** Puts the pilot form one click away on every page. */
export function PilotDialogProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string | null>(null);
  const t = useTranslations("pilot");

  return (
    <PilotContext.Provider value={{ open: setLocation }}>
      {children}
      <Dialog open={location !== null} onOpenChange={(o) => !o && setLocation(null)}>
        <DialogContent>
          <div className="p-6 sm:p-9">
            <p className="text-eyebrow text-brand-ink">{t("eyebrow")}</p>
            <DialogTitle className="mt-3 pe-10 text-h3">{t("title")}</DialogTitle>
            <DialogDescription className="mt-2 text-ink-muted">
              {t("intro")} {t("benefits.free")} · {t("benefits.setup")} · {t("benefits.founders")}.
            </DialogDescription>
            <PilotFormLazy
              location={`dialog:${location ?? ""}`}
              eager
              className="mt-6 min-h-0 sm:min-h-0"
            />
          </div>
        </DialogContent>
      </Dialog>
    </PilotContext.Provider>
  );
}

/**
 * "Join the pilot". A real link to /pilot, so it works without JavaScript;
 * with JavaScript it opens the dialog instead.
 */
export function PilotLink({
  location,
  children,
  ...button
}: Omit<ButtonProps, "asChild" | "onClick"> & { location: string; children?: ReactNode }) {
  const ctx = useContext(PilotContext);
  const t = useTranslations("nav");
  const onClick = (e: MouseEvent) => {
    track("cta_click", { cta: "join_pilot", location });
    if (!ctx || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    ctx.open(location);
  };
  return (
    <Button asChild {...button}>
      <Link href="/pilot" onClick={onClick}>
        {children ?? t("joinPilot")}
      </Link>
    </Button>
  );
}

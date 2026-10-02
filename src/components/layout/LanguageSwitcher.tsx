"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const localeNames: Record<Locale, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  bn: { native: "বাংলা", short: "বাং" },
  ar: { native: "العربية", short: "ع" },
};

/**
 * A disclosure menu of three links. Hand-built rather than a positioned
 * dropdown primitive: it's on every page, and a positioning engine for three
 * links isn't worth the bytes.
 */
export function LanguageSwitcher({
  className,
  side = "bottom",
}: {
  className?: string;
  side?: "top" | "bottom";
}) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t("language")}: ${localeNames[locale].native}`}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink aria-expanded:bg-ink/5",
          className,
        )}
      >
        <Globe className="size-4" />
        <span>{localeNames[locale].short}</span>
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className={cn(
          "absolute end-0 z-50 min-w-40 animate-[pop-in_180ms_var(--ease-glide)] rounded-card bg-white/95 p-1.5 shadow-lift ring-1 ring-ink/8",
          side === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
        )}
      >
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={l}
              aria-current={l === locale ? "true" : undefined}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-4 rounded-chip px-3 py-2 text-sm hover:bg-ink/5 focus-visible:bg-ink/5"
            >
              {localeNames[l].native}
              {l === locale && <Check className="size-4 text-success-ink" />}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { PilotLink } from "@/components/pilot/PilotDialog";
import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  SheetContent,
} from "@/components/ui/dialog";
import { nav } from "@/content/site";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-4 transition-[padding] duration-300 ease-(--ease-glide) sm:px-6",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-[1180px] items-center gap-2 rounded-full glass-1 ps-4 pe-2 transition-[height,box-shadow] duration-300 ease-(--ease-glide)",
          scrolled ? "h-13 shadow-float" : "h-15",
        )}
      >
        <Link href="/" aria-label={t("home")} className="flex items-center gap-2 rounded-full pe-2">
          <LogoMark className="size-7 text-brand" />
          <span className="text-[1.2rem] font-semibold tracking-[-0.03em]">Clarus</span>
        </Link>

        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active ? "bg-ink/6 text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ms-auto flex items-center gap-1 lg:ms-0">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <PilotLink location="nav" size="sm" className="hidden sm:inline-flex" />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label={t("menu")}
        className="grid size-10 place-items-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
      >
        <Menu className="size-5" />
      </DialogTrigger>
      <SheetContent aria-describedby={undefined}>
        <DialogTitle className="text-eyebrow text-ink-muted">{t("menu")}</DialogTitle>
        <ul className="mt-8 space-y-1">
          <li>
            <DialogClose asChild>
              <Link
                href="/"
                className="block rounded-chip px-2 py-2.5 text-2xl font-medium tracking-[-0.02em] hover:bg-white/50"
              >
                Clarus
              </Link>
            </DialogClose>
          </li>
          {nav.map((item) => (
            <li key={item.href}>
              <DialogClose asChild>
                <Link
                  href={item.href}
                  className="block rounded-chip px-2 py-2.5 text-2xl font-medium tracking-[-0.02em] hover:bg-white/50"
                >
                  {t(item.key)}
                </Link>
              </DialogClose>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-3">
          <LanguageSwitcher side="top" className="glass-1" />
          {/* Close the sheet first, so the pilot dialog never opens on top of it. */}
          <div onClickCapture={() => setOpen(false)}>
            <PilotLink location="mobile_menu" size="lg" className="w-full" />
          </div>
        </div>
      </SheetContent>
    </Dialog>
  );
}

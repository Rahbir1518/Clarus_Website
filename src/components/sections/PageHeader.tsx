import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The top of an inner page: eyebrow, H1 (the LCP element) and a short lede. */
export function PageHeader({
  eyebrow,
  title,
  sub,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("relative px-4 pt-10 pb-6 sm:px-6 sm:pt-16", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[520px] opacity-60"
        style={{
          background:
            "radial-gradient(35% 50% at 12% 30%, rgb(159 227 214 / .45), transparent), radial-gradient(35% 45% at 88% 15%, rgb(201 188 255 / .5), transparent)",
        }}
      />
      <div className="mx-auto max-w-[1180px]">
        <p className="text-eyebrow text-brand-ink">{eyebrow}</p>
        <h1 className="mt-4 max-w-[18ch] text-display">{title}</h1>
        {sub && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">{sub}</p>
        )}
        {children}
      </div>
    </header>
  );
}

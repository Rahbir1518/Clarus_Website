import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "start",
  as: H = "h2",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "start" | "center";
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-eyebrow text-brand-ink">{eyebrow}</p>}
      <H className={cn(H === "h1" ? "text-display" : "text-h2", eyebrow && "mt-4")}>{title}</H>
      {sub && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{sub}</p>}
      {children}
    </div>
  );
}

export function Section({
  id,
  className,
  children,
  ...rest
}: { id?: string; className?: string; children: ReactNode } & React.ComponentProps<"section">) {
  return (
    // Sections below the fold skip style, layout and paint until they near the
    // viewport (content-visibility). The page is long and glassy; without this
    // the first frame pays for all of it.
    <section
      id={id}
      data-cv
      className={cn(
        "scroll-mt-24 px-4 py-20 [contain-intrinsic-size:auto_900px] [content-visibility:auto] sm:px-6 sm:py-28",
        className,
      )}
      {...rest}
    >
      <div className="mx-auto max-w-[1180px]">{children}</div>
    </section>
  );
}

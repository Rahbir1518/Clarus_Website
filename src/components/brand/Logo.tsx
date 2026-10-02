import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The Clarus "C": a solid arc that breaks into particles, redrawn as a vector
 * from the app's raster mark (public/brand/logo-original.png).
 */
export function LogoMark({ className, ...rest }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className={cn("size-7", className)} {...rest}>
      <path d="M31.26 26.5A13 13 0 0 1 7.78 15.55" stroke="currentColor" strokeWidth="6" />
      <g fill="currentColor">
        <circle cx="9.76" cy="11.99" r="2.6" />
        <circle cx="11.89" cy="7.98" r="2.2" opacity=".9" />
        <circle cx="16.69" cy="8.47" r="1.9" opacity=".8" />
        <circle cx="20.49" cy="6.01" r="1.6" opacity=".7" />
        <circle cx="24.28" cy="8.25" r="1.35" opacity=".6" />
        <circle cx="28.62" cy="8.97" r="1.1" opacity=".5" />
        <circle cx="30.36" cy="13.01" r=".9" opacity=".42" />
      </g>
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="text-brand" />
      <span className="text-[1.3rem] font-semibold tracking-[-0.03em] text-ink">Clarus</span>
    </span>
  );
}

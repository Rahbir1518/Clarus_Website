import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* Glass primitives. The tiers themselves are CSS utilities in globals.css;
   these components only fix the shape each tier is used at. */

const panel = cva("relative", {
  variants: {
    tier: { light: "glass-2", dark: "glass-dark" },
    radius: { card: "rounded-card", panel: "rounded-panel" },
    rim: { true: "glass-rim", false: "" },
  },
  defaultVariants: { tier: "light", radius: "panel", rim: false },
});

export type GlassPanelProps = ComponentProps<"div"> & VariantProps<typeof panel>;

/** Call panel, workflow nodes, pricing cards. */
export function GlassPanel({ tier, radius, rim, className, ...rest }: GlassPanelProps) {
  return <div className={cn(panel({ tier, radius, rim }), className)} {...rest} />;
}

/** Small cards inside scenes: stats, feature mockups. */
export function GlassCard({ className, ...rest }: ComponentProps<"div">) {
  return <div className={cn("relative rounded-card glass-2 p-5", className)} {...rest} />;
}

const chip = cva(
  "glass-1 inline-flex items-center gap-2 rounded-full font-medium whitespace-nowrap",
  {
    variants: {
      size: { sm: "h-7 px-3 text-xs", md: "h-9 px-4 text-sm" },
    },
    defaultVariants: { size: "md" },
  },
);

export type GlassChipProps = ComponentProps<"span"> & VariantProps<typeof chip>;

/** Eyebrows, status pills, "Checking free slots…". */
export function GlassChip({ size, className, ...rest }: GlassChipProps) {
  return <span className={cn(chip({ size }), className)} {...rest} />;
}

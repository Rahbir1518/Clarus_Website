/**
 * The numbers behind the three glass tiers, for the contrast checker.
 * Keep in step with the `glass-*` utilities in src/app/globals.css.
 */

export type GlassTier = "glass-1" | "glass-2" | "glass-dark";

export type GlassSpec = {
  tier: GlassTier;
  label: string;
  use: string;
  /** Tint laid over the blurred backdrop. */
  tint: string;
  alpha: number;
  saturate: number;
  blur: number;
  /** Text colours this tier is expected to carry. */
  text: { name: string; color: string }[];
};

export const INK = "#0E1726";
export const INK_MUTED = "#3E4A5C";

export const glassTiers: GlassSpec[] = [
  {
    tier: "glass-1",
    label: "Glass 1 · light",
    use: "Nav, chips, toasts",
    tint: "#FFFFFF",
    alpha: 0.45,
    saturate: 1.6,
    blur: 12,
    text: [
      { name: "ink", color: INK },
      { name: "ink-muted", color: INK_MUTED },
    ],
  },
  {
    tier: "glass-2",
    label: "Glass 2 · panel",
    use: "Panels, nodes, pricing cards",
    tint: "#FFFFFF",
    alpha: 0.3,
    saturate: 1.8,
    blur: 24,
    text: [
      { name: "ink", color: INK },
      { name: "ink-muted", color: INK_MUTED },
    ],
  },
  {
    tier: "glass-dark",
    label: "Glass dark · call panel",
    use: "The AI call panel",
    tint: INK,
    alpha: 0.72,
    saturate: 1.7,
    blur: 28,
    text: [
      { name: "white", color: "#FFFFFF" },
      { name: "white/72", color: "rgba(255,255,255,0.72)" },
    ],
  },
];

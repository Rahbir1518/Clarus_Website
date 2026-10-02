/**
 * WCAG contrast for text on glass.
 *
 * A glass panel's real background is: the scene behind it, saturated by the
 * panel's `backdrop-filter: saturate()`, blurred, then tinted by the panel's
 * own translucent fill. Blur only averages nearby scene colours, so the worst
 * case is the panel sitting over one scene colour (or a blend of two). We
 * check every one of those, and report the lowest ratio.
 */

import { sceneSamples, type Scene } from "./scenes";
import type { GlassSpec } from "./glass";

type RGB = [number, number, number];
type RGBA = [number, number, number, number];

export function parseColor(input: string): RGBA {
  const hex = input.match(/^#([0-9a-f]{6})$/i);
  if (hex?.[1]) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgba = input.match(/^rgba?\(([^)]+)\)$/i);
  if (rgba?.[1]) {
    const [r = 0, g = 0, b = 0, a = 1] = rgba[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    return [r, g, b, a];
  }
  throw new Error(`Unsupported colour: ${input}`);
}

/** CSS `saturate()` as specified (Filter Effects 1, feColorMatrix saturate), in sRGB. */
export function saturate([r, g, b]: RGB, s: number): RGB {
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  return [
    clamp((0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b),
    clamp((0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b),
    clamp((0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b),
  ];
}

/** Source-over: `top` at `alpha` over an opaque `bottom`. */
export function over(top: RGB, alpha: number, bottom: RGB): RGB {
  return [0, 1, 2].map((i) => top[i]! * alpha + bottom[i]! * (1 - alpha)) as RGB;
}

export function luminance([r, g, b]: RGB): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function ratio(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const rgb = (c: string): RGB => parseColor(c).slice(0, 3) as RGB;

/** The scene colours a panel might sit over: each sample, plus each 50/50 blend of two. */
function backdrops(scene: Scene, extra: string[]): RGB[] {
  const samples = [...sceneSamples(scene), ...extra].map(rgb);
  const blends: RGB[] = [];
  samples.forEach((a, i) => samples.slice(i + 1).forEach((b) => blends.push(over(a, 0.5, b))));
  return [...samples, ...blends];
}

export type ContrastResult = {
  text: string;
  min: number;
  /** The panel colour that produced `min`, for display. */
  worstSurface: RGB;
  passesAA: boolean;
};

/** `extra`: opaque colours of anything else the panel can sit over (shapes, UI behind it). */
export function glassContrast(
  spec: GlassSpec,
  scene: Scene,
  extra: string[] = [],
): ContrastResult[] {
  const tint = rgb(spec.tint);
  const surfaces = backdrops(scene, extra).map((bg) =>
    over(tint, spec.alpha, saturate(bg, spec.saturate)),
  );

  return spec.text.map(({ name, color }) => {
    const [r, g, b, a] = parseColor(color);
    let min = Infinity;
    let worstSurface = surfaces[0]!;
    for (const surface of surfaces) {
      const textOnSurface = over([r, g, b], a, surface);
      const value = ratio(textOnSurface, surface);
      if (value < min) [min, worstSurface] = [value, surface];
    }
    return { text: name, min, worstSurface, passesAA: min >= 4.5 };
  });
}

export const toHex = ([r, g, b]: RGB) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`.toUpperCase();

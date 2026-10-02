/**
 * Scene gradients: the coloured meshes that sit behind every glass surface.
 *
 * This file is the single source for them. <GradientScene> paints from it, and
 * the /styleguide contrast table samples the same colours, so a palette change
 * here is re-checked against WCAG on the next page load.
 */

export type SceneName = "teal" | "violet" | "rose" | "night";

type Blob = { at: [x: number, y: number]; color: string; reach: number };

export type Scene = {
  name: SceneName;
  label: string;
  base: string;
  blobs: Blob[];
  /** Whether the scene reads as light or dark overall; decides the default glass tier on it. */
  tone: "light" | "dark";
};

export const scenes: Record<SceneName, Scene> = {
  teal: {
    name: "teal",
    label: "Teal",
    base: "#DDE7F0",
    tone: "light",
    blobs: [
      { at: [20, 20], color: "#9FE3D6", reach: 50 },
      { at: [80, 30], color: "#A9B8FF", reach: 55 },
      { at: [50, 90], color: "#F6C6E0", reach: 50 },
    ],
  },
  violet: {
    name: "violet",
    label: "Violet",
    base: "#E4E2F6",
    tone: "light",
    blobs: [
      { at: [15, 25], color: "#C3B5FF", reach: 55 },
      { at: [85, 20], color: "#9FD0FF", reach: 50 },
      { at: [60, 95], color: "#FFD3C4", reach: 50 },
    ],
  },
  rose: {
    name: "rose",
    label: "Rose",
    base: "#F2E6EA",
    tone: "light",
    blobs: [
      { at: [20, 30], color: "#FFB8BF", reach: 55 },
      { at: [85, 20], color: "#FFE0B8", reach: 45 },
      { at: [45, 95], color: "#C9BCFF", reach: 55 },
    ],
  },
  night: {
    name: "night",
    label: "Night",
    base: "#111827",
    tone: "dark",
    blobs: [
      { at: [20, 15], color: "#3B2D6E", reach: 55 },
      { at: [85, 35], color: "#1C5A63", reach: 50 },
      { at: [50, 100], color: "#6E2A3C", reach: 55 },
    ],
  },
};

export const sceneList = Object.values(scenes);

export function sceneBackground(scene: Scene): string {
  const layers = scene.blobs.map(
    ({ at: [x, y], color, reach }) =>
      `radial-gradient(at ${x}% ${y}%, ${color} 0, transparent ${reach}%)`,
  );
  return [...layers, scene.base].join(", ");
}

/** Every colour a glass panel on this scene could plausibly sit over. */
export function sceneSamples(scene: Scene): string[] {
  return [scene.base, ...scene.blobs.map((b) => b.color)];
}

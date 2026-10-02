import type { Transition, Variants } from "motion/react";

/** The site's one easing curve. Mirrors `--ease-glide` in globals.css. */
export const glide = [0.22, 1, 0.36, 1] as const;

export const floatIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: glide } },
};

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: glide } },
};

export const stagger = (step = 0.08): Transition => ({ staggerChildren: step });

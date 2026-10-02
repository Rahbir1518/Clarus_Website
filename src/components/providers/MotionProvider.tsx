"use client";

import { LazyMotion } from "motion/react";
import type { ReactNode } from "react";
import { islandsHydrated } from "@/components/sections/deferred";

// Loading the features updates LazyMotion's context for the whole app, so it
// waits until any deferred islands have hydrated (see deferred.tsx).
const loadFeatures = () =>
  islandsHydrated()
    .then(() => import("@/lib/motion-features"))
    .then((m) => m.default);

/**
 * Motion's animation engine loads after hydration instead of with the page.
 * `strict` makes any stray `motion.*` component throw, so the bundle can't
 * quietly grow back.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}

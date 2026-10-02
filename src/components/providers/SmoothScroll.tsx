"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

let instance: Lenis | null = null;

/** The running Lenis instance, if smooth scrolling is on. */
export const getLenis = () => instance;

/**
 * Lenis smooth scrolling for mouse and trackpad users only. Touch scrolling is
 * already smooth, and Lenis's per-frame loop would cost phones CPU for nothing.
 * Off for anyone who prefers reduced motion. Created imperatively (no provider)
 * so switching it on after hydration can't remount the page.
 */
export function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: true });
    instance = lenis;
    return () => {
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
  return null;
}

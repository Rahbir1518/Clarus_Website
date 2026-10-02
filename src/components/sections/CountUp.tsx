"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * A number that counts up when it scrolls into view. The server renders the
 * final value, so it's correct without JavaScript; it only resets to zero if
 * it starts off screen, where the reset can't be seen.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(value);
  const armed = useRef(false);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      armed.current = true;
      setShown(0);
    }
  }, [reduced]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    // A plain rAF tween (ease-out cubic) rather than pulling in an animation engine.
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setShown(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

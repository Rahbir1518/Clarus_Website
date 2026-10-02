"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/analytics";

/** Starts PostHog once the browser is idle, so it never competes with first paint. */
export function AnalyticsProvider() {
  useEffect(() => {
    const start = () => void initPostHog();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 2000);
    return () => clearTimeout(id);
  }, []);
  return null;
}

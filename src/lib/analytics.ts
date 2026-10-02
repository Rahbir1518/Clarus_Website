"use client";

import { track as vercelTrack } from "@vercel/analytics";
import type { PostHog } from "posthog-js";

/** Every event the site sends, and its properties. */
type Events = {
  cta_click: { cta: string; location: string };
  demo_step_viewed: { scene: string; phase: string; lang: string };
  pricing_market_changed: { market: string; location: string };
  pilot_form_submitted: { country: string; location: string };
};

let posthog: PostHog | null = null;

/** Loads PostHog after the page is interactive, only when a key is set. */
export async function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || posthog) return;
  const { default: ph } = await import("posthog-js");
  ph.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    // No cookies and no session recording: page views and the events below only.
    persistence: "memory",
    disable_session_recording: true,
    autocapture: false,
    capture_pageview: "history_change",
  });
  posthog = ph;
}

export function track<E extends keyof Events>(event: E, props: Events[E]) {
  try {
    vercelTrack(event, props);
    posthog?.capture(event, props);
  } catch {
    // Analytics must never break the page.
  }
}

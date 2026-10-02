"use client";

import { lazy, Suspense, useEffect, type ComponentType } from "react";

/**
 * Resolves once the browser is idle after load, or as soon as the visitor
 * scrolls, touches or types, whichever is first (immediately on the server).
 * Below-the-fold islands can only be reached by scrolling, so they are always
 * hydrated by the time anyone can click them.
 */
const afterIdle = () =>
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"] as const;
        const done = () => {
          events.forEach((e) => window.removeEventListener(e, done));
          resolve();
        };
        events.forEach((e) => window.addEventListener(e, done, { once: true, passive: true }));
        if ("requestIdleCallback" in window) window.requestIdleCallback(done, { timeout: 2500 });
        else setTimeout(done, 1200);
      });

/*
 * Islands waiting to hydrate. While an island waits, React holds its server
 * HTML in a dehydrated Suspense boundary. If any context above it changes in
 * that window, React can't deliver the update and throws the server HTML away
 * to client-render instead. So anything that would update context app-wide
 * (Motion's lazily loaded features) waits on `islandsHydrated()` first.
 */
let pending = 0;
let waiters: (() => void)[] = [];

function settle() {
  pending = Math.max(0, pending - 1);
  if (pending === 0) {
    waiters.forEach((resolve) => resolve());
    waiters = [];
  }
}

/** Resolves when every deferred island rendered so far has hydrated. */
export function islandsHydrated(): Promise<void> {
  return pending === 0 ? Promise.resolve() : new Promise((resolve) => waiters.push(resolve));
}

/**
 * A client island whose code loads after the page is idle.
 *
 * The server still renders it in full, so the HTML, SEO and no-JS view are
 * unchanged. On the client, React keeps that server HTML in place (a
 * dehydrated Suspense boundary) until the chunk arrives, then hydrates it. The
 * page's first paint and hydration no longer pay for demos far below the fold.
 */
export function deferred<P extends object>(load: () => Promise<ComponentType<P>>) {
  const Lazy = lazy(() =>
    afterIdle()
      .then(load)
      .then((Component) => {
        function Hydrated(props: P) {
          useEffect(settle, []);
          return <Component {...props} />;
        }
        return { default: Hydrated };
      }),
  );

  let counted = false;
  function Deferred(props: P) {
    // Counted during the first (hydration) render, before any effect runs, so
    // MotionProvider's effect already sees it.
    if (typeof window !== "undefined" && !counted) {
      counted = true;
      pending += 1;
    }
    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    );
  }
  return Deferred;
}

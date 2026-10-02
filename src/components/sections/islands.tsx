"use client";

import { deferred } from "./deferred";

/* Below-the-fold home-page demos, hydrated once the browser is idle. */

export const HowItWorksIsland = deferred(() => import("./HowItWorks").then((m) => m.HowItWorks));
export const FeatureCardsIsland = deferred(() =>
  import("./FeatureCards").then((m) => m.FeatureCards),
);
export const SideBySideIsland = deferred(() => import("./SideBySide").then((m) => m.SideBySide));
export const HearACallIsland = deferred(() => import("./HearACall").then((m) => m.HearACall));
export const RoiCalculatorIsland = deferred(() =>
  import("./RoiCalculator").then((m) => m.RoiCalculator),
);

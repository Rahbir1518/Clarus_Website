/** Pricing per clinic per month. Prices are shown only when `site.showPricing` is true. */

import type { MarketId } from "./site";

export type PlanId = "starter" | "growth" | "top";

export type Plan = {
  id: PlanId;
  name: string;
  blurb: string;
  features: string[];
  highlight?: boolean;
  badge?: string;
};

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    blurb: "Reminders and recalls that patients actually answer.",
    features: ["WhatsApp reminders", "SMS reminders", "Recalls for overdue check-ups"],
  },
  {
    id: "growth",
    name: "Growth",
    blurb: "Turn clinical events into booked visits, automatically.",
    features: [
      "Everything in Starter",
      "No-code workflow builder",
      "Slot filling for cancellations",
      "Revenue reports",
    ],
    highlight: true,
  },
  {
    id: "top",
    name: "Top",
    blurb: "The AI voice agent, in your patients' language.",
    features: [
      "Everything in Growth",
      "AI voice follow-up",
      "Multi-doctor and multi-branch",
      "Priority support",
    ],
    badge: "AI voice · rolling out 2027",
  },
];

export type MarketPricing = {
  market: MarketId;
  label: string;
  currency: "BDT" | "USD";
  prices: Record<PlanId, string>;
  setup: string;
};

export const pricing: MarketPricing[] = [
  {
    market: "bd",
    label: "Bangladesh",
    currency: "BDT",
    prices: { starter: "৳6K", growth: "৳25K", top: "৳50K+" },
    setup: "Setup waived",
  },
  {
    market: "ae",
    label: "UAE",
    currency: "USD",
    prices: { starter: "$249", growth: "$599", top: "$1,199" },
    setup: "$500 one-time setup",
  },
  {
    market: "qa",
    label: "Qatar",
    currency: "USD",
    prices: { starter: "$249", growth: "$599", top: "$1,249" },
    setup: "$500 one-time setup",
  },
  {
    market: "ca",
    label: "Canada",
    currency: "USD",
    prices: { starter: "$249", growth: "$599", top: "$1,249" },
    setup: "$600 one-time setup",
  },
];

/** Plan price as a number, for the ROI calculator. */
export const growthMonthly: Record<MarketId, number> = { bd: 25000, ae: 599, qa: 599, ca: 599 };

export const comparison: { feature: string; plans: Record<PlanId, boolean | string> }[] = [
  { feature: "WhatsApp and SMS reminders", plans: { starter: true, growth: true, top: true } },
  { feature: "Recalls", plans: { starter: true, growth: true, top: true } },
  { feature: "No-code workflow builder", plans: { starter: false, growth: true, top: true } },
  { feature: "Slot filling", plans: { starter: false, growth: true, top: true } },
  { feature: "Revenue reports", plans: { starter: false, growth: true, top: true } },
  { feature: "AI voice follow-up", plans: { starter: false, growth: false, top: "2027" } },
  {
    feature: "AI voice minutes",
    plans: { starter: false, growth: false, top: "Allowance, then per minute" },
  },
  { feature: "Multi-doctor and multi-branch", plans: { starter: false, growth: false, top: true } },
  { feature: "Priority support", plans: { starter: false, growth: false, top: true } },
];

export const pricingNotes = {
  overage: "AI voice minutes above the plan allowance are billed per minute.",
  groups: "Hospital groups and multi-site networks get a custom quote.",
  hidden: "Pilot pricing on request",
};

export const pricingFaq = [
  {
    q: "What's in the founding pilot?",
    a: "The pilot is free. We set Clarus up for you, import your schedule, draw your first workflows with your team, and you get a direct line to the founders.",
  },
  {
    q: "How are AI voice minutes billed?",
    a: "The Top plan includes an allowance of AI voice minutes each month. Minutes above it are billed per minute, and you can see usage at any time.",
  },
  {
    q: "Is there a setup fee?",
    a: "In the UAE and Qatar setup is $500, and in Canada $600, one time. In Bangladesh it is waived.",
  },
  {
    q: "We run several hospitals or branches.",
    a: "Hospital groups get a custom quote. Talk to us about your sites and volumes.",
  },
];

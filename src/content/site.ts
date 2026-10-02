/** Site-wide settings. Change the domain, contact address or pricing visibility here. */

export const site = {
  name: "Clarus",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://clarus.health",
  contactEmail: "hello@clarus.health",
  /** false replaces every price with "Pilot pricing on request". */
  showPricing: true,
  year: 2026,
} as const;

export const nav = [
  { key: "howItWorks", href: "/how-it-works" },
  { key: "safety", href: "/safety" },
  { key: "pricing", href: "/pricing" },
  { key: "about", href: "/about" },
] as const;

export const team = [
  {
    name: "Mohammed Faraz Kabbo",
    role: "Co-founder & CEO",
    photo: "/team/team-kabbo.jpg",
    initials: "MK",
  },
  {
    name: "Rubaiya Hassin Farheen",
    role: "Co-founder & COO",
    photo: "/team/team-rubaiya.jpg",
    initials: "RF",
  },
  {
    name: "MD Rahbir Mahdi",
    role: "Co-founder & CTO",
    photo: "/team/team-rahbir.jpg",
    initials: "RM",
  },
] as const;

export const markets = [
  {
    id: "bd",
    name: "Bangladesh",
    city: "Dhaka",
    focus: "Private clinics and diagnostic centres. Calls in Bangla.",
    lonLat: [90.41, 23.81] as [number, number],
  },
  {
    id: "ae",
    name: "UAE",
    city: "Dubai first",
    focus: "Multi-doctor clinics. Calls in Arabic and English.",
    lonLat: [55.27, 25.2] as [number, number],
  },
  {
    id: "qa",
    name: "Qatar",
    city: "Doha",
    focus: "Specialist and family clinics. Calls in Arabic and English.",
    lonLat: [51.53, 25.29] as [number, number],
  },
  {
    id: "ca",
    name: "Canada",
    city: "Ontario",
    focus: "Multi-provider dental and specialist clinics.",
    lonLat: [-79.38, 43.65] as [number, number],
  },
] as const;

export type MarketId = (typeof markets)[number]["id"];

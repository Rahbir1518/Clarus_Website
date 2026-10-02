/**
 * Problem statistics. Every industry number carries its source; the site
 * prints it in small type under the figure.
 */

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Shown before the number, e.g. "~". */
  approx?: boolean;
  /** Overrides the count-up, for ranges. */
  display?: string;
  label: string;
  source: string;
  href?: string;
};

export const problemStats: Stat[] = [
  {
    value: 23,
    suffix: "%",
    approx: true,
    label:
      "of booked appointments are missed on average worldwide. Canadian clinics report 10–25%.",
    source: "Medimap, Jul 2026",
  },
  {
    value: 196,
    prefix: "$",
    label: "the average cost of one no-show, in a large hospital study.",
    source: "PMC4714455",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4714455/",
  },
  {
    value: 57,
    display: "$30–57K",
    label: "lost a year by a clinic that misses 8 visits a week.",
    source: "Clarus model",
  },
];

export const evidence = {
  reminderLift:
    "Reminders lift attendance by about 11% in trial evidence; vendors report 20–50% fewer no-shows.",
  reminderSource: "RCT synthesis, vendor reports",
  payback: "A $500/month plan pays for itself with 4–6 recovered visits.",
};

/**
 * Privacy policy and website terms.
 *
 * These are plain-language starting drafts written for a pre-launch marketing
 * site. Have them reviewed by counsel in each market before launch, and keep
 * `updated` current when they change.
 */

import { site } from "./site";

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const privacy: LegalDoc = {
  title: "Privacy policy",
  updated: "2 October 2026",
  intro:
    "This policy covers the Clarus website: what we collect when you visit it or join the founding pilot, why, and what you can ask us to do with it. Patient data handled inside the Clarus product for a clinic is covered by that clinic's agreement with us, not by this page.",
  sections: [
    {
      heading: "What we collect",
      body: [
        "When you join the founding pilot, we collect what you type into the form: your name, clinic name, role, country, city, number of doctors, WhatsApp or phone number, email address, and what you'd like to automate first. We also note which page the form was on and the site language.",
        "When you browse the site, we collect anonymous usage events: pages viewed, which demo steps were played, which pricing market was selected, and clicks on our calls to action. We do not set advertising cookies, and our analytics are configured without session recording.",
      ],
    },
    {
      heading: "Why we collect it",
      body: [
        "We use pilot sign-up details only to contact you about the pilot and to plan onboarding. We use anonymous usage events to understand which parts of the site help clinics understand Clarus, so we can improve it.",
        "We do not sell your information, and we do not use it for advertising.",
      ],
    },
    {
      heading: "Who processes it for us",
      body: [
        "Supabase stores pilot sign-ups. Resend sends the confirmation email. Vercel hosts the site and provides privacy-friendly page analytics. PostHog receives the anonymous usage events listed above. Cloudflare Turnstile checks that the pilot form is being filled in by a person.",
        "Each of these providers processes data on our instructions and only for the purpose above.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "We keep pilot sign-up details for as long as we are in conversation about the pilot, and for no more than 24 months after our last contact, unless you become a customer. You can ask us to delete them sooner at any time.",
      ],
    },
    {
      heading: "Your choices",
      body: [
        `You can ask to see, correct or delete the information we hold about you by emailing ${site.contactEmail}. We will reply within 30 days.`,
      ],
    },
    {
      heading: "Changes",
      body: ["If we change this policy, we'll update the date at the top of this page."],
    },
  ],
};

export const terms: LegalDoc = {
  title: "Website terms",
  updated: "2 October 2026",
  intro:
    "These terms cover your use of the Clarus marketing website. Use of the Clarus product by a clinic is governed by a separate agreement.",
  sections: [
    {
      heading: "Using this site",
      body: [
        "You may browse this site and share links to it. Please don't attempt to disrupt it, probe it for vulnerabilities without our permission, or submit information that isn't yours.",
      ],
    },
    {
      heading: "Demos and examples",
      body: [
        "The calls, calendars, dashboards and patients shown on this site are product demonstrations. Every patient, clinic and doctor in them is fictional.",
        "Some features shown, including AI voice follow-up, are not yet generally available. Where that is the case, the site says so.",
      ],
    },
    {
      heading: "Figures and estimates",
      body: [
        "Industry statistics on this site are cited with their sources. The return-on-investment calculator gives an estimate based on the numbers you enter; it is not a promise of results.",
      ],
    },
    {
      heading: "Not medical advice",
      body: ["Nothing on this site is medical advice."],
    },
    {
      heading: "Prices",
      body: [
        "Prices shown are per clinic per month, before applicable taxes, and may change before a contract is signed. The price in your signed agreement is the one that applies.",
      ],
    },
    {
      heading: "Contact",
      body: [`Questions about these terms: ${site.contactEmail}.`],
    },
  ],
};

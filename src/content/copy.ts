/**
 * Page copy (English). Edit wording here; components only lay it out.
 * Translated strings (nav, hero, CTAs, the pilot form) live in src/messages.
 */

export const home = {
  problem: {
    eyebrow: "The problem",
    title: "Missed visits are the quietest way a clinic loses money.",
    sub: "Not because no one cares, but because nobody has time to phone every patient whose result came back or who didn't turn up.",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From clinical event to booked visit.",
    sub: "One loop, drawn once by your team, run every time.",
    steps: [
      {
        title: "A clinical event happens",
        body: "A lab result arrives, a follow-up comes due, or an appointment is missed. Drop in a lab report PDF and Clarus creates or updates the patient from it.",
        facts: ["Read on our servers with fixed patterns", "The PDF is never sent to an AI model"],
      },
      {
        title: "Your workflow checks the record",
        body: "Staff draw the rules once in a drag-and-drop builder: trigger, conditions, action. They decide who is contacted, how, and why.",
        facts: ["No code", "Abnormal results go to a doctor, never to a call"],
      },
      {
        title: "Eight safety checks run first",
        body: "Before anything is sent or dialled, every check has to pass. If one can't, the run fails closed: nothing goes out, and your team sees exactly why.",
        facts: ["Kill switch, calling hours, attempt cap", "Fixed list of call reasons"],
      },
      {
        title: "WhatsApp, SMS or an AI voice call",
        body: "The agent speaks the patient's language, says it's an automated call from your clinic, confirms who it's talking to, and only offers times your calendar says are free.",
        facts: ["Bangla, Arabic, English", "Pilot: WhatsApp and SMS · AI voice: 2027"],
      },
      {
        title: "The outcome is written back",
        body: "The booking lands on your calendar seconds after hang-up. The transcript and outcome are logged against the patient, and the doctor gets a summary.",
        facts: ["Live dashboard updates", "Full audit trail"],
      },
    ],
  },
  features: {
    eyebrow: "Built for how clinics actually work",
    title: "Most tools send reminders. Clarus recovers the visit.",
    cards: [
      {
        title: "Only offers times that are free.",
        body: "The agent reads your live calendar during the call, and explains when a time won't work.",
      },
      {
        title: "Speaks your patients' language.",
        body: "Bangla, Arabic and English, with your clinic's name and your doctor's.",
      },
      {
        title: "Draw it once. No code.",
        body: "Staff drag triggers, conditions and actions into place. Clarus runs it every time.",
      },
      {
        title: "Every call on the record.",
        body: "Transcript, outcome and every step, logged against the patient.",
      },
    ],
  },
  sideBySide: {
    eyebrow: "One call, two views",
    title: "What the patient hears. What your front desk sees.",
    sub: "Same call, same second. While the patient picks a time, the front desk watches the booking happen.",
    patient: "Patient's phone",
    clinic: "Your front desk",
  },
  hearACall: {
    eyebrow: "Hear a call",
    title: "Listen to Clarus book a visit.",
    sub: "A scripted demo call: the patient asks for a day the clinic is closed, and the agent offers what's actually free.",
  },
  safety: {
    eyebrow: "Safety",
    title: "Safe by default. Fails closed.",
    sub: "Every safeguard is a check in code, not a promise in a prompt.",
    tiles: [
      {
        title: "8 safety checks before every call",
        body: "If any check can't pass, nothing is sent.",
      },
      {
        title: "PDFs never sent to AI",
        body: "Lab reports are read with fixed patterns, on our servers.",
      },
      {
        title: "Full audit trail",
        body: "Every run, transcript and outcome, against the patient.",
      },
      {
        title: "In-region data hosting",
        body: "Patient data stays in the region your clinic is in.",
      },
      { title: "Per-practice data isolation", body: "Every query is scoped to one practice." },
      {
        title: "ISO 27001 and SOC 2",
        body: "On our roadmap. We are not certified yet.",
        roadmap: true,
      },
    ],
    cta: "How Clarus stays safe",
  },
  roi: {
    eyebrow: "What it's worth",
    title: "What would recovered visits be worth to you?",
    sub: "Move the sliders to match your clinic.",
    missed: "Missed visits per week",
    value: "Average visit value",
    rate: "Visits Clarus recovers",
    result: "recovered a year",
    payback: "Clarus Growth pays for itself in {n} recovered visits a month.",
    formula: "Missed visits a week × 52 × recovery rate × visit value.",
    estimate: "An estimate, not a promise.",
  },
  pricing: {
    eyebrow: "Pricing",
    title: "Priced per clinic, per month.",
    sub: "Start with reminders. Add workflows and the AI voice agent when you're ready.",
    full: "Compare every plan",
  },
  faq: {
    eyebrow: "Questions",
    title: "Asked by clinics like yours.",
    more: "Still wondering about something?",
  },
};

export const howItWorksPage = {
  title: "How Clarus works.",
  sub: "From the moment a result arrives to the moment the booking lands on your calendar, step by step.",
  sequence: {
    title: "Who talks to whom",
    sub: "A single call, as a sequence. Clarus is the only one that touches every part.",
  },
  whatIf: {
    title: "What happens when…",
    items: [
      {
        q: "the patient doesn't answer?",
        a: "The attempt is logged and the follow-up stays in your queue. Any further attempt happens inside your calling hours and within the attempt cap (3 calls in 24 hours by default).",
      },
      {
        q: "the wrong person picks up?",
        a: "The agent asks for the patient by name before saying anything about the visit. If it isn't them, it doesn't mention the reason for the call, and offers a call back.",
      },
      {
        q: "the time the patient wants is taken?",
        a: "The agent checks the calendar during the call, says the time isn't free, and offers the nearest times that are. It never books over another patient.",
      },
      {
        q: "the patient asks a medical question?",
        a: "The agent never discusses results, values or medical advice. It says the doctor will go through it at the appointment, and offers a call back from the clinic.",
      },
      {
        q: "a result is abnormal?",
        a: "The run never phones the patient. It is flagged for your doctor's review queue instead.",
      },
      {
        q: "it's outside calling hours?",
        a: "The call is not placed. It waits for the next calling window, or for a person to decide.",
      },
    ],
  },
};

export const safetyPage = {
  title: "Safe in every way.",
  sub: "Clarus talks to your patients, so every safeguard is enforced in code. If a check can't pass, nothing is sent, and your team sees exactly why.",
  rule: {
    eyebrow: "The one rule",
    title: "The voice agent never discloses a clinical result.",
    body: "It may say results are ready and book a time. It never says what a result was, whether it was normal, or what it means. Everything clinical happens with your doctor.",
  },
  gatesTitle: "Eight checks before every call",
  gatesSub:
    "In the order Clarus runs them. What may be said comes first; whether to dial at all comes second.",
  data: {
    title: "Where patient data goes",
    rows: [
      {
        where: "Words spoken on a call",
        clinical: "Never",
        note: "The agent can't say what it was never given.",
      },
      {
        where: "Data sent to the voice provider",
        clinical: "Never",
        note: "First name, clinic, doctor, approved reason, free times.",
      },
      {
        where: "Lab report PDFs",
        clinical: "Our servers only",
        note: "Parsed with fixed patterns; never sent to an AI model.",
      },
      {
        where: "Doctor summaries and run logs",
        clinical: "Yes, staff only",
        note: "Practice-scoped and never read to a patient.",
      },
      {
        where: "Audit trail",
        clinical: "Never",
        note: "Records who accessed what, not the clinical content.",
      },
    ],
  },
  hosting: [
    { title: "In-region hosting", body: "Patient data is hosted in-region for your clinic." },
    {
      title: "Isolated per practice",
      body: "Every query is scoped to one practice. One clinic can never see another's data.",
    },
    {
      title: "Signed call results",
      body: "Call outcomes are only accepted with a valid signature from the voice provider.",
    },
    {
      title: "ISO 27001 and SOC 2",
      body: "On our roadmap. We are not certified yet, and won't say we are until we are.",
    },
  ],
  before: {
    title: "Before the first real patient call",
    sub: "The pilot starts with WhatsApp and SMS. Before any AI voice call reaches a real patient, these are in place too:",
    items: [
      "Consent on file is checked before every call",
      "A do-not-call list that's checked before dialling",
      "Calling hours in each patient's own timezone",
      "A person approves each call during the pilot",
    ],
  },
};

export const aboutPage = {
  title: "Every result deserves a follow-up.",
  mission: [
    "Clinics don't lose patients because they don't care. They lose them in the gap between a result arriving and someone having time to pick up the phone.",
    "We're building Clarus to close that gap, safely and in the patient's own language, for clinics in Bangladesh, the Gulf and Canada.",
  ],
  teamTitle: "The founders",
  marketsTitle: "Where we're starting",
};

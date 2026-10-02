/**
 * The scripted demo call. Every demo scene on the site (hero, side-by-side,
 * "Hear a call", the how-it-works steps) plays from this one timeline.
 *
 * Everyone here is fictional. The call follows Clarus's real safety policy:
 * the agent says it is automated, confirms who it is talking to, gives a reason
 * from the fixed vocabulary ("results_ready"), never says a result or value,
 * offers only free times, and books the one the patient picks.
 */

export type Phase =
  "idle" | "dialing" | "verifying" | "checking" | "offering" | "booked" | "logged";

export const phaseOrder: Phase[] = [
  "idle",
  "dialing",
  "verifying",
  "checking",
  "offering",
  "booked",
  "logged",
];

export type CallLanguage = "en" | "bn" | "ar";
export type Speaker = "agent" | "patient";

export const clinic = {
  name: "Green Road Family Clinic",
  doctor: "Dr. Nusrat Jahan",
  doctorShort: "Dr. Jahan",
  closedDay: "Fri",
  hours: "09:00–20:00",
  appointmentMinutes: 30,
};

export const patient = {
  name: "Rafiq Ahmed",
  initials: "R.A.",
  phone: "+880 17•• ••• 214",
};

/** When each phase starts, in milliseconds from the start of the call. */
export const phaseAt: Record<Exclude<Phase, "idle">, number> = {
  dialing: 0,
  verifying: 1500,
  checking: 13500,
  offering: 15800,
  booked: 19800,
  logged: 23600,
};

/** Total length, including a short hold on the final state. */
export const callDuration = 26000;

type LineTiming = { speaker: Speaker; at: number; dur: number };

const timing: LineTiming[] = [
  { speaker: "agent", at: 1500, dur: 3900 },
  { speaker: "patient", at: 5800, dur: 900 },
  { speaker: "agent", at: 7200, dur: 4300 },
  { speaker: "patient", at: 11900, dur: 1400 },
  { speaker: "agent", at: 13900, dur: 3700 },
  { speaker: "patient", at: 18000, dur: 1300 },
  { speaker: "agent", at: 19700, dur: 3700 },
];

const text: Record<CallLanguage, string[]> = {
  en: [
    "Hello, this is an automated call from Green Road Family Clinic on behalf of Dr. Nusrat Jahan. Am I speaking with Rafiq Ahmed?",
    "Yes, speaking.",
    "Thank you. Dr. Jahan would like to see you about your recent test results, which need discussing. Can I book you a visit this week?",
    "Yes. Is Friday evening possible?",
    "The clinic is closed on Fridays. I can offer Thursday at 10:30, or Saturday at 11:00.",
    "Thursday 10:30 is good.",
    "Done. You're booked for Thursday at 10:30 with Dr. Jahan. You'll get a WhatsApp confirmation. Goodbye.",
  ],
  bn: [
    "আসসালামু আলাইকুম, এটি গ্রিন রোড ফ্যামিলি ক্লিনিক থেকে ডা. নুসরাত জাহানের পক্ষে একটি স্বয়ংক্রিয় কল। আমি কি রফিক আহমেদের সাথে কথা বলছি?",
    "জি, বলছি।",
    "ধন্যবাদ। আপনার সাম্প্রতিক পরীক্ষার ফলাফল, যা নিয়ে আলোচনা করা প্রয়োজন, সে বিষয়ে ডা. জাহান আপনার সাথে দেখা করতে চান। এই সপ্তাহে কি একটি সময় বুক করে দেব?",
    "জি। শুক্রবার সন্ধ্যায় কি হবে?",
    "শুক্রবার ক্লিনিক বন্ধ থাকে। আমি বৃহস্পতিবার সকাল ১০:৩০ অথবা শনিবার সকাল ১১:০০ দিতে পারি।",
    "বৃহস্পতিবার ১০:৩০ ঠিক আছে।",
    "হয়ে গেছে। বৃহস্পতিবার সকাল ১০:৩০-এ ডা. জাহানের সাথে আপনার অ্যাপয়েন্টমেন্ট বুক করা হয়েছে। WhatsApp-এ নিশ্চিতকরণ পাবেন। আল্লাহ হাফেজ।",
  ],
  ar: [
    "مرحبًا، هذه مكالمة آلية من عيادة جرين رود العائلية نيابةً عن الدكتورة نصرت جهان. هل أتحدث مع رفيق أحمد؟",
    "نعم، أنا هو.",
    "شكرًا لك. تود الدكتورة جهان رؤيتك بخصوص نتائج فحوصاتك الأخيرة التي تحتاج إلى مناقشة. هل أحجز لك موعدًا هذا الأسبوع؟",
    "نعم. هل يمكن مساء الجمعة؟",
    "العيادة مغلقة يوم الجمعة. يمكنني أن أعرض عليك الخميس الساعة 10:30 صباحًا أو السبت الساعة 11:00 صباحًا.",
    "الخميس 10:30 مناسب.",
    "تم. موعدك يوم الخميس الساعة 10:30 مع الدكتورة جهان. ستصلك رسالة تأكيد عبر واتساب. مع السلامة.",
  ],
};

export type ScriptLine = LineTiming & { text: string; gloss?: string };

/** The call in one language. `gloss` is the English caption, for non-English calls. */
export function script(lang: CallLanguage): ScriptLine[] {
  return timing.map((t, i) => ({
    ...t,
    text: text[lang][i]!,
    gloss: lang === "en" ? undefined : text.en[i],
  }));
}

export const languageLabel: Record<CallLanguage, string> = {
  en: "English",
  bn: "বাংলা",
  ar: "العربية",
};

/* ------------------------------------------------------------- calendar */

export const days = [
  { key: "Mon", date: 5 },
  { key: "Tue", date: 6 },
  { key: "Wed", date: 7 },
  { key: "Thu", date: 8 },
  { key: "Fri", date: 9 },
  { key: "Sat", date: 10 },
] as const;

export type DayKey = (typeof days)[number]["key"];

export const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];

export type AppointmentKind = "follow-up" | "check-up" | "lab-review" | "new";

/** Existing bookings that week. Fictional. */
export const bookings: { day: DayKey; time: string; who: string; kind: AppointmentKind }[] = [
  { day: "Mon", time: "09:00", who: "S. Akter", kind: "check-up" },
  { day: "Mon", time: "10:00", who: "K. Hossain", kind: "follow-up" },
  { day: "Mon", time: "11:30", who: "T. Rahman", kind: "lab-review" },
  { day: "Mon", time: "12:30", who: "J. Islam", kind: "new" },
  { day: "Tue", time: "09:30", who: "M. Begum", kind: "follow-up" },
  { day: "Tue", time: "10:30", who: "A. Karim", kind: "check-up" },
  { day: "Tue", time: "11:00", who: "F. Chowdhury", kind: "lab-review" },
  { day: "Tue", time: "12:00", who: "R. Sultana", kind: "follow-up" },
  { day: "Wed", time: "09:00", who: "H. Ali", kind: "new" },
  { day: "Wed", time: "10:00", who: "N. Haque", kind: "follow-up" },
  { day: "Wed", time: "10:30", who: "S. Mia", kind: "check-up" },
  { day: "Wed", time: "12:00", who: "P. Das", kind: "lab-review" },
  { day: "Thu", time: "09:00", who: "L. Khan", kind: "check-up" },
  { day: "Thu", time: "09:30", who: "B. Uddin", kind: "follow-up" },
  { day: "Thu", time: "11:00", who: "Z. Ahmed", kind: "lab-review" },
  { day: "Thu", time: "12:00", who: "I. Kabir", kind: "follow-up" },
  { day: "Thu", time: "12:30", who: "D. Roy", kind: "new" },
  { day: "Sat", time: "09:00", who: "E. Hasan", kind: "follow-up" },
  { day: "Sat", time: "09:30", who: "C. Paul", kind: "check-up" },
  { day: "Sat", time: "10:00", who: "G. Sarkar", kind: "lab-review" },
  { day: "Sat", time: "11:30", who: "O. Faruk", kind: "follow-up" },
  { day: "Sat", time: "12:30", who: "U. Nahar", kind: "new" },
];

/** The two free times the agent offers, and the one the patient picks. */
export const offered: { day: DayKey; time: string }[] = [
  { day: "Thu", time: "10:30" },
  { day: "Sat", time: "11:00" },
];
export const picked = { day: "Thu" as DayKey, time: "10:30", label: "Thu 10:30" };

/* ------------------------------------------------------------ audit log */

export const auditEvents: { at: number; time: string; event: string; detail: string }[] = [
  {
    at: phaseAt.dialing,
    time: "14:02:03",
    event: "call.started",
    detail: "Rafiq Ahmed · reason: results_ready",
  },
  {
    at: phaseAt.verifying + 4600,
    time: "14:02:09",
    event: "identity.confirmed",
    detail: "Patient confirmed name",
  },
  {
    at: phaseAt.checking,
    time: "14:02:16",
    event: "calendar.checked",
    detail: "Fri closed · 9 free slots this week",
  },
  {
    at: phaseAt.offering,
    time: "14:02:19",
    event: "slots.offered",
    detail: "Thu 10:30 · Sat 11:00",
  },
  {
    at: phaseAt.booked,
    time: "14:02:23",
    event: "appointment.created",
    detail: "Thu 8 Oct 10:30 · Dr. Jahan",
  },
  {
    at: phaseAt.logged,
    time: "14:02:27",
    event: "call.completed",
    detail: "Transcript saved · summary to doctor",
  },
];

/* ---------------------------------------------------------------- audio */

/**
 * Recorded demo calls. Drop the files in /public/demo/ and list them here; the
 * "Hear a call" player then follows the audio instead of its own clock, and
 * the transcript timings above should be adjusted to match the recording.
 * Until then the call plays silently as a live transcript.
 */
export const callAudio: Partial<Record<CallLanguage, string>> = {
  // en: "/demo/call-en.mp3",
  // bn: "/demo/call-bn.mp3",
};

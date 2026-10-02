export const faq: { q: string; a: string }[] = [
  {
    q: "Does the AI call patients without our approval?",
    a: "No. Calls only come from workflows your staff draw, for reasons on a fixed list, and every call passes 8 safety checks first. A kill switch stops every call at once, and it starts switched off.",
  },
  {
    q: "What languages does it speak?",
    a: "Bangla, Arabic and English. The agent speaks the patient's language, says it is an automated call from your clinic, and confirms who it is talking to before saying anything about the visit.",
  },
  {
    q: "Is patient data sent to AI models?",
    a: "PDF intake: never. Lab reports are read on our servers with fixed patterns. Calls: only the fields the call needs, such as first name, your clinic and doctor name, the approved reason and your free times. Results, values and diagnoses are never sent, and the agent never discloses a result.",
  },
  {
    q: "What if the patient wants a time you don't have?",
    a: "The agent checks your live calendar during the call and only offers times that are actually free. If the patient asks for a closed day, a time outside your hours or a booked slot, it says so and offers the nearest free times. If nothing suits, the patient is offered a call back from your front desk.",
  },
  {
    q: "Do we need to change our software?",
    a: "No. Clarus has its own appointments calendar, so you can start without touching your current system. HMS and EMR integrations are on the roadmap.",
  },
  {
    q: "What does it cost, and what's in the pilot?",
    a: "Plans start at $249 a month per clinic (৳6K in Bangladesh). The founding pilot is free: we set it up for you, and you get a direct line to the founders.",
  },
  {
    q: "Where is data stored?",
    a: "Patient data is hosted in-region, each practice's data is isolated from every other practice, and every access is logged. ISO 27001 and SOC 2 are on our roadmap; we are not certified yet.",
  },
];

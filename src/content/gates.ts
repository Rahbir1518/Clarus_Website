/**
 * The eight checks every call passes before Clarus dials. They mirror
 * `_call_patient` in the app's backend (app/engine/nodes.py), in the order the
 * engine runs them: what may be said first, then whether to dial at all.
 * Each one fails closed: if a check can't pass, no call is made.
 */

export type Gate = {
  id: string;
  label: string;
  /** One line for chips and tiles. */
  short: string;
  /** What the clinic sees when this gate stops a call. */
  failure: string;
  group: "content" | "dialing";
};

export const gates: Gate[] = [
  {
    id: "no_clinical_details",
    label: "No clinical details",
    short: "Results, values and diagnoses can't be put into a call script.",
    failure: "This workflow tried to pass a result into the call. Refused, so no call was made.",
    group: "content",
  },
  {
    id: "approved_reason",
    label: "Approved call reason",
    short: "The reason comes from a fixed list. Anything else is refused, not guessed.",
    failure: "Reason code not on the approved list. No call made.",
    group: "content",
  },
  {
    id: "abnormal_to_doctor",
    label: "Abnormal results go to a doctor",
    short: "A run that touched an abnormal result never phones the patient.",
    failure: "Abnormal result on this run. Sent to the doctor's review queue instead.",
    group: "content",
  },
  {
    id: "valid_number",
    label: "Valid number",
    short: "The patient's number must be real and dialable.",
    failure: "Patient number is missing or not dialable. No call made.",
    group: "dialing",
  },
  {
    id: "calls_enabled",
    label: "Calls switched on",
    short: "One switch stops every call at once. It starts off.",
    failure: "Calls are switched off for this clinic. The run stopped before dialling.",
    group: "dialing",
  },
  {
    id: "number_allowlist",
    label: "Number allowlist",
    short: "Only approved numbers can be dialled until you choose otherwise.",
    failure: "Number not on the allowlist. No call made.",
    group: "dialing",
  },
  {
    id: "calling_hours",
    label: "Calling hours",
    short: "No calls outside your clinic's calling window.",
    failure: "Outside calling hours (09:00–20:00). No call made.",
    group: "dialing",
  },
  {
    id: "attempt_cap",
    label: "Attempt cap",
    short: "No patient is called more than 3 times in 24 hours.",
    failure: "This patient has had 3 calls in 24 hours. No call made.",
    group: "dialing",
  },
];

/** The gate the "fails closed" demo variant trips on. */
export const demoFailingGate = "calling_hours";

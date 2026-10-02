import { z } from "zod";

/* Shared by the form (client validation) and the server action (the real check).
   Error messages are message keys under `pilot.errors`, translated in the form. */

export const roles = ["owner", "doctor", "manager", "front-desk", "other"] as const;
export const countries = ["BD", "AE", "QA", "CA", "other"] as const;
export const doctorCounts = ["1", "2-5", "6-20", "20+"] as const;
export const automateOptions = ["missed", "lab", "recalls", "reminders", "slots", "other"] as const;

export const pilotSchema = z.object({
  name: z.string().trim().min(2, "name").max(120, "name"),
  clinic: z.string().trim().min(2, "clinic").max(160, "clinic"),
  role: z.enum(roles, { error: "role" }),
  country: z.enum(countries, { error: "country" }),
  city: z.string().trim().min(2, "city").max(80, "city"),
  doctors: z.enum(doctorCounts, { error: "doctors" }),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9][0-9 ()-]{6,19}$/, "phone"),
  email: z.email("email").max(200, "email"),
  automate: z.array(z.enum(automateOptions)).min(1, "automate"),
  /** Honeypot. People never see it; bots fill it in. */
  website: z.string().max(0).optional(),
});

export type PilotInput = z.infer<typeof pilotSchema>;
export type PilotErrorKey = "captcha" | "unavailable" | "failed";

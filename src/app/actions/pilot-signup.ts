"use server";

import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { Resend } from "resend";
import { site } from "@/content/site";
import { pilotSchema, type PilotErrorKey } from "@/lib/pilot-schema";

export type PilotResult =
  | { ok: true }
  | { ok: false; error: PilotErrorKey | "invalid"; fieldErrors?: Record<string, string> };

/**
 * Pilot sign-up: validate → verify Turnstile → insert into Supabase → email.
 * Keys are read here, on the server, and never reach the browser.
 */
export async function submitPilotSignup(
  input: unknown,
  meta: { locale: string; token?: string; source?: string },
): Promise<PilotResult> {
  const parsed = pilotSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: "invalid", fieldErrors };
  }
  const data = parsed.data;

  // A filled honeypot is a bot. Tell it everything went fine.
  if (data.website) return { ok: true };

  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim();

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!meta.token || !(await verifyTurnstile(meta.token, ip)))
      return { ok: false, error: "captcha" };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[pilot-signup] Supabase not configured; would have stored:", data);
      return { ok: true };
    }
    // In production a sign-up that goes nowhere must not look like a success.
    console.error("[pilot-signup] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    return { ok: false, error: "unavailable" };
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
  const { error } = await supabase.from("pilot_signups").insert({
    name: data.name,
    clinic_name: data.clinic,
    role: data.role,
    country: data.country,
    city: data.city,
    doctors: data.doctors,
    phone: data.phone,
    email: data.email,
    automate: data.automate,
    locale: meta.locale,
    source: meta.source?.slice(0, 60) ?? null,
  });
  if (error) {
    console.error("[pilot-signup] insert failed:", error.message);
    return { ok: false, error: "failed" };
  }

  // Email is a courtesy; the sign-up is already safe in the table.
  await sendEmails(data).catch((e: unknown) => console.error("[pilot-signup] email failed:", e));

  return { ok: true };
}

async function verifyTurnstile(token: string, ip?: string | null): Promise<boolean> {
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

async function sendEmails(data: {
  name: string;
  clinic: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  automate: string[];
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const resend = new Resend(key);
  const from = process.env.PILOT_FROM_EMAIL ?? `Clarus <pilot@${new URL(site.url).hostname}>`;
  const notify = process.env.PILOT_NOTIFY_EMAIL ?? site.contactEmail;
  const first = data.name.split(" ")[0];

  await Promise.all([
    resend.emails.send({
      from,
      to: data.email,
      replyTo: notify,
      subject: "You're on the Clarus founding pilot list",
      text: [
        `Hi ${first},`,
        "",
        `Thanks for putting ${data.clinic} forward for the Clarus founding pilot.`,
        "A founder will WhatsApp you within 2 working days to find a time to talk.",
        "",
        "If anything changes before then, just reply to this email.",
        "",
        "The Clarus team",
      ].join("\n"),
    }),
    resend.emails.send({
      from,
      to: notify,
      replyTo: data.email,
      subject: `Pilot sign-up: ${data.clinic} (${data.city}, ${data.country})`,
      text: [
        `${data.name} · ${data.clinic}`,
        `${data.city}, ${data.country}`,
        `Phone/WhatsApp: ${data.phone}`,
        `Email: ${data.email}`,
        `Automate first: ${data.automate.join(", ")}`,
      ].join("\n"),
    }),
  ]);
}

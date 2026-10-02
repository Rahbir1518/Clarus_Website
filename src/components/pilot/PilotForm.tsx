"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useId, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { submitPilotSignup } from "@/app/actions/pilot-signup";
import { Button } from "@/components/ui/button";
import { site } from "@/content/site";
import { Link } from "@/i18n/navigation";
import { track } from "@/lib/analytics";
import { glide } from "@/lib/motion";
import {
  automateOptions,
  countries,
  doctorCounts,
  pilotSchema,
  roles,
  type PilotInput,
} from "@/lib/pilot-schema";
import { cn } from "@/lib/utils";
import { Turnstile } from "./Turnstile";

const control =
  "h-11 w-full rounded-chip bg-white/75 px-3.5 text-[0.95rem] text-ink ring-1 ring-ink/12 transition-shadow outline-none placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-brand-2 aria-[invalid=true]:ring-danger";

/** The founding-pilot form. Used inline on the home page, on /pilot, and in the dialog. */
export function PilotForm({ location, className }: { location: string; className?: string }) {
  const t = useTranslations("pilot");
  const locale = useLocale();
  const [token, setToken] = useState<string>();
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const onToken = useCallback((v: string | undefined) => setToken(v), []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PilotInput>({
    resolver: zodResolver(pilotSchema),
    defaultValues: { automate: [] },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await submitPilotSignup(values, { locale, token, source: location });
    if (res.ok) {
      track("pilot_form_submitted", { country: values.country, location });
      setDone(true);
      return;
    }
    if (res.error === "invalid" && res.fieldErrors) {
      for (const [field, key] of Object.entries(res.fieldErrors)) {
        setError(field as keyof PilotInput, { message: key });
      }
      return;
    }
    setServerError(t(`errors.${res.error}`, { email: site.contactEmail }));
  });

  const err = (field: keyof PilotInput) => {
    const key = errors[field]?.message;
    return key ? t(`errors.${key as "name"}`) : undefined;
  };

  if (done) {
    return (
      <m.div
        role="status"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: glide }}
        className={cn("flex flex-col items-center gap-4 py-10 text-center", className)}
      >
        <span className="grid size-14 place-items-center rounded-full bg-success text-white shadow-[0_12px_30px_-10px_rgb(24_169_87/0.8)]">
          <Check className="size-7" strokeWidth={2.5} />
        </span>
        <div className="text-h3">{t("success.title")}</div>
        <p className="max-w-sm text-ink-muted">{t("success.body")}</p>
      </m.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("grid gap-4 sm:grid-cols-2", className)}>
      <Field label={t("fields.name")} error={err("name")}>
        {(p) => <input {...p} {...register("name")} autoComplete="name" className={control} />}
      </Field>
      <Field label={t("fields.clinic")} error={err("clinic")}>
        {(p) => (
          <input {...p} {...register("clinic")} autoComplete="organization" className={control} />
        )}
      </Field>
      <Field label={t("fields.role")} error={err("role")}>
        {(p) => (
          <select
            {...p}
            {...register("role")}
            defaultValue=""
            className={cn(control, "select-chevron appearance-none")}
          >
            <option value="" disabled>
              {t("choose")}
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {t(`roles.${r}`)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={t("fields.country")} error={err("country")}>
        {(p) => (
          <select
            {...p}
            {...register("country")}
            defaultValue={locale === "bn" ? "BD" : ""}
            className={cn(control, "select-chevron appearance-none")}
          >
            <option value="" disabled>
              {t("choose")}
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {t(`countries.${c}`)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={t("fields.city")} error={err("city")}>
        {(p) => (
          <input {...p} {...register("city")} autoComplete="address-level2" className={control} />
        )}
      </Field>
      <Field label={t("fields.doctors")} error={err("doctors")}>
        {(p) => (
          <select
            {...p}
            {...register("doctors")}
            defaultValue=""
            className={cn(control, "select-chevron appearance-none")}
          >
            <option value="" disabled>
              {t("choose")}
            </option>
            {doctorCounts.map((d) => (
              <option key={d} value={d}>
                {t(`doctors.${d}`)}
              </option>
            ))}
          </select>
        )}
      </Field>
      <Field label={t("fields.phone")} error={err("phone")}>
        {(p) => (
          <input
            {...p}
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+880 17…"
            dir="ltr"
            className={cn(control, "text-start")}
          />
        )}
      </Field>
      <Field label={t("fields.email")} error={err("email")}>
        {(p) => (
          <input
            {...p}
            {...register("email")}
            type="email"
            autoComplete="email"
            dir="ltr"
            className={cn(control, "text-start")}
          />
        )}
      </Field>

      <fieldset
        className="sm:col-span-2"
        aria-invalid={!!errors.automate}
        aria-describedby={errors.automate ? "automate-error" : undefined}
      >
        <legend className="mb-2 text-sm font-medium">{t("fields.automate")}</legend>
        <div className="flex flex-wrap gap-2">
          {automateOptions.map((o) => (
            <label key={o} className="group relative cursor-pointer">
              <input type="checkbox" value={o} {...register("automate")} className="peer sr-only" />
              <span className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/60 px-3.5 text-sm ring-1 ring-ink/12 transition-colors peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-brand-2">
                {t(`automate.${o}`)}
              </span>
            </label>
          ))}
        </div>
        {errors.automate && (
          <p id="automate-error" className="mt-1.5 text-xs text-danger-ink">
            {err("automate")}
          </p>
        )}
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="sm:col-span-2">
        <Turnstile onToken={onToken} />
      </div>

      {serverError && (
        <p
          role="alert"
          className="rounded-chip bg-danger/10 px-4 py-3 text-sm text-danger-ink ring-1 ring-danger/30 sm:col-span-2"
        >
          {serverError}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs text-ink-muted">
          <Link
            href="/privacy"
            className="underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
          >
            {t("privacy")}
          </Link>
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby"?: string;
  }) => ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

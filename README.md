# Clarus website

The public marketing site for **Clarus**: AI-assisted patient follow-up that fills clinic calendars and recovers lost revenue.

The site shows the product working instead of describing it: a scripted demo call plays over the clinic's calendar, the agent checks for free times, the patient picks one, and the slot locks green. Every demo on the site runs from the same timeline, so the transcript, calendar, dashboard and audit log always agree.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, Radix primitives (shadcn-style), Motion, Lenis, next-intl, React Hook Form + Zod, Supabase, Resend, Cloudflare Turnstile, Vercel Analytics + PostHog, Playwright.
- **Languages:** English (`/`), Bangla (`/bn`), Arabic (`/ar`, right-to-left).
- **Pages:** home, `/how-it-works`, `/safety`, `/pricing`, `/about`, `/pilot`, `/privacy`, `/terms`, and `/styleguide` (internal, not indexed).

## Getting started

```bash
npm install
cp .env.example .env.local   # optional; everything works without keys in dev
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run test:e2e` | Playwright smoke tests on desktop and mobile (build first) |

## Environment variables

All are optional in development. See `.env.example` for the full list with notes.

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, OG images (default `https://clarus.health`) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Storing pilot sign-ups (server only) |
| `RESEND_API_KEY`, `PILOT_FROM_EMAIL`, `PILOT_NOTIFY_EMAIL` | Confirmation and notification emails |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Spam protection on the pilot form |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Product analytics events |

Without Supabase, sign-ups are logged to the console in development. In production the form tells the visitor sign-ups aren't connected yet, so a sign-up is never silently lost.

## Editing copy and content

Non-developers can change the words without touching components:

| File | What's in it |
|---|---|
| `src/messages/{en,bn,ar}.json` | Everything translated: nav, hero, CTAs, the pilot form, footer. bn and ar fall back to English for any key they don't have. |
| `src/content/copy.ts` | Section copy for the home page and the inner pages (English). |
| `src/content/stats.ts` | Problem statistics. Every figure needs its `source`. |
| `src/content/pricing.ts` | Plans, prices per market, the comparison table, pricing FAQ. |
| `src/content/faq.ts` | Home page FAQ. |
| `src/content/gates.ts` | The 8 safety checks, in the order the engine runs them. |
| `src/content/demo-call.ts` | The scripted call (all three languages), its timing, the calendar and the audit events. Everything in it is fictional. |
| `src/content/site.ts` | Domain, contact email, `showPricing`, team, markets. |
| `src/content/legal.ts` | Privacy policy and website terms. **Have these reviewed by counsel before launch.** |

Set `showPricing: false` in `src/content/site.ts` to replace every price with "Pilot pricing on request".

### Adding call audio

"Hear a call" plays silently as a live transcript until audio exists. Put recordings in `public/demo/` (for example `call-en.mp3`, `call-bn.mp3`), list them in `callAudio` in `src/content/demo-call.ts`, and adjust the line timings in the same file to match the recording. The player then follows the audio clock.

## Pilot form

`src/app/actions/pilot-signup.ts` is a Server Action: Zod validation → Turnstile check → insert into Supabase → Resend emails. Keys stay on the server.

Create the table with `supabase/migrations/20261002000000_pilot_signups.sql` (`supabase db push`, or paste it into the SQL editor). Row Level Security is on with no policies, so only the service role can read or write it.

The form is lazy-loaded (it brings React Hook Form and Zod), so it costs nothing until it's near the viewport or the dialog opens. Every "Join the pilot" button is a real link to `/pilot` that opens a dialog when JavaScript is available.

## How it's built

```
src/
  app/[locale]/(marketing)/   pages; layout adds nav, footer, pilot dialog
  app/[locale]/styleguide/    every token, glass tier, contrast check and demo component
  app/actions/                pilot sign-up server action
  components/glass/           GlassPanel, GlassCard, GlassChip, GradientScene
  components/demo/            DemoTimeline + every demo scene
  components/sections/        home and inner-page sections
  components/ui/              Radix primitives, restyled as glass
  content/                    all copy and data
  messages/                   translations
  lib/                        contrast maths, scenes, analytics, motion presets
```

### The demo engine

`components/demo/DemoTimeline.tsx` is a state machine (`idle → dialing → verifying → checking → offering → booked → logged`) driven by a single number: milliseconds since the call started. Every scene derives its state from that number, so seeking, looping, pausing off-screen and reduced motion are all trivial: reduced motion just means "show the end". Scenes that only care about the phase (the 60-cell calendar) subscribe to a separate phase context so they don't re-render on every tick.

### Design system: "Clinical glass"

A calm grey-lavender canvas; colour lives only inside gradient scenes (`src/lib/scenes.ts`), and glass always sits over a scene. Three tiers are defined as Tailwind utilities in `src/app/globals.css`:

| Tier | Use | Fill |
|---|---|---|
| `glass-1` | nav, chips, toasts | white 45%, blur 12px |
| `glass-2` | panels, nodes, pricing cards | white 30%, blur 24px |
| `glass-dark` | the AI call panel | ink 72%, blur 28px |

`/styleguide` computes WCAG contrast for every tier over every scene from the same numbers the CSS uses, including the browser's `saturate()` step. Rules that came out of it:

- `glass-dark` is 72% opaque, not 55%: at 55%, secondary text over light scenes is 3.2:1.
- Light glass is never used on the dark "night" scene (2.7:1).
- Crisp, saturated shapes behind light glass stay at 50% strength or less.
- Brand red `#C43B3B` is for the logo and accents; small red text uses `brand-ink` `#962828` (AA on every scene).

Status colours carry meaning only: green = booked, amber = outside hours or closed, red = a safety check failed closed. Each is always paired with an icon and a word.

### Performance choices

- Below-the-fold home demos are rendered on the server but hydrate only once the browser is idle (`components/sections/deferred.tsx`).
- Motion's animation engine loads after hydration (`LazyMotion`, `strict`).
- Sections use `content-visibility: auto`, so offscreen glass isn't styled or painted at first load.
- Lenis smooth scrolling runs only for mouse and trackpad users and is off with reduced motion.
- Bangla and Arabic fonts use `font-display: optional` to avoid layout shift.

## Quality status

Measured locally on the production build (Lighthouse 13, default mobile throttling):

| | Performance | Accessibility | Best practices | SEO | CLS |
|---|---|---|---|---|---|
| Inner pages, mobile | 88–91 | 100 | 100 | 100 | 0 |
| Home (en, bn, ar), mobile | 81 | 100 | 100 | 100 | 0 |
| Desktop (home, how it works, pricing, ar) | 99–100 | 100 | 100 | 100 | 0 |

The mobile performance target of 90 is met on about half the inner pages and missed on the home pages (81). What remains is mostly React and the Next.js runtime under Lighthouse's simulated slow-4G and 4× CPU slowdown; unthrottled, the home page paints in about 0.6s. Next steps if it matters: hydrate the hero demo on idle too, and send only the translation namespaces client components use.

Playwright covers: every page loads with one H1, no console errors and no sideways scroll (desktop and mobile); the 404 page; Arabic RTL and Bangla rendering; "Hear a call" playing through to a booking; pausing the hero demo; reduced motion showing final states; pilot form validation; the pilot dialog; and the pricing market switcher.

## Honesty rules

Clarus is pre-launch. The site must not show testimonials, customer logos, user counts, certifications or "live" claims. Specifically:

- WhatsApp and SMS are presented as the first pilot product; AI voice follow-up is labelled "rolling out 2027".
- Demo scenes are labelled "Product demo" and their people are fictional.
- ISO 27001 and SOC 2 are labelled roadmap, not certified.
- The demo call never states a result or value, and the workflow sends abnormal results to a doctor, never to a call, matching the app's safety policy.
- Every statistic carries its source.

Re-read this list before shipping copy changes.

## Deploying

Deploy to Vercel. Set the environment variables above in the project settings, run the Supabase migration, and point the domain at the project. Vercel Analytics turns on automatically there.

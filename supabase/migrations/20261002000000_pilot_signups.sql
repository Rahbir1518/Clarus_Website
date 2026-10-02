-- Founding-pilot sign-ups from the marketing site.
--
-- Written only by the site's server action, using the service-role key.
-- RLS is on with no policies, so the anon and authenticated roles can neither
-- read nor write this table; only the service role (which bypasses RLS) can.

create table if not exists public.pilot_signups (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 120),
  clinic_name text not null check (char_length(clinic_name) between 2 and 160),
  role        text not null check (role in ('owner', 'doctor', 'manager', 'front-desk', 'other')),
  country     text not null check (country in ('BD', 'AE', 'QA', 'CA', 'other')),
  city        text not null check (char_length(city) between 2 and 80),
  doctors     text not null check (doctors in ('1', '2-5', '6-20', '20+')),
  phone       text not null check (char_length(phone) between 7 and 20),
  email       text not null check (char_length(email) <= 200),
  automate    text[] not null default '{}',
  locale      text,
  source      text,
  status      text not null default 'new' check (status in ('new', 'contacted', 'onboarding', 'declined'))
);

create index if not exists pilot_signups_created_at_idx on public.pilot_signups (created_at desc);

alter table public.pilot_signups enable row level security;

comment on table public.pilot_signups is
  'Founding pilot sign-ups from the marketing site. Service role only (RLS on, no policies).';

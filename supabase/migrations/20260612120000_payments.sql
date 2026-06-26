-- YooKassa payments + time-limited premium.
-- Run this in the Supabase SQL editor (or via supabase CLI migrations).

-- Premium is now expiry-based: a user is premium while premium_expires_at > now().
-- The legacy profiles.is_subscribed boolean is no longer read by the app
-- (kept for backwards compatibility; safe to drop later).
alter table public.profiles
  add column if not exists premium_expires_at timestamptz;

-- One row per YooKassa payment attempt.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  yookassa_payment_id text unique not null,
  amount numeric(10, 2) not null,
  currency text not null default 'RUB',
  status text not null default 'pending', -- pending | succeeded | canceled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_status_idx on public.payments (status);

-- Service-role key bypasses RLS; enabling RLS with no policies blocks anon/authenticated
-- clients from touching payments directly. All access goes through the Express API.
alter table public.payments enable row level security;

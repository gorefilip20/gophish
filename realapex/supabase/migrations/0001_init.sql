-- ============================================================================
-- RealApex ($APEX) Presale Ecosystem — Initial Schema
-- PostgreSQL / Supabase migration
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) users
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique,
  wallet_address text unique,
  auth_provider text not null default 'wallet' check (auth_provider in ('email','wallet')),
  created_at    timestamptz not null default now(),
  referral_code text unique,
  referred_by   uuid references public.users(id) on delete set null,
  constraint users_identity_present check (email is not null or wallet_address is not null)
);
create index if not exists users_wallet_idx on public.users (wallet_address);
create index if not exists users_referred_by_idx on public.users (referred_by);

-- ----------------------------------------------------------------------------
-- 2) presale_transactions
-- ----------------------------------------------------------------------------
create table if not exists public.presale_transactions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.users(id) on delete set null,
  wallet_address  text not null,
  amount_spent    numeric(38,8) not null default 0,
  currency        text not null check (currency in ('ETH','USDT')),
  tokens_purchased numeric(38,8) not null default 0,
  tx_hash         text not null unique,
  timestamp       timestamptz not null default now(),
  stage           text not null default 'Stage 1'
);
create index if not exists tx_user_idx on public.presale_transactions (user_id);
create index if not exists tx_wallet_idx on public.presale_transactions (wallet_address);
create index if not exists tx_time_idx on public.presale_transactions (timestamp);

-- ----------------------------------------------------------------------------
-- 3) analytics_events
-- ----------------------------------------------------------------------------
create table if not exists public.analytics_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null check (event_type in ('page_view','pdf_download','wallet_connect')),
  user_id     uuid references public.users(id) on delete set null,
  ip_hash     text,
  user_agent  text,
  path        text,
  timestamp   timestamptz not null default now()
);
create index if not exists analytics_type_time_idx on public.analytics_events (event_type, timestamp);

-- ----------------------------------------------------------------------------
-- 4) brand_applications
-- ----------------------------------------------------------------------------
create table if not exists public.brand_applications (
  id              uuid primary key default gen_random_uuid(),
  project_name    text not null,
  contact_email   text not null,
  telegram_handle text,
  token_status    text not null default 'Idea' check (token_status in ('Idea','Pre-launch','Live')),
  budget_usd      numeric(18,2),
  services_needed text,
  status          text not null default 'Pending' check (status in ('Pending','Contacted','Approved')),
  created_at      timestamptz not null default now()
);
create index if not exists apps_status_idx on public.brand_applications (status);

-- ----------------------------------------------------------------------------
-- 5) site_config (singleton, id = 1)
-- ----------------------------------------------------------------------------
create table if not exists public.site_config (
  id                    int primary key default 1 check (id = 1),
  current_stage         text not null default 'Stage 1',
  token_price_usd       numeric(18,8) not null default 0.025,
  raised_amount_usd     numeric(18,2) not null default 0,
  target_amount_usd     numeric(18,2) not null default 2500000,
  eth_treasury_address  text not null default '0x0000000000000000000000000000000000000000',
  usdt_treasury_address text not null default '0x0000000000000000000000000000000000000000',
  presale_active        boolean not null default true,
  updated_at            timestamptz not null default now()
);

insert into public.site_config (id) values (1)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- RPC: atomic increment of the raised total
-- ----------------------------------------------------------------------------
create or replace function public.increment_raised(delta numeric)
returns void
language sql
security definer
set search_path = public
as $$
  update public.site_config
     set raised_amount_usd = raised_amount_usd + delta,
         updated_at = now()
   where id = 1;
$$;

-- ----------------------------------------------------------------------------
-- RPC: daily analytics buckets (last N days) for the admin charts
-- ----------------------------------------------------------------------------
create or replace function public.daily_analytics(days int default 14)
returns table (day date, page_views bigint, pdf_downloads bigint)
language sql
security definer
set search_path = public
as $$
  with series as (
    select generate_series(
      (current_date - (days - 1))::date,
      current_date,
      interval '1 day'
    )::date as day
  )
  select
    s.day,
    coalesce(sum((e.event_type = 'page_view')::int), 0)   as page_views,
    coalesce(sum((e.event_type = 'pdf_download')::int), 0) as pdf_downloads
  from series s
  left join public.analytics_events e
    on e.timestamp::date = s.day
  group by s.day
  order by s.day;
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Server routes use the service-role key (bypasses RLS). These policies keep
-- the browser (anon) key safe: read-only site_config, and users may read
-- their own rows once Supabase Auth is wired to link auth.uid() -> users.id.
-- ----------------------------------------------------------------------------
alter table public.users               enable row level security;
alter table public.presale_transactions enable row level security;
alter table public.analytics_events    enable row level security;
alter table public.brand_applications  enable row level security;
alter table public.site_config         enable row level security;

-- site_config: public read (presale widget reads price/target/stage).
drop policy if exists site_config_read on public.site_config;
create policy site_config_read on public.site_config
  for select using (true);

-- brand_applications: allow anonymous INSERT (public lead form), no read.
drop policy if exists brand_apps_insert on public.brand_applications;
create policy brand_apps_insert on public.brand_applications
  for insert with check (true);

-- analytics_events: allow anonymous INSERT (client beacons), no read.
drop policy if exists analytics_insert on public.analytics_events;
create policy analytics_insert on public.analytics_events
  for insert with check (true);

-- users / presale_transactions: no anon access (service role only).
-- Add self-read policies here after linking Supabase Auth users to public.users.

-- Optional realtime for the admin dashboard live counters:
-- alter publication supabase_realtime add table public.analytics_events;
-- alter publication supabase_realtime add table public.presale_transactions;

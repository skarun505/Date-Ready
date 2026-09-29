-- Migration: 001_initial_schema.sql
-- DateReady Supabase Database Schema

-- Enable UUID extension if not enabled
create extension if not exists "pgcrypto";

-- 1. USERS
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text,
  created_at timestamptz default now(),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_adset text,
  utm_ad text,
  fbclid text,
  fbp text,
  fbc text
);

-- 2. ASSESSMENTS
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  quiz_version text not null default 'v1',
  started_at timestamptz default now(),
  completed_at timestamptz,
  total_score int,
  profile text,
  approach int,
  conversation int,
  social int,
  resilience int,
  presentation int,
  primary_weakness text,
  secondary_weakness text,
  report_key text
);

-- 3. ANSWERS
create table if not exists answers (
  id bigserial primary key,
  assessment_id uuid references assessments(id) on delete cascade,
  question_id text not null,
  answer_id text not null,
  category text not null,
  score int not null
);

-- 4. PURCHASES
create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  assessment_id uuid references assessments(id) on delete cascade,
  product text not null,                   -- 'report_99' | 'kit_299' | 'challenge_499'
  amount int not null,                     -- in paise (e.g. 9900 = Rs 99)
  currency text default 'INR',
  payment_status text not null default 'pending',  -- pending | paid | failed | refunded
  provider_payment_id text unique,         -- idempotency key
  terms_accepted_at timestamptz,
  terms_version text,
  created_at timestamptz default now(),
  paid_at timestamptz
);

-- 5. REPORTS
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid unique references assessments(id) on delete cascade,
  purchase_id uuid references purchases(id) on delete set null,
  report_key text not null,
  pdf_path text,
  generated_at timestamptz default now()
);

-- 6. WEBHOOK EVENTS (debugging and idempotency)
create table if not exists webhook_events (
  id text primary key,                     -- provider event id
  type text,
  payload jsonb,
  received_at timestamptz default now(),
  processed boolean default false
);

-- Indexes for fast queries
create index if not exists idx_users_email on users(email);
create index if not exists idx_assessments_user on assessments(user_id);
create index if not exists idx_answers_assessment on answers(assessment_id);
create index if not exists idx_purchases_assessment on purchases(assessment_id);
create index if not exists idx_purchases_provider on purchases(provider_payment_id);
create index if not exists idx_reports_assessment on reports(assessment_id);

-- Enable Row Level Security (RLS) on all tables
alter table users enable row level security;
alter table assessments enable row level security;
alter table answers enable row level security;
alter table purchases enable row level security;
alter table reports enable row level security;
alter table webhook_events enable row level security;

-- STRICT SECURITY: NO PUBLIC POLICIES
-- All reads and writes must pass through Next.js server route handlers using the service role key.
-- Browser holds only signed assessment/access tokens.

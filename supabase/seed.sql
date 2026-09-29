-- Seed script for local DateReady development testing
insert into users (id, email, name, utm_source, utm_campaign)
values (
  '11111111-1111-1111-1111-111111111111',
  'test.user@dateready.subix.in',
  'Rahul Sharma',
  'meta_ads',
  'launch_in_blr'
) on conflict do nothing;

insert into assessments (
  id,
  user_id,
  quiz_version,
  completed_at,
  total_score,
  profile,
  approach,
  conversation,
  social,
  resilience,
  presentation,
  primary_weakness,
  secondary_weakness,
  report_key
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'v1',
  now(),
  65,
  'The Developing',
  10,
  16,
  14,
  11,
  14,
  'approach',
  'resilience',
  'approach__resilience'
) on conflict do nothing;

insert into purchases (
  id,
  user_id,
  assessment_id,
  product,
  amount,
  currency,
  payment_status,
  provider_payment_id,
  terms_accepted_at,
  terms_version,
  paid_at
) values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'report_99',
  9900,
  'INR',
  'paid',
  'dodo_pay_test_seed_001',
  now(),
  'v1',
  now()
) on conflict do nothing;

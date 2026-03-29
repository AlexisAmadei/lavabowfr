-- Insert test user
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'alexis@lavabow.fr',
  crypt('azerqsdf', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding identity
insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(),
  id,
  id,
  'email',
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  now(),
  now(),
  now()
from auth.users
where email = 'alexis@lavabow.fr';


insert into section_spotlight (title, subtitle, listen_link, status)
values
    ('LOVE, CHEER & BEERS', 'Nouvel album de LAVA BOW - 17 avril 2026', 'https://example.com/listen1', 'ACTIVE'),
    ('Grief Song', 'Notre dernier single', 'https://example.com/listen2', 'INACTIVE');

insert into section_videos (description, url, status, "order")
values
    ('Video 1 Description', 'https://youtu.be/thG_gKBKQaI?si=JbtfU9wQYdjdTCgb', 'ACTIVE', 1),
    ('Video 2 Description', 'https://youtu.be/HGwAhmrsR9w?si=KDui_88slsMX6U2m', 'ACTIVE', 2);

insert into clicks_paliers (name, target)
values
    ('Palier 1', 10),
    ('Palier 2', 50),
    ('Palier 3', 60),
    ('Palier 4', 100);

insert into newsletter (email, verify_status, mailchimp_synced)
values
    ('exemple1@exemple.com', 'verified', true),
    ('exemple2@exemple.com', 'unverified', false);

insert into section_events (title, description, price, date, place, link)
values
    ('Event 1', 'Description for event 1', 20, '2024-12-01 18:00:00+00', 'Venue 1', 'https://example.com/event1'),
    ('Event 2', 'Description for event 2', 0, '2025-01-15 20:00:00+00', 'Venue 2', 'https://example.com/event2');

insert into merch_items (name, description, price, tags, stripe_paylink, out_of_stock)
values
    ('T-Shirt Lavabowfr', 'T-shirt officiel avec logo Lavabowfr', 25, ARRAY['clothing', 'new'], 'https://buy.stripe.com/example1', false),
    ('Casquette Brodée', 'Casquette snapback avec logo brodé', 20, ARRAY['clothing', 'accessories'], 'https://buy.stripe.com/example2', false),
    ('Poster Édition Limitée', 'Poster format A2 édition limitée', 15, ARRAY['collectible', 'limited_edition'], 'https://buy.stripe.com/example3', true);

insert into global_variables (key, value)
values
    ('HERO_VIDEO_URL', 'https://youtu.be/HGwAhmrsR9w?si=KDui_88slsMX6U2m');

-- Insert test user
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'alexis@lavabow.fr',
  crypt('azerqsdf', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insert corresponding identity
insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select
  gen_random_uuid(),
  id,
  id,
  'email',
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  now(),
  now(),
  now()
from auth.users
where email = 'alexisamadei@proton.me';

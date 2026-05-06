-- Create storage bucket for lavabowfr
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lavabowfr',
  'lavabowfr',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Drop existing policies if they exist
drop policy if exists "Public read access" on storage.objects;
drop policy if exists "Authenticated users can upload" on storage.objects;
drop policy if exists "Authenticated users can update" on storage.objects;
drop policy if exists "Authenticated users can delete" on storage.objects;

-- Storage policies for lavabowfr bucket
-- Allow public read access
create policy "Public read access"
on storage.objects for select
using ( bucket_id = 'lavabowfr' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'lavabowfr' );

-- Allow authenticated users to update their uploads
create policy "Authenticated users can update"
on storage.objects for update
to authenticated
using ( bucket_id = 'lavabowfr' );

-- Allow authenticated users to delete
create policy "Authenticated users can delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'lavabowfr' );

-- Seed folder placeholders for storage browser
insert into storage.objects (id, bucket_id, name, owner, metadata, created_at, updated_at)
values
  (gen_random_uuid(), 'lavabowfr', 'merch/.keep', null, '{"size": 0}'::jsonb, now(), now()),
  (gen_random_uuid(), 'lavabowfr', 'pictures/.keep', null, '{"size": 0}'::jsonb, now(), now())
on conflict (bucket_id, name) do nothing;

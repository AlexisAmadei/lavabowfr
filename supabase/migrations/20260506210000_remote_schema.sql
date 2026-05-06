drop extension if exists "pg_net";

drop policy "Enable read access" on "public"."clicks_paliers";

drop policy "Enable read access for anon and auth" on "public"."music_player";

drop policy "Enable read access for all users" on "public"."online_users";

drop policy "Enable read access" on "public"."section_click";

drop policy "Update click count" on "public"."section_click";

drop policy "Select for anon" on "public"."section_events";

drop policy "Enable read access for all users" on "public"."section_pictures";

drop policy "Enable read access for all users" on "public"."section_spotlight";


  create policy "Enable read access"
  on "public"."clicks_paliers"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access for anon and auth"
  on "public"."music_player"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."online_users"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access"
  on "public"."section_click"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Update click count"
  on "public"."section_click"
  as permissive
  for update
  to anon, authenticated
using (true);



  create policy "Select for anon"
  on "public"."section_events"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."section_pictures"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Enable read access for all users"
  on "public"."section_spotlight"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Authenticated users can delete"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'lavabowfr'::text));



  create policy "Authenticated users can update"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'lavabowfr'::text));



  create policy "Authenticated users can upload"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'lavabowfr'::text));



  create policy "test public 1wdkp4m_1"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'lavabowfr'::text));



  create policy "test public 1wdkp4m_2"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'lavabowfr'::text));




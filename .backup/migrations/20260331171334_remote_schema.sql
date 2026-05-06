create sequence "public"."global_variables_id_seq";


  create table "public"."global_variables" (
    "id" integer not null default nextval('public.global_variables_id_seq'::regclass),
    "name" text not null,
    "value" text not null
      );


alter table "public"."global_variables" enable row level security;

alter sequence "public"."global_variables_id_seq" owned by "public"."global_variables"."id";

CREATE UNIQUE INDEX global_variables_name_key ON public.global_variables USING btree (name);

CREATE UNIQUE INDEX global_variables_pkey ON public.global_variables USING btree (id);

alter table "public"."global_variables" add constraint "global_variables_pkey" PRIMARY KEY using index "global_variables_pkey";

alter table "public"."global_variables" add constraint "global_variables_name_key" UNIQUE using index "global_variables_name_key";

grant delete on table "public"."global_variables" to "anon";

grant insert on table "public"."global_variables" to "anon";

grant references on table "public"."global_variables" to "anon";

grant select on table "public"."global_variables" to "anon";

grant trigger on table "public"."global_variables" to "anon";

grant truncate on table "public"."global_variables" to "anon";

grant update on table "public"."global_variables" to "anon";

grant delete on table "public"."global_variables" to "authenticated";

grant insert on table "public"."global_variables" to "authenticated";

grant references on table "public"."global_variables" to "authenticated";

grant select on table "public"."global_variables" to "authenticated";

grant trigger on table "public"."global_variables" to "authenticated";

grant truncate on table "public"."global_variables" to "authenticated";

grant update on table "public"."global_variables" to "authenticated";

grant delete on table "public"."global_variables" to "service_role";

grant insert on table "public"."global_variables" to "service_role";

grant references on table "public"."global_variables" to "service_role";

grant select on table "public"."global_variables" to "service_role";

grant trigger on table "public"."global_variables" to "service_role";

grant truncate on table "public"."global_variables" to "service_role";

grant update on table "public"."global_variables" to "service_role";


  create policy "Allow delete to authenticated users"
  on "public"."global_variables"
  as permissive
  for delete
  to public
using ((auth.role() IS NOT NULL));



  create policy "Allow insert to authenticated users"
  on "public"."global_variables"
  as permissive
  for insert
  to public
with check ((auth.role() IS NOT NULL));



  create policy "Allow read access to all users"
  on "public"."global_variables"
  as permissive
  for select
  to public
using (true);



  create policy "Allow update to authenticated users"
  on "public"."global_variables"
  as permissive
  for update
  to public
using ((auth.role() IS NOT NULL));




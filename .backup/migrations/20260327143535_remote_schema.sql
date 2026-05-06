drop policy "Allow delete to authenticated users" on "public"."global_variables";

drop policy "Allow insert to authenticated users" on "public"."global_variables";

drop policy "Allow read access to all users" on "public"."global_variables";

drop policy "Allow update to authenticated users" on "public"."global_variables";

revoke delete on table "public"."global_variables" from "anon";

revoke insert on table "public"."global_variables" from "anon";

revoke references on table "public"."global_variables" from "anon";

revoke select on table "public"."global_variables" from "anon";

revoke trigger on table "public"."global_variables" from "anon";

revoke truncate on table "public"."global_variables" from "anon";

revoke update on table "public"."global_variables" from "anon";

revoke delete on table "public"."global_variables" from "authenticated";

revoke insert on table "public"."global_variables" from "authenticated";

revoke references on table "public"."global_variables" from "authenticated";

revoke select on table "public"."global_variables" from "authenticated";

revoke trigger on table "public"."global_variables" from "authenticated";

revoke truncate on table "public"."global_variables" from "authenticated";

revoke update on table "public"."global_variables" from "authenticated";

revoke delete on table "public"."global_variables" from "service_role";

revoke insert on table "public"."global_variables" from "service_role";

revoke references on table "public"."global_variables" from "service_role";

revoke select on table "public"."global_variables" from "service_role";

revoke trigger on table "public"."global_variables" from "service_role";

revoke truncate on table "public"."global_variables" from "service_role";

revoke update on table "public"."global_variables" from "service_role";

alter table "public"."global_variables" drop constraint "global_variables_name_key";

alter table "public"."global_variables" drop constraint "global_variables_pkey";

drop index if exists "public"."global_variables_name_key";

drop index if exists "public"."global_variables_pkey";

drop table "public"."global_variables";

drop sequence if exists "public"."global_variables_id_seq";



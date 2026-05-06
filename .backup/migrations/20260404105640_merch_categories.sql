create table if not exists "public"."merch_categories" (
    "id" bigserial primary key,
    "name" "text" not null
);

ALTER TABLE "public"."merch_categories" OWNER TO "postgres";
ALTER TABLE "public"."merch_categories" enable row level security;

CREATE POLICY "Allow insert for authenticated" ON "public"."merch_categories" FOR INSERT TO "authenticated" WITH CHECK (true);
CREATE POLICY "Allow update for authenticated" ON "public"."merch_categories" FOR UPDATE TO "authenticated" WITH CHECK (true);
CREATE POLICY "Allow select for anon" ON "public"."merch_categories" FOR SELECT TO "authenticated", "anon" USING (true);

alter table "public"."merch_items"
    add column category bigint references "public"."merch_categories"("id") on delete cascade;
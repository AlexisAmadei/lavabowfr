alter table "public"."merch_items" drop column "out_of_stock";

alter table "public"."merch_items" add column "quantity" integer not null default 0;



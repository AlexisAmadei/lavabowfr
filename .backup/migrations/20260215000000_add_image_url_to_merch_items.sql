-- Add image_url column to merch_items table
ALTER TABLE "public"."merch_items" ADD COLUMN "image_url" text;

-- Add comment to the column
COMMENT ON COLUMN "public"."merch_items"."image_url" IS 'URL to the merch item image stored in storage bucket';

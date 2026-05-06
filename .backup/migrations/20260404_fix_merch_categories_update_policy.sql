-- Drop the incomplete UPDATE policy
DROP POLICY IF EXISTS "Allow update for authenticated" ON "public"."merch_categories";

-- Create the corrected UPDATE policy with both USING and WITH CHECK
CREATE POLICY "Allow update for authenticated" ON "public"."merch_categories"
  FOR UPDATE TO "authenticated"
  USING (true)
  WITH CHECK (true);

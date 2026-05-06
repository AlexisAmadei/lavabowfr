-- Fix the section_videos UPDATE policy to include USING clause
-- Without USING, the policy doesn't select any rows for update

DROP POLICY IF EXISTS "Allow update for authenticated" ON "public"."section_videos";

CREATE POLICY "Allow update for authenticated"
ON "public"."section_videos"
FOR UPDATE
TO "authenticated"
USING (true)
WITH CHECK (true);

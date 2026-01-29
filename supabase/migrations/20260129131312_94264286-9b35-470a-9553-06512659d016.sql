DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND full_name IS NOT NULL
  AND subject IS NOT NULL
  AND message IS NOT NULL
);

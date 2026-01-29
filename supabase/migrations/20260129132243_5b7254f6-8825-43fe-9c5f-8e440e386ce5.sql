-- 1) Allow admins to manage/read roles
DO $$ BEGIN
  CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2) Programs: add application open/close status (simple boolean)
ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS applications_open boolean NOT NULL DEFAULT true;

-- 3) Events: add banner + online link
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS banner_image_url text,
  ADD COLUMN IF NOT EXISTS online_url text;

-- 4) Applications: link to program + store answers (json)
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS program_id uuid,
  ADD COLUMN IF NOT EXISTS answers jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Foreign key to programs (optional)
DO $$ BEGIN
  ALTER TABLE public.applications
    ADD CONSTRAINT applications_program_id_fkey
    FOREIGN KEY (program_id) REFERENCES public.programs(id)
    ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5) Startups: allow admins to hide from public listing
ALTER TABLE public.startups
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT true;

-- Admins can update any startup row
DO $$ BEGIN
  CREATE POLICY "Admins can update any startup"
  ON public.startups
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Keep directory public but only show public startups via a view
CREATE OR REPLACE VIEW public.startups_public
WITH (security_invoker=on) AS
  SELECT id, name, sector, stage, description, traction, team_size, logo_url, website_url, is_featured, created_at
  FROM public.startups
  WHERE status = 'active' AND is_public = true;

-- 6) Admin user overview view (profiles + roles)
CREATE OR REPLACE VIEW public.admin_user_overview
WITH (security_invoker=on) AS
SELECT
  p.id,
  p.full_name,
  p.email,
  p.created_at,
  p.updated_at,
  COALESCE(array_agg(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), '{}'::text[]) AS roles
FROM public.profiles p
LEFT JOIN public.user_roles ur
  ON ur.user_id = p.id
GROUP BY p.id;

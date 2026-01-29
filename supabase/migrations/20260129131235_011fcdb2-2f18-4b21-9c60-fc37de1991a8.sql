-- Roles (secure, stored separately)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'startup', 'mentor', 'investor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS-safe role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = _user_id
      AND ur.role = _role
  )
$$;

-- Users can see their own roles
DO $$ BEGIN
  CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Programs
DO $$ BEGIN
  CREATE TYPE public.program_category AS ENUM ('pre-incubation', 'incubation', 'accelerator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration text,
  category public.program_category NOT NULL,
  application_url text,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Programs are viewable by everyone"
  ON public.programs
  FOR SELECT
  USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can manage programs"
  ON public.programs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hero banners
CREATE TABLE IF NOT EXISTS public.hero_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  cta_label text,
  cta_href text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Hero banners are viewable by everyone"
  ON public.hero_banners
  FOR SELECT
  USING (is_active = true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can manage hero banners"
  ON public.hero_banners
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Extend existing directories with URLs (store only URLs, files live in storage)
ALTER TABLE public.startups
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS website_url text;

ALTER TABLE public.mentors
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS bio text;

-- Update stats view (add events + programs counts)
DROP VIEW IF EXISTS public.stats;
CREATE VIEW public.stats
WITH (security_invoker=on) AS
SELECT
  (SELECT COUNT(*) FROM public.startups WHERE status = 'active')::bigint as startups_count,
  (SELECT COUNT(*) FROM public.mentors WHERE is_active = true)::bigint as mentors_count,
  (SELECT COUNT(*) FROM public.programs WHERE is_active = true)::bigint as programs_count,
  (SELECT COUNT(*) FROM public.events)::bigint as events_count;

-- Storage bucket for public assets (logos/photos/banners)
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to public-assets
DO $$ BEGIN
  CREATE POLICY "Public assets are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public-assets');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Authenticated users can upload/update/delete only under their own folder: <uid>/...
DO $$ BEGIN
  CREATE POLICY "Users can upload their own public assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'public-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own public assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own public assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'public-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- updated_at triggers (reuse existing function)
DO $$ BEGIN
  CREATE TRIGGER trg_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_hero_banners_updated_at
  BEFORE UPDATE ON public.hero_banners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

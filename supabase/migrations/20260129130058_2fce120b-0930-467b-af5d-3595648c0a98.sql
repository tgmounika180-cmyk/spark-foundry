-- Fix security issues

-- Update functions to set search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Fix stats view to use security invoker
DROP VIEW IF EXISTS public.stats;
CREATE VIEW public.stats
WITH (security_invoker=on) AS
SELECT
  (SELECT COUNT(*) FROM public.startups WHERE status = 'active') as startups_count,
  (SELECT COUNT(*) FROM public.mentors WHERE is_active = true) as mentors_count,
  (SELECT COUNT(*) FROM public.events) as programs_count;
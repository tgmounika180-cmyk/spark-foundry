-- Add disabled flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS disabled boolean NOT NULL DEFAULT false;

-- Helper: is a user disabled?
CREATE OR REPLACE FUNCTION public.is_disabled(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.disabled FROM public.profiles p WHERE p.id = _user_id), false)
$$;

-- Allow admins to update any profile (e.g., disable/enable)
DO $$ BEGIN
  CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Tighten user-scoped policies to deny when disabled
-- applications
ALTER POLICY "Users can view their own applications" ON public.applications
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can create their own applications" ON public.applications
  WITH CHECK (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can update their own applications" ON public.applications
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

-- mentors
ALTER POLICY "Users can create their mentor profile" ON public.mentors
  WITH CHECK (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can update their mentor profile" ON public.mentors
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

-- startups
ALTER POLICY "Users can create their own startup" ON public.startups
  WITH CHECK (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can update their own startup" ON public.startups
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

-- event registrations
ALTER POLICY "Users can view their own registrations" ON public.event_registrations
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can create their own registrations" ON public.event_registrations
  WITH CHECK (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

ALTER POLICY "Users can delete their own registrations" ON public.event_registrations
  USING (auth.uid() = user_id AND NOT public.is_disabled(auth.uid()));

-- profiles (self update)
ALTER POLICY "Users can update their own profile" ON public.profiles
  USING (auth.uid() = id AND NOT public.is_disabled(auth.uid()));

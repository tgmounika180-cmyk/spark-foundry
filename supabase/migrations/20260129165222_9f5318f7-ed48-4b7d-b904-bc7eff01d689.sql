-- Admin-editable overrides for homepage stats

CREATE TABLE IF NOT EXISTS public.stats_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startups_count bigint,
  mentors_count bigint,
  programs_count bigint,
  events_count bigint,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enforce singleton row (0 or 1 row allowed)
CREATE UNIQUE INDEX IF NOT EXISTS stats_overrides_singleton
  ON public.stats_overrides ((true));

ALTER TABLE public.stats_overrides ENABLE ROW LEVEL SECURITY;

-- Admin-only access
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'stats_overrides'
      AND policyname = 'Admins can view stats overrides'
  ) THEN
    CREATE POLICY "Admins can view stats overrides"
    ON public.stats_overrides
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'stats_overrides'
      AND policyname = 'Admins can insert stats overrides'
  ) THEN
    CREATE POLICY "Admins can insert stats overrides"
    ON public.stats_overrides
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'stats_overrides'
      AND policyname = 'Admins can update stats overrides'
  ) THEN
    CREATE POLICY "Admins can update stats overrides"
    ON public.stats_overrides
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'stats_overrides'
      AND policyname = 'Admins can delete stats overrides'
  ) THEN
    CREATE POLICY "Admins can delete stats overrides"
    ON public.stats_overrides
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END$$;

-- Keep updated_at current
DROP TRIGGER IF EXISTS handle_updated_at_stats_overrides ON public.stats_overrides;
CREATE TRIGGER handle_updated_at_stats_overrides
BEFORE UPDATE ON public.stats_overrides
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- View that merges real totals with overrides
CREATE OR REPLACE VIEW public.stats_effective AS
SELECT
  COALESCE(o.startups_count, s.startups_count)::bigint AS startups_count,
  COALESCE(o.mentors_count, s.mentors_count)::bigint AS mentors_count,
  COALESCE(o.programs_count, s.programs_count)::bigint AS programs_count,
  COALESCE(o.events_count, s.events_count)::bigint AS events_count
FROM public.stats s
LEFT JOIN public.stats_overrides o ON true;
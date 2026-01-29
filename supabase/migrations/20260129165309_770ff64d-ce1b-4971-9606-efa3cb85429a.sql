-- Fix linter: ensure views run with invoker privileges

CREATE OR REPLACE VIEW public.stats_effective
WITH (security_invoker = on)
AS
SELECT
  COALESCE(o.startups_count, s.startups_count)::bigint AS startups_count,
  COALESCE(o.mentors_count, s.mentors_count)::bigint AS mentors_count,
  COALESCE(o.programs_count, s.programs_count)::bigint AS programs_count,
  COALESCE(o.events_count, s.events_count)::bigint AS events_count
FROM public.stats s
LEFT JOIN public.stats_overrides o ON true;
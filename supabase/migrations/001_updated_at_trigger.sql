-- Migration 001: Auto-update updated_at trigger function
-- Phase 3 Section 3: "Use a trigger to auto-update updated_at on row modification"

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

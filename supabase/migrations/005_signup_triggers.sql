-- Migration 005: Signup triggers
-- Source: Phase 3 Section 8 — Database triggers on signup
--
-- When a new auth.users row is created:
-- 1. Create profile (role=user, onboarding_completed=false)
-- 2. Create subscription (plan=free, status=active)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, role, onboarding_completed, onboarding_step)
  VALUES (NEW.id, 'user', false, 0);

  -- Create free subscription
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

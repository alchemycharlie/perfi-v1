-- Migration 003: Row Level Security policies
-- Source: Phase 3 Section 10 — Row Level Security Strategy

-- ══════════════════════════════════════════════════
-- Enable RLS on ALL tables (defence in depth)
-- ══════════════════════════════════════════════════

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════
-- PROFILES: users read/update own profile only
-- ══════════════════════════════════════════════════

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- INSERT is handled by the signup trigger (service_role), not by the user directly.

-- ══════════════════════════════════════════════════
-- SUBSCRIPTIONS: users read own subscription only
-- Updates come from Stripe webhooks via service_role.
-- ══════════════════════════════════════════════════

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- ══════════════════════════════════════════════════
-- WORKSPACES: users can read/create/update/delete workspaces they are members of
-- ══════════════════════════════════════════════════

CREATE POLICY "Users can view own workspaces"
  ON public.workspaces FOR SELECT
  USING (
    id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update own workspaces"
  ON public.workspaces FOR UPDATE
  USING (
    id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own workspaces"
  ON public.workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- ══════════════════════════════════════════════════
-- WORKSPACE_MEMBERS: users can read own memberships, create for own workspaces
-- ══════════════════════════════════════════════════

CREATE POLICY "Users can view own memberships"
  ON public.workspace_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create memberships in own workspaces"
  ON public.workspace_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ══════════════════════════════════════════════════
-- WORKSPACE-SCOPED TABLES: standard pattern
-- Every table checks workspace_id against workspace_members
-- ══════════════════════════════════════════════════

-- Helper: reusable check expression
-- workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid())

-- ── accounts ──

CREATE POLICY "Users can view own workspace accounts"
  ON public.accounts FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace accounts"
  ON public.accounts FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace accounts"
  ON public.accounts FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace accounts"
  ON public.accounts FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── categories ──

CREATE POLICY "Users can view own workspace categories"
  ON public.categories FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace categories"
  ON public.categories FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace categories"
  ON public.categories FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace categories"
  ON public.categories FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── transactions ──

CREATE POLICY "Users can view own workspace transactions"
  ON public.transactions FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace transactions"
  ON public.transactions FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace transactions"
  ON public.transactions FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── income_sources ──

CREATE POLICY "Users can view own workspace income sources"
  ON public.income_sources FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace income sources"
  ON public.income_sources FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace income sources"
  ON public.income_sources FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace income sources"
  ON public.income_sources FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── bills ──

CREATE POLICY "Users can view own workspace bills"
  ON public.bills FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace bills"
  ON public.bills FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace bills"
  ON public.bills FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace bills"
  ON public.bills FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── budgets ──

CREATE POLICY "Users can view own workspace budgets"
  ON public.budgets FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace budgets"
  ON public.budgets FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace budgets"
  ON public.budgets FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── goals ──

CREATE POLICY "Users can view own workspace goals"
  ON public.goals FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace goals"
  ON public.goals FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace goals"
  ON public.goals FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace goals"
  ON public.goals FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── goal_contributions ──

CREATE POLICY "Users can view own workspace goal contributions"
  ON public.goal_contributions FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace goal contributions"
  ON public.goal_contributions FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace goal contributions"
  ON public.goal_contributions FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ── debts ──

CREATE POLICY "Users can view own workspace debts"
  ON public.debts FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert into own workspace debts"
  ON public.debts FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own workspace debts"
  ON public.debts FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own workspace debts"
  ON public.debts FOR DELETE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ══════════════════════════════════════════════════
-- ADMIN-ONLY TABLES: RLS enabled, NO policies
-- Only accessible via service_role (bypasses RLS)
-- ══════════════════════════════════════════════════

-- waitlist_entries: RLS enabled, no policies → anon/authenticated cannot access
-- contact_submissions: RLS enabled, no policies → anon/authenticated cannot access
-- admin_notes: RLS enabled, no policies → anon/authenticated cannot access
-- feature_flags: RLS enabled, no policies → anon/authenticated cannot access

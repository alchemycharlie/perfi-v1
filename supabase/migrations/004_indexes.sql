-- Migration 004: Performance indexes
-- Source: Phase 3 Section 10 — Performance considerations

-- ── workspace_members: critical for RLS subquery performance ──
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);
-- The UNIQUE (workspace_id, user_id) constraint already creates an index

-- ── transactions: primary listing, budget calculations, account views ──
CREATE INDEX idx_transactions_workspace_date ON public.transactions(workspace_id, date DESC);
CREATE INDEX idx_transactions_workspace_category_date ON public.transactions(workspace_id, category_id, date);
CREATE INDEX idx_transactions_workspace_account_date ON public.transactions(workspace_id, account_id, date);

-- ── accounts: workspace listing ──
CREATE INDEX idx_accounts_workspace ON public.accounts(workspace_id);

-- ── categories: workspace listing ──
CREATE INDEX idx_categories_workspace ON public.categories(workspace_id);

-- ── bills: workspace listing, due date ordering ──
CREATE INDEX idx_bills_workspace_due ON public.bills(workspace_id, next_due_date);

-- ── income_sources: workspace listing ──
CREATE INDEX idx_income_sources_workspace ON public.income_sources(workspace_id);

-- ── budgets: workspace listing ──
CREATE INDEX idx_budgets_workspace ON public.budgets(workspace_id);

-- ── goals: workspace listing ──
CREATE INDEX idx_goals_workspace ON public.goals(workspace_id);

-- ── goal_contributions: goal listing ──
CREATE INDEX idx_goal_contributions_goal ON public.goal_contributions(goal_id, date DESC);
CREATE INDEX idx_goal_contributions_workspace ON public.goal_contributions(workspace_id);

-- ── debts: workspace listing ──
CREATE INDEX idx_debts_workspace ON public.debts(workspace_id);

-- ── subscriptions: user lookup ──
-- Already has UNIQUE on user_id

-- ── waitlist_entries: status filtering ──
CREATE INDEX idx_waitlist_status ON public.waitlist_entries(status);

-- ── admin_notes: user lookup ──
CREATE INDEX idx_admin_notes_user ON public.admin_notes(user_id);

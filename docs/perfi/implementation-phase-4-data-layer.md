# PerFi — Implementation Phase 4: Database Migrations, Supabase Plumbing, RLS, and Core Data Layer

## Objective

Implement the approved database structure, Row Level Security, triggers, and TypeScript types for type-safe data access.

---

## Migrations Created

All migrations live in `supabase/migrations/` and are ordered for sequential execution.

### 001_updated_at_trigger.sql

Shared trigger function `handle_updated_at()` that auto-sets `updated_at = now()` on any row update. Applied to every table with an `updated_at` column.

### 002_create_tables.sql

Creates all 17 application tables per Phase 3 Section 5:

**Global tables (not workspace-scoped):**

1. `profiles` — 1:1 with auth.users. Display name, role, onboarding state, preferences, is_disabled.
2. `subscriptions` — 1:1 with profiles. Stripe mirror: plan, status, billing dates.
3. `waitlist_entries` — Email, interests array, status. Unique email.
4. `contact_submissions` — Name, email, message, status, admin notes.
5. `admin_notes` — User-linked notes from admins.
6. `feature_flags` — Key-value toggles for maintenance mode, feature gates.

**Workspace infrastructure:** 7. `workspaces` — Name, type (personal/personal_household), owner, is_demo flag. 8. `workspace_members` — User-workspace join with role. Unique (workspace_id, user_id).

**Workspace-scoped tables (all have workspace_id + RLS):** 9. `accounts` — Name, type (current/savings/credit_card/cash/investments), balance, is_active, sort_order. 10. `categories` — Name, type (expense/income/transfer), icon, colour, is_default, sort_order. 11. `transactions` — Amount, description, date, type, account, category, bill link. workspace_id denormalised for RLS performance. 12. `income_sources` — Name, type (employment/benefit/other), benefit_type (8 named UK benefit types), amount, frequency, next_pay_date. 13. `bills` — Name, amount, frequency (incl. annually), payment_method, next_due_date, is_subscription. 14. `budgets` — Category budget with monthly period. Unique (workspace_id, category_id, period). 15. `goals` — Savings or financial goals with target/current amounts, status, optional debt/category links. 16. `goal_contributions` — Amount, date, notes. workspace_id denormalised for RLS. 17. `debts` — Name, balance, minimum_payment, interest_rate, next_payment_date.

**Schema conventions:**

- UUIDs everywhere (`gen_random_uuid()`)
- Hard deletes with CASCADE
- `created_at timestamptz DEFAULT now()` on every table
- `updated_at` trigger on tables that support updates
- CHECK constraints on all enum-like text columns

### 003_rls_policies.sql

RLS enabled on all 17 tables. Policies per Phase 3 Section 10:

- **profiles**: SELECT/UPDATE where `id = auth.uid()`
- **subscriptions**: SELECT where `user_id = auth.uid()`
- **workspaces**: SELECT/INSERT/UPDATE/DELETE via workspace_members membership check
- **workspace_members**: SELECT/INSERT where `user_id = auth.uid()`
- **All 9 workspace-scoped tables**: Standard 4-policy pattern (SELECT, INSERT, UPDATE, DELETE) checking `workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())`
- **Admin-only tables** (waitlist_entries, contact_submissions, admin_notes, feature_flags): RLS enabled with NO policies — only service_role can access.

### 004_indexes.sql

Performance indexes per Phase 3 Section 10:

- `workspace_members(user_id)` — critical for RLS subquery
- `transactions(workspace_id, date DESC)` — primary listing
- `transactions(workspace_id, category_id, date)` — budget calculations
- `transactions(workspace_id, account_id, date)` — account views
- Workspace-scoped indexes on all data tables
- `goal_contributions(goal_id, date DESC)` — contribution history
- `waitlist_entries(status)` — admin filtering
- `admin_notes(user_id)` — admin lookup

### 005_signup_triggers.sql

Trigger `on_auth_user_created` fires AFTER INSERT on `auth.users`:

1. Creates `profiles` row (role=user, onboarding_completed=false)
2. Creates `subscriptions` row (plan=free, status=active)

Uses `SECURITY DEFINER` to bypass RLS during trigger execution.

### 006_transaction_balance_trigger.sql

Trigger `on_transaction_change` fires AFTER INSERT/UPDATE/DELETE on `transactions`:

- INSERT: adds amount to account balance (income positive, expense/transfer negative)
- UPDATE: reverses old amount, applies new. Handles account changes.
- DELETE: reverses the amount

Uses `SECURITY DEFINER` for direct account balance updates.

---

## TypeScript Types

**File**: `lib/types/database.ts`

Complete TypeScript interfaces for all 17 tables plus enum-like type unions for:

- UserRole, WorkspaceType, WorkspaceRole
- AccountType, CategoryType, TransactionType
- IncomeSourceType, BenefitType (8 named UK types)
- Frequency, BillFrequency, PaymentMethod
- PlanType, SubscriptionStatus
- GoalType, GoalStatus
- WaitlistStatus, ContactStatus

---

## Migration Workflow

To apply migrations to a Supabase project:

```bash
# Option 1: Via Supabase CLI
supabase db push

# Option 2: Manual execution in Supabase SQL Editor
# Run each migration file in order (001 → 006)

# Option 3: Via Supabase CLI with local development
supabase start        # Start local Supabase
supabase db reset     # Apply all migrations from scratch
```

---

## What This Phase Did NOT Do

- No demo data seeding (SQL exists as placeholder in `supabase/seed.sql`)
- No Supabase type generation workflow (`supabase gen types typescript`)
- No full onboarding UI or workspace creation logic
- No Stripe webhook handler implementation
- No admin panel functionality

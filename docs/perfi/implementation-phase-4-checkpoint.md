# PerFi — Implementation Phase 4 Checkpoint

## Phase: Database Migrations, Supabase Plumbing, RLS, and Core Data Layer

## Status: Complete

## Date: 2026-03-30

---

## Checklist

### 1. Database tables (17 total)

- [x] profiles (global, 1:1 with auth.users)
- [x] subscriptions (global, 1:1 with profiles)
- [x] waitlist_entries (global, admin-only)
- [x] contact_submissions (global, admin-only)
- [x] admin_notes (global, admin-only)
- [x] feature_flags (global, admin-only)
- [x] workspaces (workspace infrastructure)
- [x] workspace_members (workspace infrastructure, unique constraint)
- [x] accounts (workspace-scoped)
- [x] categories (workspace-scoped)
- [x] transactions (workspace-scoped, denormalised workspace_id)
- [x] income_sources (workspace-scoped, 8 benefit types)
- [x] bills (workspace-scoped, includes annually frequency)
- [x] budgets (workspace-scoped, unique per category+period)
- [x] goals (workspace-scoped, savings + financial types)
- [x] goal_contributions (workspace-scoped, denormalised workspace_id)
- [x] debts (workspace-scoped)

### 2. Schema conventions

- [x] UUIDs for all primary keys
- [x] created_at timestamptz DEFAULT now() on every table
- [x] updated_at with auto-trigger on tables that support updates
- [x] Hard deletes with ON DELETE CASCADE
- [x] CHECK constraints on all enum-like text columns
- [x] Foreign key references with appropriate ON DELETE behaviour

### 3. Row Level Security

- [x] RLS enabled on all 17 tables
- [x] profiles: SELECT/UPDATE own only (id = auth.uid())
- [x] subscriptions: SELECT own only (user_id = auth.uid())
- [x] workspaces: CRUD via membership check
- [x] workspace_members: SELECT/INSERT own only
- [x] All 9 workspace-scoped tables: standard 4-policy pattern
- [x] Admin-only tables: RLS enabled, no policies (service_role only)

### 4. Triggers

- [x] handle_updated_at() — auto-update updated_at on row modification
- [x] handle_new_user() — create profile + subscription on auth.users INSERT
- [x] handle_transaction_balance() — adjust account balance on transaction CUD

### 5. Performance indexes

- [x] workspace_members(user_id) — critical for RLS
- [x] transactions: 3 compound indexes (date, category+date, account+date)
- [x] Workspace-scoped indexes on all data tables
- [x] goal_contributions(goal_id, date DESC)
- [x] waitlist_entries(status), admin_notes(user_id)

### 6. TypeScript types

- [x] Complete interfaces for all 17 tables
- [x] Enum-like type unions for all constrained fields
- [x] 8 named UK benefit types

### 7. Supabase client plumbing

- [x] Browser client (lib/supabase/client.ts) — from Phase 1
- [x] Server client (lib/supabase/server.ts) — from Phase 1
- [x] Middleware client (lib/supabase/middleware.ts) — from Phase 3
- [x] Admin client (lib/supabase/admin.ts) — from Phase 1

---

## Migrations Summary

| File                                | Purpose                 | Tables/Objects                                                                                                                                                                                                                  |
| ----------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 001_updated_at_trigger.sql          | Shared trigger function | handle_updated_at()                                                                                                                                                                                                             |
| 002_create_tables.sql               | All 17 tables           | profiles, subscriptions, waitlist_entries, contact_submissions, admin_notes, feature_flags, workspaces, workspace_members, accounts, categories, transactions, income_sources, bills, budgets, goals, goal_contributions, debts |
| 003_rls_policies.sql                | RLS on all tables       | 17 tables enabled, 44 policies created                                                                                                                                                                                          |
| 004_indexes.sql                     | Performance indexes     | 15 indexes                                                                                                                                                                                                                      |
| 005_signup_triggers.sql             | Signup automation       | handle_new_user() trigger                                                                                                                                                                                                       |
| 006_transaction_balance_trigger.sql | Balance automation      | handle_transaction_balance() trigger                                                                                                                                                                                            |

---

## Build Verification

| Check              | Result                                            |
| ------------------ | ------------------------------------------------- |
| `npx tsc --noEmit` | Pass (0 errors)                                   |
| `npx eslint .`     | Pass (0 errors, 3 warnings on placeholder params) |
| `npx next build`   | Pass (38 routes)                                  |

---

## Known Caveats

1. **Migrations not yet applied**: The SQL files are ready but need a Supabase project to run against. Apply via `supabase db push` or paste into the SQL Editor.

2. **Types are manual**: The TypeScript types in `lib/types/database.ts` are hand-written to match the schema. In production, use `supabase gen types typescript` to auto-generate from the live schema.

3. **No demo data seed**: `supabase/seed.sql` remains a placeholder. Demo data seeding will be implemented when the onboarding flow is built.

4. **WorkspaceProvider lint fix**: Fixed the workspace context to use lazy useState initialisation instead of useEffect + setState (React lint rule).

---

## Ready for Phase 5

Phase 5 should cover:

- Onboarding flow (5 steps: display name, workspace type, income, benefits, start mode)
- Workspace creation with default category seeding
- Backend wiring for contact and waitlist API routes
- Core CRUD Server Actions for accounts, transactions, categories
- Dashboard data fetching

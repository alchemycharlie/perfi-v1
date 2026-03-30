# PerFi — Phase 3 Checkpoint

## Status: Complete

## What was produced

- `docs/perfi/phase-3-data-schema-security.md` — full Phase 3 technical planning (14 sections)
- `docs/perfi/phase-3-checkpoint.md` — this file
- `docs/perfi/working-notes.md` — updated progress log

## Sections completed

1. Tenancy model — shared infra, workspace-scoped, strict RLS
2. Workspace-based access model — membership-based, future-proofed for sharing
3. Supabase-oriented data model — schema organisation, ID/timestamp/delete strategy
4. Core entities and relationships — full entity diagram
5. Recommended schema outline — 17 named tables with fields, types, and notes
6. Roles and permissions — application roles (user/admin) + workspace roles (owner/member/viewer)
7. Admin access model — service_role for admin ops, no direct financial data access
8. Auth approach — Supabase Auth, email+password, magic link, httpOnly cookies, DB triggers on signup
9. Protected route model — middleware strategy for /app/*, /admin/*, /api/*
10. Row Level Security strategy — standard policy pattern for all workspace-scoped tables
11. Privacy and security essentials — data isolation, GDPR, input validation, session security
12. Auditability and future shared workspace support — no audit in v1, schema ready for sharing
13. Benefits as income type — same table as employment, nullable benefit_type column, named UK types
14. Stripe subscription model — webhook events, entitlement checks, downgrade handling

## Key decisions made

- **Workspace-scoped tenancy**, not user-scoped — future-proofs for shared household workspaces
- **17 tables total** — manageable for solo founder
- **Hard deletes, no soft deletes** — simpler, cleaner GDPR compliance
- **UUIDs everywhere** — prevents enumeration, Supabase-native
- **workspace_id denormalised** onto transactions and goal_contributions for RLS performance
- **Benefits in same table as employment income** — nullable `benefit_type` column, no structural separation
- **Budget "spent" calculated at query time** — no sync issues, no additional writes
- **RLS enabled on all tables** — workspace-scoped tables use membership check; admin-only tables have RLS enabled with no policies (defence in depth)
- **Admin uses service_role** — admin cannot modify user financial data, only manage users/waitlist/subscriptions
- **Stripe webhooks are the source of truth** for subscription state — no client-side subscription updates
- **Downgrade is graceful** — existing data preserved, Pro features become inaccessible but nothing is deleted
- **No OAuth in v1** — email+password and magic link only
- **No audit logging in v1** — schema supports it later without migration

## Phase 1/2 open questions resolved

- **Admin panel scope (from Phase 1)**: Fully specified — service_role access, specific actions, what admins cannot do
- **Onboarding demo data (from Phase 2)**: Workspace `is_demo` flag enables demo data management
- **CSV export free vs pro (from Phase 2)**: Confirmed — Free = transactions only, Pro = all data
- **Account deletion (new)**: Cascade delete from profile through all workspace data, plus Supabase Auth user deletion

## Contradictions and risks found

- **`profiles.is_disabled` field**: Referenced in admin access model and route protection but not in the schema outline table. **Resolved**: Added `is_disabled boolean DEFAULT false` to profiles table.
- **Tour completion tracking**: Phase 2 specifies in-app walkthrough "shows once per user". No dedicated field existed. **Resolved**: Documented `has_seen_tour` as a key in `profiles.preferences` jsonb field.
- **Workspace creation during onboarding**: Auth triggers create profile and subscription, but workspace creation happens during onboarding. If a user signs up but never completes onboarding, they have a profile but no workspace. The middleware redirect to `/app/onboarding` handles this, but the app must gracefully handle users with zero workspaces.
- **Budget period**: Schema has a `period` column set to `monthly` in v1, but there's no month-specific scoping. Budget spent calculations need to filter transactions by the current calendar month. This is application logic, not a schema issue, but should be documented in Phase 5.
- **Transaction balance updates**: When a transaction is added/edited/deleted, `accounts.balance` must be updated. This could be a DB trigger or application logic. Recommend a DB trigger for consistency — document in Phase 5 implementation.
- **Recurring date calculation**: `income_sources.next_pay_date` and `bills.next_due_date` store a single date. Generating future occurrences for the cashflow calendar (e.g. next 6 months of pay dates from frequency + anchor date) is application logic. Should be documented as a utility function in Phase 5.
- **MRR calculation for admin**: Admin dashboard needs MRR. No dedicated field — calculated at query time from active Pro subscriptions × £4.99. Acceptable for v1 scale.

## Readiness for Phase 4

Phase 3 provides the complete data foundation for Phase 4 (Frontend, UX, Admin). All tables, relationships, auth flows, RLS policies, and access patterns are defined. No blockers.

Phase 4 should cover:
- Component architecture and design system
- Page-by-page UI specifications
- Admin panel UI design
- Responsive/mobile approach
- Accessibility implementation specifics
- State management and data fetching patterns
- Error states and loading patterns

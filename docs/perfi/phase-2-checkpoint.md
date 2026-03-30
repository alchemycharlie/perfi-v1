# PerFi — Phase 2 Checkpoint

## Status: Complete

## What was produced

- `docs/perfi/phase-2-ia-flows-pricing.md` — full Phase 2 planning document (10 sections)
- `docs/perfi/phase-2-checkpoint.md` — this file
- `docs/perfi/working-notes.md` — updated progress log

## Sections completed

1. Information architecture — public marketing site (7 pages, nav structure)
2. Information architecture — authenticated app (15 pages, sidebar nav, design principles)
3. Information architecture — internal admin area (7 pages, MVP scope defined)
4. Proposed route structure — full Next.js App Router tree with 4 layout groups
5. User flows — 11 flows covering visitor-to-signup, onboarding, core usage, upgrade, and admin
6. Pricing and feature gating — Free vs Pro tier table, gating philosophy, upgrade triggers
7. Workspace model — Personal and Personal + Household in v1, expansion path
8. Onboarding strategy — 5-step flow, skip behaviour, re-onboarding
9. Demo environment and walkthrough — demo data spec, UX rules, marketing preview concept
10. Landing page conversion strategy and FAQ/waitlist positioning

## Key decisions made

- **Admin MVP scoped**: Users, Waitlist (with bulk invite), Subscriptions (view only, Stripe for billing), Support notes, Feature flags, Dashboard metrics
- **Free tier limits**: 3 accounts, 5 budget categories, 2 savings goals, 1 workspace, basic analytics, basic CSV export
- **Pro tier unlocks**: Unlimited accounts/budgets/goals, up to 5 workspaces, advanced analytics, cashflow forecasting, net worth tracking, CSV import, full CSV export
- **Onboarding**: 5 steps, all skippable except start-mode choice (demo vs blank)
- **Demo data**: 3 accounts, 2 income sources, ~30 transactions, 5 bills, 4 budgets, 1 goal — all UK-realistic
- **Route structure**: Next.js App Router with `(marketing)`, `(auth)`, `app/`, `admin/` groups
- **Workspace model**: Designed for future expansion (Side Business, shared) without restructuring
- **Monthly billing only in v1** — no annual plan yet
- **Soft upgrade gates** — friendly messages, not blocking modals

## Phase 1 open questions resolved

- **Admin panel scope**: Now concretely defined (see section 3)
- **Onboarding demo data content**: Now specified (see section 9)

## Contradictions and risks found

- **Debt tracking missing from sidebar nav**: Phase 1 lists debt tracking as in-scope, but it could be absorbed into Accounts (credit cards show debt) or kept as its own section. **Resolution**: Kept as its own page `/app/debt` in the route structure — it has distinct value for users managing multiple debts.
- **CSV export "basic" vs "full"**: The free/pro split needs definition. **Recommendation**: Free exports transactions only; Pro exports all data (accounts, budgets, goals, bills).
- **"Features" in marketing nav**: The header includes "Features" but there is no dedicated `/features` page in the page inventory. **Resolution**: "Features" scrolls to the feature highlights section on the home page (anchor link), or can become a dedicated page later if needed.
- **Subscription tracking vs Bills**: These overlap. **Resolution**: Bills & Subscriptions is a single page at `/app/bills`. Subscriptions are just recurring bills marked as subscriptions.

## Readiness for Phase 3

Phase 2 provides the structural foundation for Phase 3 (Data Schema and Security). All routes, pages, features, and entitlements are defined. No blockers.

Phase 3 should cover:
- Database schema design
- Data models for all entities (users, workspaces, accounts, transactions, budgets, bills, goals, income, subscriptions)
- Authentication and authorisation model
- Data security and privacy approach
- API route design
- Entitlement/feature-flag implementation approach

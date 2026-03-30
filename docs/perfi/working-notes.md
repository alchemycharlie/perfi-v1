# PerFi — Working Notes

## Progress Log

| Date       | Phase | Section                              | Status   |
|------------|-------|--------------------------------------|----------|
| 2026-03-30 | 1     | Working notes initialised            | Done     |
| 2026-03-30 | 1     | Product definition document written  | Done     |
| 2026-03-30 | 1     | Checkpoint summary written           | Done     |
| 2026-03-30 | 1     | Phase 1 committed                    | Done     |
| 2026-03-30 | 2     | IA — marketing, app, admin           | Done     |
| 2026-03-30 | 2     | Route structure (Next.js App Router) | Done     |
| 2026-03-30 | 2     | User flows (13 flows)                | Done     |
| 2026-03-30 | 2     | Pricing and feature gating           | Done     |
| 2026-03-30 | 2     | Workspace model                      | Done     |
| 2026-03-30 | 2     | Onboarding strategy                  | Done     |
| 2026-03-30 | 2     | Demo environment and walkthrough     | Done     |
| 2026-03-30 | 2     | Landing page and FAQ/waitlist        | Done     |
| 2026-03-30 | 2     | Checkpoint summary written           | Done     |
| 2026-03-30 | 2     | Phase 2 committed                    | Done     |
| 2026-03-30 | 3     | Tenancy model                        | Done     |
| 2026-03-30 | 3     | Workspace access model               | Done     |
| 2026-03-30 | 3     | Supabase data model                  | Done     |
| 2026-03-30 | 3     | Core entities and relationships      | Done     |
| 2026-03-30 | 3     | Schema outline (17 tables)           | Done     |
| 2026-03-30 | 3     | Roles and permissions                | Done     |
| 2026-03-30 | 3     | Admin access model                   | Done     |
| 2026-03-30 | 3     | Auth approach                        | Done     |
| 2026-03-30 | 3     | Protected route model                | Done     |
| 2026-03-30 | 3     | Row Level Security strategy          | Done     |
| 2026-03-30 | 3     | Privacy and security essentials      | Done     |
| 2026-03-30 | 3     | Auditability and shared workspaces   | Done     |
| 2026-03-30 | 3     | Benefits as income type              | Done     |
| 2026-03-30 | 3     | Stripe subscription model            | Done     |
| 2026-03-30 | 3     | Checkpoint summary written           | Done     |
| 2026-03-30 | 3     | Phase 3 committed                    | Done     |

## Open questions for future phases

- "Features" marketing nav link: currently an anchor scroll. May become a dedicated page post-v1.
- Dark mode: design system should support it from the start even if not shipped in v1.
- Notifications: high value for bill/pay date reminders — revisit for v1.1.
- Annual billing plan: deferred from v1. Consider for v1.1 or v2.
- Transaction balance updates: recommend DB trigger on transactions to update accounts.balance. Document in Phase 5.
- Budget spent calculation: application logic filtering transactions by calendar month. Document approach in Phase 5.
- Users with zero workspaces: middleware redirects to onboarding, but app must handle gracefully.
- Recurring date calculation: next_pay_date and next_due_date are single dates. App logic needed to project future occurrences for cashflow calendar. Document as utility in Phase 5.
- MRR for admin dashboard: calculated at query time from active Pro subscriptions. No schema field needed at v1 scale.

## Resolved questions

- Admin panel MVP scope: defined in Phase 2 section 3.
- Onboarding demo data content: specified in Phase 2 section 9.
- Debt tracking placement: standalone page at `/app/debt`.
- Bills vs Subscriptions: merged into single page `/app/bills`.
- CSV export free vs pro: confirmed in Phase 3 — Free = transactions only, Pro = all data.
- Tenancy model: workspace-scoped, not user-scoped.
- Benefits schema: same table as employment, nullable benefit_type column.
- Admin access: service_role, cannot modify user financial data.
- Account deletion: cascade delete through all workspace data + Supabase Auth deletion.
- Soft delete: no soft deletes in v1 — hard delete with cascades.
- profiles.is_disabled: added to schema, checked in middleware.
- Tour tracking: profiles.preferences jsonb includes has_seen_tour key.

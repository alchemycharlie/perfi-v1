# PerFi — Implementation Phase 5 Checkpoint

## Phase: Onboarding, Demo Workspace, and First Run Experience

## Status: Complete

## Date: 2026-03-30

---

## Checklist

### 1. Progressive onboarding flow

- [x] 5-step flow: display name, workspace type, income, benefits, start mode
- [x] Step progress indicator (5 dots)
- [x] Back navigation (steps 2-4)
- [x] Each step updates `profiles.onboarding_step` via Server Action
- [x] Step 5 sets `onboarding_completed = true` and redirects to dashboard

### 2. Ability to skip

- [x] Skip button on optional steps (3 and 4)
- [x] "Skip setup entirely" creates default workspace and completes onboarding
- [x] Skipped state results in blank workspace with default categories

### 3. Workspace creation

- [x] Workspace created at step 2 with correct type (personal / personal_household)
- [x] workspace_members entry created with owner role
- [x] Default categories seeded based on workspace type
- [x] Personal: 12 categories (9 expense, 2 income, 1 transfer)
- [x] Personal + Household: 17 categories (14 expense, 2 income, 1 transfer)

### 4. Demo data workspace

- [x] Demo seeding: 3 accounts, 2 income sources, 5 bills, 4 budgets, 1 debt, 2 goals, ~30 transactions
- [x] All demo data is UK-centric (GBP amounts, UK retailers, UK benefits)
- [x] workspace.is_demo flag set to true
- [x] Clear demo data action (deletes in dependency order, resets is_demo)

### 5. Income and benefits setup

- [x] Step 3: optional income (amount, frequency, next pay date)
- [x] Step 4: 8 named UK benefit types as checkboxes
- [x] Both create income_sources entries with correct types

### 6. First run guidance

- [x] GuidedTour: 4-step tooltip walkthrough (dashboard, quick-add, sidebar, cashflow)
- [x] Shows once for demo workspace users (controlled by preferences.has_seen_tour)
- [x] Dismissible at any point ("Skip tour")
- [x] Step dots for progress

### 7. Empty states

- [x] EmptyState component (title, description, optional CTA)
- [x] Dashboard blank state: "No accounts yet" with add account CTA
- [x] Quick start guide for new users
- [x] Categories info card

### 8. Demo banner

- [x] DemoBanner: persistent banner for demo workspaces
- [x] "Clear demo data" button with loading state
- [x] Clears all workspace data and removes is_demo flag

### 9. Dashboard states

- [x] Demo workspace: banner + tour + real data display
- [x] Blank workspace: empty states with CTAs
- [x] Active workspace: stat cards, account balances, recent transactions, upcoming bills

### 10. Routing and state handling

- [x] Middleware redirects to /app/onboarding if !onboarding_completed
- [x] Step 5 redirects to /app/dashboard after completion
- [x] Skip onboarding redirects to /app/dashboard
- [x] Workspace context set on dashboard mount

---

## Build Verification

| Check              | Result                                            |
| ------------------ | ------------------------------------------------- |
| `npx tsc --noEmit` | Pass (0 errors)                                   |
| `npx eslint .`     | Pass (0 errors, 3 warnings on placeholder params) |
| `npx next build`   | Pass (38 routes)                                  |

---

## Known Caveats

1. **Requires database**: The onboarding flow writes to `profiles`, `workspaces`, `workspace_members`, `categories`, `accounts`, `transactions`, `bills`, `budgets`, `goals`, `debts`, and `income_sources`. All migrations must be applied first.

2. **Guided tour is position-independent**: The tour shows contextual tooltips in a centred modal rather than pointing at specific UI elements. This is simpler and works across all viewport sizes. A pointer-based tour could be added later.

3. **No step resume from database**: The onboarding page currently starts at step 1 client-side. To resume mid-flow, the page would need to read `profiles.onboarding_step` on mount. This can be added when the database is connected.

4. **Demo transactions use static dates**: Transaction dates are calculated relative to "today" when demo data is seeded, so they'll always look recent.

---

## Ready for Phase 6

Phase 6 should cover:

- Core CRUD Server Actions (accounts, transactions, categories)
- Accounts page with card grid and detail view
- Transactions page with list, filters, search
- Quick-add transaction slide-out panel
- Category management in Settings
- Backend wiring for contact and waitlist API routes

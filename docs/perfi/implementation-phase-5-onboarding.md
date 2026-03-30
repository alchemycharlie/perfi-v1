# PerFi — Implementation Phase 5: Onboarding, Demo Workspace, and First Run Experience

## Objective

Implement the first-run experience so new users can enter the product and reach a meaningful starting state.

---

## What was built

### 1. Onboarding Server Actions (`lib/actions/onboarding.ts`)

| Action                             | Purpose                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| `updateOnboardingStep(step, data)` | Dispatcher for all 5 onboarding steps. Updates profiles.onboarding_step on each step. |
| `skipOnboarding()`                 | Creates default workspace + categories, marks onboarding complete.                    |
| `clearDemoData(workspaceId)`       | Deletes all demo data in dependency order, marks workspace as non-demo.               |

Internal handlers per step:

| Step | Handler               | What it does                                                                              |
| ---- | --------------------- | ----------------------------------------------------------------------------------------- |
| 1    | `handleDisplayName`   | Sets profiles.display_name                                                                |
| 2    | `handleWorkspaceType` | Creates workspace + workspace_member + seeds default categories                           |
| 3    | `handleIncome`        | Optionally creates income_source (employment type)                                        |
| 4    | `handleBenefits`      | Optionally creates income_sources for selected UK benefit types                           |
| 5    | `handleStartMode`     | Seeds demo data OR leaves blank, sets onboarding_completed = true, redirects to dashboard |

### 2. Default category seeding (`seedDefaultCategories`)

Per Phase 5 Section 11.4:

**Personal workspace (12 categories):**

- Expense: Groceries, Transport, Eating Out, Entertainment, Shopping, Health, Utilities, Rent/Mortgage, Other
- Income: Salary, Other Income
- Transfer: Transfer

**Personal + Household (17 categories):**

- All Personal categories plus: Childcare, School, Groceries — Household, Home Maintenance, Family Activities

All seeded with `is_default = true`.

### 3. Demo data seeding (`seedDemoData`)

Per Phase 2 Section 9 — full UK-centric demo data:

| Entity         | Count | Details                                                                                                             |
| -------------- | ----- | ------------------------------------------------------------------------------------------------------------------- |
| Accounts       | 3     | Barclays Current (£1,847.32), Nationwide Savings (£3,200), Tesco Credit Card (-£412.67)                             |
| Income sources | 2     | Employment £2,400/month, Child Benefit £96/four-weekly                                                              |
| Bills          | 5     | Rent £950, Council Tax £145, Energy £85, Broadband £32, Netflix £10.99                                              |
| Budgets        | 4     | Groceries £300, Eating Out £80, Transport £100, Entertainment £50                                                   |
| Debt           | 1     | Tesco Credit Card £412.67, min payment £25, 19.9% APR                                                               |
| Goals          | 2     | Holiday Fund (savings, £620/£1,500), Pay off credit card (financial, linked to debt)                                |
| Transactions   | ~30   | Spread across 2 months: groceries, transport, eating out, entertainment, bills, health, shopping, income, transfers |

### 4. Onboarding UI (`app/app/onboarding/page.tsx`)

5-step progressive flow with:

| Step | Screen         | Fields                                 | Skip behaviour       |
| ---- | -------------- | -------------------------------------- | -------------------- |
| 1    | Display name   | Text input                             | Defaults to "User"   |
| 2    | Workspace type | Radio: Personal / Personal + Household | Defaults to Personal |
| 3    | Income         | Amount, frequency, next pay date       | Skippable            |
| 4    | Benefits       | 8 UK benefit type checkboxes           | Skippable            |
| 5    | Start mode     | Demo data / Blank workspace buttons    | Must choose one      |

Features:

- Step progress bar (5 dots)
- Back navigation (steps 2-4)
- Skip button on steps 3-4
- "Skip setup entirely" link creates default workspace and goes to dashboard
- Error handling with inline messages
- Loading states on all actions

### 5. Dashboard with first-run states (`app/app/dashboard/page.tsx` + `components/app/dashboard-content.tsx`)

**Demo workspace state:**

- DemoBanner at top with "Clear demo data" action
- Guided tour overlay on first visit
- Account balance cards, recent transactions, upcoming bills

**Blank workspace state:**

- EmptyState component: "No accounts yet" with CTA to add account
- Quick start guide (4 steps)
- Categories info card

**Active workspace state (post-first-run):**

- Total balance, accounts count, upcoming bills stat cards
- Account balance cards
- Recent transactions list with category badges

### 6. Supporting components

| Component        | File                                   | Purpose                                                              |
| ---------------- | -------------------------------------- | -------------------------------------------------------------------- |
| DemoBanner       | `components/app/demo-banner.tsx`       | Persistent banner with "Clear demo data" button                      |
| EmptyState       | `components/shared/empty-state.tsx`    | Reusable empty state with title, description, optional CTA           |
| GuidedTour       | `components/app/guided-tour.tsx`       | 4-step tooltip walkthrough (dashboard, quick-add, sidebar, cashflow) |
| DashboardContent | `components/app/dashboard-content.tsx` | Client component handling demo/blank/active states                   |

---

## Onboarding state management

Per Phase 5 Section 11.6:

- `profiles.onboarding_step` tracks which step the user is on (0-5)
- Each step completion updates `onboarding_step` via Server Action
- Step 5 completion sets `onboarding_completed = true`
- Middleware redirects to `/app/onboarding` if `onboarding_completed = false`
- If user closes browser mid-flow, they resume at the correct step

---

## What this phase did NOT do

- No full finance CRUD modules (accounts page, transactions page, etc.)
- No cashflow calendar implementation
- No settings page implementation
- No Stripe billing
- No re-onboarding / setup assistant (deferred to v1.1 per Phase 5 Section 11.5)

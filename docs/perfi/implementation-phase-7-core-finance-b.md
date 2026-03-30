# PerFi — Implementation Phase 7: Budgets, Goals, Debts, Cashflow Calendar, and Settings

## Objective

Implement the second major set of finance planning features to deepen core product usefulness.

---

## What was built

### 1. Budgets module (`app/app/budgets/page.tsx`)

- Monthly budgets with progress bars per category
- Spent calculation: SUM(expense transactions) for current month per category
- Progress bar colours: teal (≤80%), amber (80-100%), muted red (>100%)
- Over-budget message with amount
- Add budget form: category selector (excludes already-budgeted), monthly limit
- Edit budget: inline amount adjustment
- Delete budget
- Total budgeted vs total spent summary card
- Empty state: "No budgets set"

### 2. Goals module (`app/app/goals/page.tsx` + `app/app/goals/[id]/page.tsx`)

- Goals list: card grid with progress bars and type badges (Savings / Financial)
- Savings goals: target amount with progress tracking
- Financial goals: link to debt or budget category
- Goal detail page: full progress display, contribution history
- Add contribution: amount, date, notes (updates goal.current_amount)
- Goal status management: Mark as completed, Abandon goal, Delete
- Completed goals section (collapsed by default)
- 100% completion celebration message
- Empty state: "No goals yet"

### 3. Debt tracking (`app/app/debt/page.tsx`)

- Debt cards with balance, minimum payment, interest rate (APR), next payment date
- Linked account display
- Linked goal display (cross-reference from goals table)
- Total outstanding debt summary
- Edit form: all debt fields inline
- Delete with confirmation
- Empty state: "No debts tracked"

### 4. Cashflow calendar (`app/app/cashflow/page.tsx`)

- Custom 7-column CSS grid (Mon-Sun) per Phase 4 spec
- Income events (teal dots) from income_sources projected via getOccurrencesInRange
- Bill events (amber dots) from bills projected via getOccurrencesInRange
- Click day → inline detail panel with event list and projected balance
- Running balance calculation from current total balance
- Today highlighting
- Colour legend
- Empty state: "Not enough data yet"

### 5. Settings page (`app/app/settings/page.tsx`)

- Profile section: display name (editable), email (read-only)
- Workspace section: name and type display
- Help section: replay guided tour link
- Danger zone: delete account with "type DELETE" confirmation

### 6. Recurring dates utility (`lib/utils/dates.ts`)

- `getNextOccurrences(anchor, frequency, count, from)` — N future occurrences
- `getOccurrencesInRange(anchor, frequency, start, end)` — all in date range
- `getMonthRange(year, month)` — first and last day
- `toDateString(date)` — YYYY-MM-DD format
- Supports: weekly, fortnightly, four_weekly, monthly, annually

### 7. Server Actions

| Module  | Actions                                                   |
| ------- | --------------------------------------------------------- |
| Budgets | createBudget, updateBudget, deleteBudget                  |
| Goals   | createGoal, updateGoalStatus, addContribution, deleteGoal |
| Debts   | createDebt, updateDebt, deleteDebt                        |

### 8. Zod schemas added

budgetSchema, goalSchema, goalContributionSchema, debtSchema

---

## What this phase did NOT do

- No Stripe billing enforcement (free/pro gating deferred)
- No analytics charts (deferred to polish phase)
- No CSV export
- No admin panel features
- No advanced cashflow forecasting beyond current month projection

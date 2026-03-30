# PerFi — Implementation Phase 8: Dashboard, Analytics, Forecasting, and Net Worth

## Objective

Implement the dashboard summary layer, analytics charts, cashflow forecasting, and net worth tracking on top of the stable core finance data.

---

## What was built

### 1. Dashboard summary layer (`app/app/dashboard/page.tsx` + `components/app/dashboard-content.tsx`)

Full dashboard per Phase 4 Section 11 — "Where am I financially right now?"

| Card                  | Data source                                       | Links to          |
| --------------------- | ------------------------------------------------- | ----------------- |
| Total balance         | Sum of accounts.balance                           | —                 |
| Account balance cards | Each active account (horizontal scroll)           | Account detail    |
| Next pay day          | Nearest income_sources.next_pay_date + days until | Income page       |
| Upcoming bills        | Next 3 bills by due date                          | Bills page        |
| Budget status         | Budgets with progress bars (teal/amber/red)       | Budgets page      |
| Goals progress        | Active goals with progress bars                   | Goal detail       |
| Recent transactions   | Last 5 transactions with category                 | Transactions page |

All data fetched in parallel via Promise.all. Each section links to its detail page.

### 2. Analytics page (`app/app/analytics/page.tsx` + `components/app/analytics/`)

**Free tier (basic):**

- Spending by category donut chart (current month)

**Pro tier (advanced):**

- Income vs expenses stacked bar chart (monthly, last 6 months)
- Spending over time area chart (monthly trend)
- Net worth display (sum of all account balances)

Free users see the donut chart + UpgradeBanner. Pro users see all 4 sections.

### 3. Recharts integration (code-split)

All chart components use `dynamic()` import with `ssr: false` to code-split Recharts away from non-analytics pages:

| Component        | File                                              | Chart type         | Free/Pro |
| ---------------- | ------------------------------------------------- | ------------------ | -------- |
| SpendingDonut    | `components/app/analytics/spending-donut.tsx`     | PieChart (donut)   | Free     |
| IncomeVsExpenses | `components/app/analytics/income-vs-expenses.tsx` | BarChart (stacked) | Pro      |
| SpendingTrend    | `components/app/analytics/spending-trend.tsx`     | AreaChart          | Pro      |
| ForecastChart    | `components/app/cashflow/forecast-chart.tsx`      | AreaChart (step)   | Pro      |

Charts follow Phase 4 Section 8 visualisation principles:

- Muted colour palette from design tokens
- No aggressive red/green
- Tabular numbers in tooltips and labels
- No animation by default

### 4. Cashflow forecasting (`components/app/cashflow/balance-forecast.tsx`)

- Projected balance sparkline across the current month
- Step chart showing balance changes on income/bill days
- High/low balance summary
- Pro-only: free users see UpgradeBanner

### 5. Net worth tracking

- Displayed on analytics page (Pro only)
- Calculated as sum of all active account balances
- Updates automatically as transactions are added

### 6. Premium segmentation

| Feature                    | Free | Pro |
| -------------------------- | ---- | --- |
| Spending by category chart | Yes  | Yes |
| Income vs expenses chart   | —    | Yes |
| Spending trend chart       | —    | Yes |
| Net worth display          | —    | Yes |
| Cashflow forecasting       | —    | Yes |

Gating implemented via subscription.plan check in Server Components. Free users see UpgradeBanner components at Pro-only sections.

---

## What this phase did NOT do

- No Stripe billing flows (checkout, webhooks, customer portal)
- No full paywall enforcement on Server Actions
- No admin panel functionality
- No CSV export
- No custom date range selector on analytics

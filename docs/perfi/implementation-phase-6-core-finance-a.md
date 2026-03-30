# PerFi — Implementation Phase 6: Accounts, Transactions, Income, and Recurring Bills

## Objective

Implement the first major set of usable finance features: accounts, transactions, income sources (including benefits), and recurring bills.

---

## What was built

### 1. Zod validation schemas (`lib/validations/schemas.ts`)

| Schema               | Fields                                                                                                  | Key validations                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `accountSchema`      | name, type, balance                                                                                     | Name required, type from enum, balance numeric                     |
| `transactionSchema`  | account_id, category_id, type, amount, description, date, notes                                         | Amount > 0, description required, valid account                    |
| `incomeSourceSchema` | name, type, benefit_type, amount, frequency, next_pay_date, account_id                                  | Amount > 0, valid frequency, valid benefit_type when type=benefit  |
| `billSchema`         | name, amount, frequency, next_due_date, payment_method, account_id, category_id, is_subscription, notes | Amount > 0, valid frequency (incl. annually), valid payment method |

### 2. Server Actions

**Accounts** (`lib/actions/accounts.ts`):

- `createAccount(workspaceId, prevState, formData)` — validates + inserts
- `updateAccount(accountId, prevState, formData)` — validates + updates name/type
- `deleteAccount(accountId)` — deletes with cascade

**Transactions** (`lib/actions/transactions.ts`):

- `createTransaction(workspaceId, prevState, formData)` — validates + inserts, balance auto-updates via trigger
- `updateTransaction(transactionId, workspaceId, prevState, formData)` — validates + updates
- `deleteTransaction(transactionId)` — deletes, balance auto-reverts via trigger

**Income Sources** (`lib/actions/income.ts`):

- `createIncomeSource(workspaceId, prevState, formData)` — validates, sets benefit_type only when type=benefit
- `updateIncomeSource(sourceId, prevState, formData)` — validates + updates
- `deleteIncomeSource(sourceId)` — deletes

**Bills** (`lib/actions/bills.ts`):

- `createBill(workspaceId, prevState, formData)` — validates, supports all frequencies incl. annually
- `updateBill(billId, prevState, formData)` — validates + updates
- `deleteBill(billId)` — deletes

All actions: Zod validation, workspace-scoped RLS, revalidatePath for affected routes.

### 3. Accounts page (`app/app/accounts/page.tsx`)

- Card grid showing each account: type label, name, balance
- Account type labels: Current account, Savings, Credit card, Cash, Investments
- Empty state: "No accounts yet" with description
- Add account dialog with name, type selector, starting balance
- Archived badge for inactive accounts
- Click through to account detail

### 4. Account detail page (`app/app/accounts/[id]/page.tsx`)

- Account name, type, balance display
- Transaction list filtered to that account
- Back link to accounts list
- Delete account button with confirmation

### 5. Transactions page (`app/app/transactions/page.tsx`)

- Transaction list grouped by date (Today, Yesterday, date headings)
- Progressive disclosure: click row to expand → notes, account, delete button
- Category colour dots on transaction rows
- Income shown in teal, expenses in default text colour
- Empty state: "No transactions yet"
- Quick-add transaction button

### 6. Quick-add transaction panel (`components/app/transactions/quick-add-transaction.tsx`)

- Slide-out panel from right edge (per Phase 4 Section 7)
- Expense/Income type toggle
- Fields: amount, description, account selector, category selector (filtered by type), date (defaults today), notes
- Loading state, error display
- Closes on success

### 7. Income page (`app/app/income/page.tsx`)

- Income source cards: name, type badge, benefit type badge, amount/frequency, next pay date, linked account
- Employment and benefits income shown with equal visual weight
- 8 named UK benefit types with badges
- Empty state: "No income sources"
- Add income source dialog with employment/benefit/other type selector, benefit type dropdown, amount, frequency, pay date, account

### 8. Bills page (`app/app/bills/page.tsx`)

- Upcoming section (next 14 days) with due date and payment method
- All bills list with frequency, payment method, next due date, linked account
- Subscription badge ("Sub") for is_subscription items
- Empty state: "No bills tracked"
- Add bill dialog with name, amount, frequency (incl. annually), due date, payment method, account, category, subscription checkbox
- Delete button with confirmation on each bill

### 9. Supporting components

| Component             | File                                                    | Purpose                                         |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------- |
| AddAccountDialog      | `components/app/accounts/add-account-dialog.tsx`        | Modal form for creating accounts                |
| EditAccountForm       | `components/app/accounts/edit-account-form.tsx`         | Inline edit form on account detail (name, type) |
| DeleteAccountButton   | `components/app/accounts/delete-account-button.tsx`     | Confirm + delete on account detail              |
| TransactionList       | `components/app/transactions/transaction-list.tsx`      | Date-grouped list with progressive disclosure   |
| QuickAddTransaction   | `components/app/transactions/quick-add-transaction.tsx` | Slide-out panel form                            |
| EditTransactionForm   | `components/app/transactions/edit-transaction-form.tsx` | Inline edit form in expanded row                |
| AddIncomeSourceDialog | `components/app/income/add-income-dialog.tsx`           | Modal form with benefit type handling           |
| IncomeCard            | `components/app/income/income-card.tsx`                 | Card with edit toggle for income sources        |
| EditIncomeForm        | `components/app/income/edit-income-form.tsx`            | Inline edit form on income cards                |
| DeleteIncomeButton    | `components/app/income/delete-income-button.tsx`        | Confirm + delete on income cards                |
| AddBillDialog         | `components/app/bills/add-bill-dialog.tsx`              | Modal form with all bill fields                 |
| BillRow               | `components/app/bills/bill-row.tsx`                     | Row with edit toggle for bills                  |
| EditBillForm          | `components/app/bills/edit-bill-form.tsx`               | Inline edit form on bill rows                   |
| DeleteBillButton      | `components/app/bills/delete-bill-button.tsx`           | Confirm + delete on bill rows                   |

---

## What this phase did NOT do

- No budgets module (Phase 7)
- No goals or debt modules (Phase 7)
- No cashflow calendar (Phase 7)
- No analytics dashboard
- No Stripe billing
- No CSV import/export
- No CSV import/export

# PerFi — Phase 3: Data Model, Schema, Auth, Tenancy, and Security

## 1. Tenancy Model

### Architecture: Shared infrastructure, workspace-scoped tenancy

PerFi uses a single Supabase project with a single Postgres database. All users share the same infrastructure. Data isolation is enforced at the **workspace** level using Row Level Security (RLS) policies on every user-facing table.

### Why workspace-scoped, not user-scoped

The "new user environments per account" requirement translates to: **each user's data lives inside a workspace, and workspaces are the isolation boundary**. This is better than user-scoped tenancy because:

1. **Future-proof for sharing**: When household collaboration is added post-v1, a workspace can have multiple members. If tenancy were user-scoped, sharing would require a full re-architecture.
2. **Clean multi-workspace support**: Pro users can have up to 5 workspaces. Each workspace is an independent data silo — separate accounts, transactions, budgets, goals.
3. **Simple RLS policies**: Every data table has a `workspace_id` column. RLS policies check `workspace_id` against the user's workspace memberships. One pattern, every table.

### Tenancy rules

- Every data record belongs to exactly one workspace
- A user accesses data only in workspaces where they have a membership
- In v1, every workspace has exactly one member (the owner)
- Post-v1, workspaces can have multiple members with role-based access
- There is no "global" user data outside of workspaces, except the user profile and subscription

### What lives outside workspaces

| Entity | Scope | Reason |
|--------|-------|--------|
| `users` (Supabase auth) | Global | Auth identity, managed by Supabase Auth |
| `profiles` | Global (per user) | Display name, preferences, onboarding status |
| `subscriptions` | Global (per user) | Stripe subscription status, plan tier |
| `workspace_members` | Join table | Maps users to workspaces with roles |
| `waitlist_entries` | Global | Pre-signup, no user association |
| `contact_submissions` | Global | Support/contact form submissions |

### What lives inside workspaces

Everything else: accounts, transactions, categories, budgets, bills, goals, debts, income sources. All scoped by `workspace_id`.

---

## 2. Workspace-Based Access Model

### Core concept

```
User → has Profile (1:1)
User → has Subscription (1:1)
User → has Workspace Memberships (1:many)
Workspace Membership → links User to Workspace with a Role
Workspace → contains all financial data
```

### v1 simplification

In v1:
- Every user gets exactly 1 workspace on signup (Free) or up to 5 (Pro)
- Every workspace has exactly 1 member: the owner
- The only role is `owner`
- No invites, no sharing, no collaboration

### Post-v1 expansion path

The schema supports future states without migration:
- Add `member` and `viewer` roles to `workspace_members`
- Add an invite flow that creates `workspace_members` entries
- RLS policies already check membership — they do not assume single-owner

### Access resolution

For any data request:

```
1. Authenticate user (Supabase Auth JWT)
2. Extract user_id from JWT
3. Query checks: does user_id have a row in workspace_members
   for the requested workspace_id?
4. If yes → allow (subject to role permissions)
5. If no → deny (RLS blocks the row entirely)
```

This happens at the database level via RLS. The application layer does not need to implement access checks — Supabase client queries automatically filter by the user's JWT.

---

## 3. Supabase-Oriented Data Model

### Schema organisation

Use Postgres schemas to separate concerns:

| Schema | Purpose |
|--------|---------|
| `auth` | Supabase Auth (managed, do not modify) |
| `public` | Application tables, RLS-protected |
| `admin` | Admin-only views and functions (not exposed via Supabase client) |

All application tables live in `public`. Admin operations use server-side Supabase clients with the `service_role` key, bypassing RLS.

### ID strategy

- All primary keys: `id uuid DEFAULT gen_random_uuid() PRIMARY KEY`
- Foreign keys reference UUIDs
- No serial/integer IDs — UUIDs prevent enumeration and are Supabase-native

### Timestamp strategy

- Every table has `created_at timestamptz DEFAULT now()` and `updated_at timestamptz DEFAULT now()`
- Use a trigger to auto-update `updated_at` on row modification
- All timestamps in UTC

### Soft delete strategy

- No soft deletes in v1. Hard delete with foreign key cascades.
- Simpler to implement, simpler to reason about, simpler for GDPR deletion requests.
- If audit trails are needed later, add an `audit_log` table rather than soft-delete flags on every table.

---

## 4. Core Entities and Relationships

```
auth.users (Supabase managed)
  │
  ├── 1:1 ── profiles
  │            (display_name, onboarding_completed, preferences)
  │
  ├── 1:1 ── subscriptions
  │            (stripe_customer_id, plan, status, billing dates)
  │
  └── 1:many ── workspace_members
                  │
                  └── many:1 ── workspaces
                                  │
                                  ├── 1:many ── accounts
                                  │               └── referenced by transactions
                                  │
                                  ├── 1:many ── transactions
                                  │               └── references account, category
                                  │
                                  ├── 1:many ── categories
                                  │               └── referenced by transactions, budgets, bills
                                  │
                                  ├── 1:many ── income_sources
                                  │               (employment, benefits, other)
                                  │
                                  ├── 1:many ── budgets
                                  │               └── references category
                                  │
                                  ├── 1:many ── bills
                                  │               (recurring bills, subscriptions, direct debits)
                                  │               └── references account, category
                                  │
                                  ├── 1:many ── goals
                                  │               (savings goals + financial goals)
                                  │
                                  ├── 1:many ── debts
                                  │               └── references account (optional)
                                  │
                                  └── 1:many ── goal_contributions
                                                  └── references goal

  Standalone (no workspace):
  ├── waitlist_entries
  └── contact_submissions
```

---

## 5. Recommended Schema Outline

### `profiles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | Same as `auth.users.id` (1:1 link) |
| `display_name` | text | Set during onboarding |
| `onboarding_completed` | boolean | Default false |
| `onboarding_step` | smallint | Track progress if user abandons mid-flow |
| `preferences` | jsonb | Theme prefs, UI settings — flexible bag |
| `role` | text | `user` or `admin`. Default `user` |
| `is_disabled` | boolean | Default false. Set by admin to block login |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS**: Users can read/update only their own profile (`id = auth.uid()`). Admins can read all via service_role. `is_disabled` is checked in middleware to block access for disabled accounts.

---

### `subscriptions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles.id | Unique — 1:1 with user |
| `stripe_customer_id` | text | Stripe customer ID |
| `stripe_subscription_id` | text | Nullable — null if on Free |
| `plan` | text | `free` or `pro` |
| `status` | text | `active`, `cancelled`, `past_due`, `expired` |
| `current_period_start` | timestamptz | |
| `current_period_end` | timestamptz | |
| `cancel_at_period_end` | boolean | User requested cancellation |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS**: Users can read only their own subscription. Updates come from Stripe webhooks via service_role.

---

### `workspaces`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `name` | text | e.g. "My Finances", "Household" |
| `type` | text | `personal` or `personal_household` |
| `owner_id` | uuid FK → profiles.id | The user who created the workspace |
| `is_demo` | boolean | True if populated with demo data |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS**: Accessible only through workspace_members lookup.

---

### `workspace_members`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `user_id` | uuid FK → profiles.id | |
| `role` | text | `owner` in v1. Future: `member`, `viewer` |
| `created_at` | timestamptz | |

**Unique constraint**: `(workspace_id, user_id)` — a user can only be in a workspace once.

**RLS**: Users can read only their own memberships (`user_id = auth.uid()`).

---

### `accounts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Barclays Current" |
| `type` | text | `current`, `savings`, `credit_card`, `cash`, `investments` |
| `balance` | numeric(12,2) | Current balance in GBP. Updated on transaction changes |
| `is_active` | boolean | Default true. Can archive accounts |
| `sort_order` | smallint | User-defined display order |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS**: `workspace_id` must be in user's workspace memberships.

---

### `categories`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Groceries", "Transport" |
| `type` | text | `expense`, `income`, `transfer` |
| `icon` | text | Optional icon identifier |
| `colour` | text | Optional hex colour |
| `is_default` | boolean | True for system-generated defaults |
| `sort_order` | smallint | |
| `created_at` | timestamptz | |

**Notes**: Default categories are seeded when a workspace is created (based on workspace type per Phase 2 section 7). Users can add, rename, reorder, and delete custom categories.

---

### `transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | Denormalised for RLS performance |
| `account_id` | uuid FK → accounts.id | |
| `category_id` | uuid FK → categories.id | Nullable |
| `type` | text | `expense`, `income`, `transfer` |
| `amount` | numeric(12,2) | Always positive. Type determines direction |
| `description` | text | Payee or description |
| `date` | date | Transaction date |
| `notes` | text | Optional user notes |
| `is_recurring` | boolean | True if generated from a bill template |
| `bill_id` | uuid FK → bills.id | Nullable — links to originating bill |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Notes**: `workspace_id` is denormalised (could be derived from account → workspace) for RLS performance. Every RLS check needs `workspace_id` directly on the row to avoid joins in policy evaluation.

**Index**: `(workspace_id, date DESC)` for primary transaction listing. `(workspace_id, category_id, date)` for budget calculations. `(workspace_id, account_id, date)` for account views.

---

### `income_sources`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Salary — Acme Ltd", "Universal Credit" |
| `type` | text | `employment`, `benefit`, `other` |
| `benefit_type` | text | Nullable. `universal_credit`, `pip`, `child_benefit`, `carers_allowance`, `esa`, `housing_benefit`, `council_tax_reduction`, `other` |
| `amount` | numeric(12,2) | Expected amount per period |
| `frequency` | text | `weekly`, `fortnightly`, `four_weekly`, `monthly` |
| `next_pay_date` | date | Next expected payment date |
| `account_id` | uuid FK → accounts.id | Nullable — which account it pays into |
| `is_active` | boolean | Default true |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Notes**: `benefit_type` is only relevant when `type = 'benefit'`. This is the schema representation of Phase 1's benefits-aware income tracking. Benefits sit alongside employment income in the same table — no separate "benefits" table — reflecting the "no judgement, equal dignity" principle.

---

### `bills`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Netflix", "Council Tax" |
| `amount` | numeric(12,2) | Expected amount |
| `frequency` | text | `weekly`, `fortnightly`, `four_weekly`, `monthly`, `annually` |
| `next_due_date` | date | |
| `payment_method` | text | `direct_debit`, `standing_order`, `card`, `manual` |
| `account_id` | uuid FK → accounts.id | Which account pays this bill |
| `category_id` | uuid FK → categories.id | Nullable |
| `is_subscription` | boolean | True for subscriptions (Netflix, Spotify, etc.) |
| `is_active` | boolean | Default true |
| `notes` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Notes**: Bills and subscriptions live in the same table (per Phase 2 resolution). The `is_subscription` flag allows filtering. `payment_method` supports direct debit date tracking — if method is `direct_debit`, the `next_due_date` is the direct debit collection date.

---

### `budgets`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `category_id` | uuid FK → categories.id | One budget per category per period |
| `amount` | numeric(12,2) | Monthly budget limit |
| `period` | text | `monthly` in v1. Future: `weekly`, `annual` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**Unique constraint**: `(workspace_id, category_id, period)` — no duplicate budgets for the same category.

**Notes**: Budget "spent" amounts are calculated at query time by summing transactions for that category in the current period. No separate "spent" column — avoids sync issues.

---

### `goals`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Holiday Fund", "Pay off credit card" |
| `type` | text | `savings` or `financial` |
| `target_amount` | numeric(12,2) | For savings goals: target to save. For financial: target balance (e.g. £0 for debt payoff) |
| `current_amount` | numeric(12,2) | For savings goals: amount saved so far. Default 0 |
| `target_date` | date | Nullable — optional deadline |
| `debt_id` | uuid FK → debts.id | Nullable — links financial goals to a debt |
| `category_id` | uuid FK → categories.id | Nullable — links financial goals to a budget category (e.g. "reduce eating out") |
| `status` | text | `active`, `completed`, `abandoned` |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### `goal_contributions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `goal_id` | uuid FK → goals.id | |
| `workspace_id` | uuid FK → workspaces.id | Denormalised for RLS |
| `amount` | numeric(12,2) | Contribution amount |
| `date` | date | |
| `notes` | text | |
| `created_at` | timestamptz | |

**Notes**: When a user logs a contribution, `goals.current_amount` is updated. Contributions provide a history trail.

---

### `debts`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `workspace_id` | uuid FK → workspaces.id | |
| `name` | text | e.g. "Tesco Credit Card", "Student Loan" |
| `account_id` | uuid FK → accounts.id | Nullable — links to a credit card or loan account |
| `balance` | numeric(12,2) | Current outstanding balance |
| `minimum_payment` | numeric(12,2) | Minimum monthly payment |
| `interest_rate` | numeric(5,2) | Annual interest rate as percentage. Nullable |
| `next_payment_date` | date | |
| `is_active` | boolean | Default true |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

---

### `waitlist_entries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `email` | text | Unique |
| `interests` | text[] | Array of interest tags |
| `status` | text | `pending`, `invited`, `converted` |
| `invited_at` | timestamptz | Nullable |
| `converted_at` | timestamptz | Nullable |
| `created_at` | timestamptz | |

**RLS**: No RLS — this table is accessed only via service_role (admin operations and API routes).

---

### `contact_submissions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `email` | text | |
| `name` | text | |
| `message` | text | |
| `status` | text | `new`, `read`, `responded` |
| `admin_notes` | text | |
| `created_at` | timestamptz | |

**RLS**: No RLS — service_role only.

---

### `admin_notes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → profiles.id | The user this note is about |
| `author_id` | uuid FK → profiles.id | The admin who wrote it |
| `content` | text | |
| `created_at` | timestamptz | |

**RLS**: No RLS — service_role only.

---

### `feature_flags`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `key` | text | Unique. e.g. `maintenance_mode`, `signups_enabled` |
| `value` | jsonb | Flexible value |
| `updated_at` | timestamptz | |

**RLS**: No RLS — service_role only. Can be cached in-memory on the server.

---

## 6. Roles and Permissions

### Application roles

| Role | Scope | Capabilities |
|------|-------|-------------|
| `user` | Default for all signups | Full CRUD on own workspaces and data within them. Manage own profile and subscription. No access to other users' data or admin surfaces. |
| `admin` | Assigned manually in `profiles.role` | Everything a user can do, plus: access admin panel, read all users/workspaces/subscriptions via service_role, manage waitlist, write admin notes, toggle feature flags. |

### Workspace roles (within `workspace_members`)

| Role | v1 behaviour | Post-v1 expansion |
|------|-------------|-------------------|
| `owner` | Full CRUD on all data in the workspace. Can delete the workspace. Only role in v1. | Retains full control. Can invite/remove members. |
| `member` | Not used in v1 | Full CRUD on workspace data, cannot delete workspace or manage members |
| `viewer` | Not used in v1 | Read-only access to workspace data |

### Role assignment

- `profiles.role` is set to `user` on signup. Admin role is assigned manually via direct database update or a seeded admin setup script. There is no self-service admin promotion.
- `workspace_members.role` is set to `owner` when a user creates a workspace. Future invite flows will create `member` or `viewer` entries.

### Permission checks

Two layers:

1. **Application role** (`profiles.role`): Checked in Next.js middleware for `/admin/*` routes. Admin routes require `role = 'admin'`.
2. **Workspace role** (`workspace_members.role`): Checked via RLS policies at the database level. Every query is automatically scoped to workspaces the user is a member of.

In v1, since every user is the sole owner of their workspaces, the workspace role check is effectively just a membership check. The role column exists for future use.

---

## 7. Admin Access Model

### How admin access works

Admin access uses **two mechanisms** depending on the operation:

#### 1. Admin panel UI (server-side)

- Admin pages (`/admin/*`) are server-rendered Next.js pages
- Middleware checks `profiles.role = 'admin'` from the user's session
- Admin pages use the Supabase **service_role** client (server-side only, never exposed to the browser)
- The service_role client bypasses RLS, allowing reads across all users, workspaces, and subscriptions

#### 2. Admin API routes

- Admin API routes (e.g. `/api/admin/users`, `/api/admin/waitlist`) verify the requesting user has `role = 'admin'` in their profile
- These routes use the service_role client for database operations
- The service_role key is stored as a server-side environment variable, never sent to the client

### What admins can do

| Action | Implementation |
|--------|---------------|
| View all users | `profiles` + `subscriptions` via service_role |
| Disable/enable a user | Set `is_disabled` flag on profile (blocks login via middleware check) |
| View all waitlist entries | `waitlist_entries` via service_role |
| Send waitlist invites | Update status + trigger email (manual or via email service) |
| Bulk invite from waitlist | Same, batched |
| View subscriptions | `subscriptions` via service_role |
| Add support notes | Insert into `admin_notes` via service_role |
| Toggle feature flags | Update `feature_flags` via service_role |
| Toggle maintenance mode | Feature flag: `maintenance_mode = true` |
| View aggregate metrics | Aggregate queries on profiles, subscriptions, workspace_members |

### What admins cannot do

- Modify a user's financial data (accounts, transactions, budgets, etc.)
- Access Stripe billing directly (use Stripe Dashboard for payment issues)
- Delete user accounts (this should be a user self-service action, or a carefully controlled admin process)

---

## 8. Auth Approach

### Provider: Supabase Auth

Supabase Auth handles all authentication. No custom auth implementation.

### Auth methods (v1)

| Method | Priority | Notes |
|--------|----------|-------|
| **Email + password** | Primary | Standard signup/login. Email verification required. |
| **Magic link** | Secondary | Optional passwordless login via email link. Low friction for returning users. |
| **OAuth** | Deferred | Google/Apple sign-in considered for post-v1. Adds complexity. |

### Auth flow

```
Signup:
  1. User submits email + password on /signup
  2. Supabase Auth creates auth.users entry
  3. Supabase sends verification email
  4. On verification, a database trigger creates the profiles row
  5. A database trigger creates the subscriptions row (plan: 'free', status: 'active')
  6. User is redirected to /app/onboarding

Login:
  1. User submits email + password on /login
  2. Supabase Auth validates credentials
  3. Returns JWT + refresh token (stored in httpOnly cookie via Supabase SSR helpers)
  4. Middleware checks session, redirects to /app/dashboard

Password reset:
  1. User submits email on /forgot-password
  2. Supabase sends reset email
  3. User clicks link → /reset-password with token
  4. User sets new password
  5. Redirected to /login
```

### Session management

- Supabase Auth uses JWTs with refresh tokens
- Use `@supabase/ssr` package for server-side session handling in Next.js
- JWT is stored in an httpOnly cookie (not localStorage) for security
- Refresh tokens are rotated automatically
- Session expiry: default Supabase settings (1 hour JWT, 7 day refresh)

### Database triggers on signup

When a new `auth.users` row is created, a Postgres trigger runs:

1. **Create profile**: Insert into `profiles` with `id = auth.users.id`, `role = 'user'`, `onboarding_completed = false`
2. **Create subscription**: Insert into `subscriptions` with `user_id = auth.users.id`, `plan = 'free'`, `status = 'active'`

No workspace is created at signup — that happens during onboarding (step 2) or when the user chooses demo/blank (step 5).

---

## 9. Protected Route Model

### Middleware strategy (Next.js)

A single `middleware.ts` at the project root handles all route protection:

```
Route pattern        → Behaviour
─────────────────────────────────────────────────
/app/*               → Require authenticated session
                       If no session → redirect to /login
                       If profile.is_disabled → redirect to /disabled
                       If !onboarding_completed && path != /app/onboarding
                         → redirect to /app/onboarding

/admin/*             → Require authenticated session
                       Require profiles.role = 'admin'
                       If not admin → 403 or redirect to /app/dashboard

/login, /signup      → If already authenticated → redirect to /app/dashboard

/api/admin/*         → Require authenticated session + admin role
                       Return 401/403 if not met

/api/*               → Require authenticated session
(non-admin)            Return 401 if not met

/(marketing)/*       → No auth required. Always public.
```

### Implementation approach

- Use Supabase SSR middleware helpers to read the session from the cookie
- For admin role checks: query `profiles.role` from the session user ID (can be cached briefly)
- Middleware runs on the Edge Runtime in Next.js — keep it lightweight
- For the `is_disabled` and `onboarding_completed` checks: fetch from `profiles` table server-side. This adds a small DB hit but is necessary for correctness.

### API route protection

- All `/api/*` routes (server-side Route Handlers) create a Supabase server client from the request cookies
- The Supabase client automatically has the user's auth context, so RLS applies
- Admin API routes additionally check `profiles.role` and use the service_role client for cross-user queries

### Workspace context

- The active workspace is stored client-side (React context or URL parameter)
- Every data query includes the `workspace_id` as a filter
- RLS ensures that even if a malicious client sends a different `workspace_id`, the query returns nothing unless the user is a member
- The workspace switcher in the top bar sets the active workspace context

---

## 10. Row Level Security Strategy

### Core principle

**Every user-facing table with a `workspace_id` column has an RLS policy that checks workspace membership.** No exceptions.

### The standard policy pattern

For any workspace-scoped table (accounts, transactions, categories, budgets, bills, goals, debts, income_sources, goal_contributions):

```sql
-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- SELECT: user can read rows in workspaces they are a member of
CREATE POLICY "Users can view own workspace data"
  ON public.accounts FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- INSERT: user can insert into workspaces they are a member of
CREATE POLICY "Users can insert into own workspaces"
  ON public.accounts FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- UPDATE: same check
CREATE POLICY "Users can update own workspace data"
  ON public.accounts FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- DELETE: same check
CREATE POLICY "Users can delete own workspace data"
  ON public.accounts FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );
```

This pattern is **identical for every workspace-scoped table**. The only thing that changes is the table name.

### Profile and subscription policies

```sql
-- profiles: users can read/update only their own
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- subscriptions: users can read only their own
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (user_id = auth.uid());
-- No direct update — subscription changes come from Stripe webhooks via service_role
```

### Workspace and membership policies

```sql
-- workspaces: users can read workspaces they are members of
CREATE POLICY "Users can view own workspaces"
  ON public.workspaces FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- workspace_members: users can read only their own memberships
CREATE POLICY "Users can view own memberships"
  ON public.workspace_members FOR SELECT
  USING (user_id = auth.uid());
```

### Performance considerations

- The `workspace_members` subquery runs on every row access. To keep this fast:
  - Index on `workspace_members(user_id)` — critical
  - Index on `workspace_members(workspace_id, user_id)` — for the unique constraint, also helps lookups
  - In v1, users have 1–5 workspace memberships, so the subquery returns a tiny set
- `workspace_id` is denormalised onto tables like `transactions` and `goal_contributions` to avoid joins during RLS evaluation
- For high-volume tables (transactions), compound indexes on `(workspace_id, date)` ensure filtered queries remain fast

### Tables without RLS

These tables are never queried via the Supabase client (anon/authenticated key). They are only accessed via service_role:

- `waitlist_entries`
- `contact_submissions`
- `admin_notes`
- `feature_flags`

RLS is still **enabled** on these tables (defence in depth) with **no policies**, meaning the anon/authenticated key cannot read them at all. Only the service_role key bypasses RLS.

### Testing RLS

Before launch, RLS must be verified:
1. Confirm every table has RLS enabled
2. Confirm no table is accidentally accessible without policies
3. Test cross-workspace access: User A should never see User B's data
4. Test that service_role correctly bypasses RLS for admin operations
5. Test that unauthenticated requests return nothing from protected tables

---

## 11. Privacy and Security Essentials for v1

### Data privacy

| Requirement | Implementation |
|-------------|---------------|
| **User data isolation** | RLS on every table. No cross-user data leakage possible at the database level. |
| **No unnecessary data collection** | Signup collects email + password only. Onboarding collects display name + finance preferences. No phone, address, date of birth, or government IDs. |
| **Data export** | CSV export available (basic on Free, full on Pro). Users can export their data at any time. |
| **Account deletion** | Users can delete their account from Settings. This triggers a cascade delete: profile → workspace_members → workspaces → all workspace data. Supabase Auth user is also deleted. |
| **GDPR right to erasure** | Account deletion satisfies this. Hard deletes (no soft delete) mean data is actually gone. |
| **No third-party data sharing** | PerFi does not sell, share, or send user financial data to third parties. Stripe receives only payment information, not financial tracking data. |
| **Cookie policy** | Only essential cookies: auth session (httpOnly, secure). No analytics cookies in v1. No third-party tracking. |

### Security measures

| Measure | Implementation |
|---------|---------------|
| **Authentication** | Supabase Auth with email verification. Passwords hashed by Supabase (bcrypt). |
| **Session security** | JWTs in httpOnly cookies. No localStorage tokens. Refresh token rotation. |
| **HTTPS** | Enforced via Cloudflare. All traffic encrypted in transit. |
| **RLS everywhere** | Database-level access control. Even if application code has a bug, RLS prevents data leakage. |
| **Service role key protection** | Never exposed to the client. Used only in server-side API routes and server components. Stored as environment variable. |
| **Input validation** | Server-side validation on all API routes. Client-side validation for UX, not for security. Use Zod schemas for type-safe validation. |
| **SQL injection prevention** | Supabase client uses parameterised queries. No raw SQL from user input. |
| **CSRF protection** | Cookie-based auth with SameSite=Lax. Supabase handles CSRF for auth endpoints. |
| **Rate limiting** | Supabase Auth has built-in rate limiting for auth endpoints. Additional rate limiting on public API routes (waitlist, contact form) via Cloudflare or middleware. |
| **Environment variables** | All secrets (Supabase keys, Stripe keys) in environment variables. Never committed to the repo. Use `.env.local` for development, Cloudflare environment variables for production. |

### What is explicitly out of scope for v1 security

- Two-factor authentication (consider post-v1)
- IP-based access controls
- Advanced audit logging
- Penetration testing (recommended pre-launch but not part of this planning phase)
- SOC 2 or ISO 27001 compliance
- Data encryption at rest beyond Supabase defaults (Supabase encrypts at rest by default)

---

## 12. Notes on Auditability and Future Shared Workspace Support

### Auditability

v1 does not include audit logging. This is a deliberate scope decision — audit logs add complexity (additional writes on every operation, storage growth, query patterns) that is disproportionate for a solo-founder v1.

**Future audit approach** (when needed):

- Add an `audit_log` table: `id`, `workspace_id`, `user_id`, `action` (e.g. `transaction.create`), `entity_type`, `entity_id`, `metadata` (jsonb — before/after values), `created_at`
- Use a Postgres trigger or application-level middleware to write audit entries
- Scope audit logs to workspaces (same RLS pattern)
- This becomes important when shared workspaces are added — "who changed what" matters in collaborative environments

### Future shared workspace support

The schema is designed to support shared workspaces without migration:

| Current state (v1) | Future state |
|--------------------|-------------|
| `workspace_members` has only `owner` rows | Add `member` and `viewer` rows |
| One user per workspace | Multiple users per workspace |
| RLS checks membership, not ownership | Same — already works for multiple members |
| No invite mechanism | Add `workspace_invites` table |
| No role-based CRUD restrictions | Add role checks: `viewer` = read-only, `member` = read/write, `owner` = full control |

**What would need to change:**

1. **New table**: `workspace_invites` — `id`, `workspace_id`, `email`, `role`, `status`, `invited_by`, `created_at`, `expires_at`
2. **Updated RLS policies**: Add role-based checks (e.g. viewers cannot INSERT/UPDATE/DELETE)
3. **Workspace creation limits**: Check per-user workspace count against plan limits (already in the schema via subscription plan)
4. **UI changes**: Workspace settings page with member management, invite flow

**What would NOT need to change:**

- Table structures (no schema migration)
- Core RLS pattern (membership check already works)
- Data model (workspace_id scoping is unchanged)
- API structure (workspace context is already in the architecture)

---

## 13. Recommended Treatment of Benefits as an Income Type

### Schema design principle

Benefits income is modelled in the same `income_sources` table as employment income. There is no separate `benefits` table. This reflects the Phase 1 principle: "The interface treats benefits income with the same visual weight and dignity as employment income."

### How it works in the schema

```
income_sources
  type: 'employment' | 'benefit' | 'other'
  benefit_type: nullable, only used when type = 'benefit'
    values: 'universal_credit', 'pip', 'child_benefit',
            'carers_allowance', 'esa', 'housing_benefit',
            'council_tax_reduction', 'other'
```

### Design decisions

| Decision | Rationale |
|----------|-----------|
| Same table as employment | No structural separation = no UX separation. Benefits are income. |
| `benefit_type` as a nullable column | Only relevant for benefits. Avoids a join table while keeping named types queryable. |
| Named benefit types as enum values | Enables reporting ("How much of my income comes from UC?"), supports UK-specific filtering, and seeds the onboarding checkbox list. |
| `other` benefit type | Covers edge cases without requiring schema changes for every benefit type. |
| Per-source frequency and next pay date | Benefits have varying payment schedules (UC is monthly, child benefit is four-weekly). Each source tracks its own schedule. |

### Querying patterns

- **Dashboard "Next pay day"**: `SELECT * FROM income_sources WHERE workspace_id = ? AND is_active = true ORDER BY next_pay_date ASC LIMIT 1`
- **Income breakdown**: `SELECT type, benefit_type, SUM(amount) FROM income_sources WHERE workspace_id = ? GROUP BY type, benefit_type`
- **Cashflow calendar**: Plot all active income sources' `next_pay_date` (and calculated future dates) alongside bills

### What this enables

- Benefits income appears on the Income page alongside employment income
- Dashboard shows next pay date from any source (employment or benefit)
- Cashflow calendar plots all income events
- Analytics can break down income by type
- Onboarding step 4 seeds `income_sources` rows with `type = 'benefit'` and the selected `benefit_type`

---

## 14. Stripe Subscription Model — Schema Implications

### How Stripe integrates

```
User signs up → Free plan (no Stripe interaction)
User upgrades → Stripe Checkout creates customer + subscription
Stripe webhook → Updates subscriptions table
User cancels → Stripe webhook updates status and cancel_at_period_end
```

### Key schema fields for Stripe

The `subscriptions` table stores the Supabase-side mirror of Stripe's state:

| Field | Source | Notes |
|-------|--------|-------|
| `stripe_customer_id` | Created on first upgrade | One Stripe customer per user |
| `stripe_subscription_id` | Created on upgrade | Null for Free users |
| `plan` | Derived from Stripe price | `free` or `pro` |
| `status` | From Stripe webhook | `active`, `cancelled`, `past_due`, `expired` |
| `current_period_start` | From Stripe webhook | Start of current billing period |
| `current_period_end` | From Stripe webhook | End of current billing period |
| `cancel_at_period_end` | From Stripe webhook | True if user requested cancellation |

### Webhook events to handle

| Stripe event | Action |
|--------------|--------|
| `checkout.session.completed` | Create/update subscription row. Set plan to `pro`, status to `active`. Store Stripe IDs. |
| `customer.subscription.updated` | Update status, period dates, cancellation flags. |
| `customer.subscription.deleted` | Set plan to `free`, status to `expired`. Clear Stripe subscription ID. |
| `invoice.payment_failed` | Set status to `past_due`. |
| `invoice.paid` | Set status back to `active` if was `past_due`. |

### Webhook security

- Verify Stripe webhook signatures on every event
- Use the `stripe` npm package's `constructEvent` method with the webhook signing secret
- Webhook endpoint: `/api/webhooks/stripe` — public (no auth), but signature-verified
- Process webhooks idempotently (Stripe may retry)

### Entitlement checks

Feature gating is based on the `subscriptions.plan` field:

```
function canAccessFeature(plan: string, feature: string): boolean
```

Checked in two places:
1. **Server-side**: API routes and server components check the user's plan before returning Pro-gated data
2. **Client-side**: UI hides or shows upgrade prompts based on plan (from session context)

The server-side check is authoritative. The client-side check is for UX only.

### Entitlement rules (from Phase 2 pricing table)

| Check | Logic |
|-------|-------|
| Account limit | Free: count of accounts in workspace ≤ 3. Pro: unlimited |
| Budget limit | Free: count of budgets in workspace ≤ 5. Pro: unlimited |
| Goal limit | Free: count of goals in workspace ≤ 2. Pro: unlimited |
| Workspace limit | Free: count of workspace_members for user ≤ 1. Pro: ≤ 5 |
| Advanced analytics | Pro only |
| Cashflow forecasting | Pro only |
| Net worth tracking | Pro only |
| CSV import | Pro only |
| CSV export (full) | Pro: all data. Free: transactions only |

These checks run as application logic, not RLS. RLS ensures data isolation; entitlements ensure plan limits. They are separate concerns.

### Downgrade handling

When a user's subscription expires or is cancelled:
1. Stripe webhook updates `subscriptions.plan` to `free`
2. Existing data is **not deleted**. The user keeps all their accounts, transactions, etc.
3. Pro features become read-only or inaccessible:
   - Extra accounts (beyond 3) remain visible but user cannot create new ones
   - Extra workspaces remain accessible but user cannot create new ones
   - Advanced analytics page shows upgrade prompt
   - CSV import is disabled
4. This is a grace-based approach — do not punish users for downgrading

---

## Summary: Complete Table List

| Table | Workspace-scoped | RLS | Notes |
|-------|-----------------|-----|-------|
| `profiles` | No | Yes (user = self) | 1:1 with auth.users |
| `subscriptions` | No | Yes (user = self) | Stripe mirror |
| `workspaces` | N/A (is the scope) | Yes (member check) | |
| `workspace_members` | N/A (is the join) | Yes (user = self) | |
| `accounts` | Yes | Yes (workspace) | |
| `categories` | Yes | Yes (workspace) | |
| `transactions` | Yes | Yes (workspace) | High volume — indexed |
| `income_sources` | Yes | Yes (workspace) | Benefits + employment |
| `bills` | Yes | Yes (workspace) | Includes subscriptions |
| `budgets` | Yes | Yes (workspace) | |
| `goals` | Yes | Yes (workspace) | Savings + financial |
| `goal_contributions` | Yes | Yes (workspace) | |
| `debts` | Yes | Yes (workspace) | |
| `waitlist_entries` | No | Enabled, no policies | Service_role only |
| `contact_submissions` | No | Enabled, no policies | Service_role only |
| `admin_notes` | No | Enabled, no policies | Service_role only |
| `feature_flags` | No | Enabled, no policies | Service_role only |

**Total: 17 tables.** Manageable for a solo founder. Clean growth path for shared workspaces, audit logging, and additional workspace types.

---

*Document version: Phase 3 v1.0*
*Created: 2026-03-30*

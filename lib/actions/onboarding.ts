'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/actions/utils';
import type { WorkspaceType, Frequency } from '@/lib/types/database';

/**
 * Onboarding Server Actions.
 *
 * Phase 2 Section 8 — 5-step progressive onboarding:
 *   1. Display name
 *   2. Workspace type (Personal / Personal + Household)
 *   3. Income (amount, frequency, next pay date)
 *   4. Benefits (named UK types)
 *   5. Start mode (Demo data / Blank workspace)
 *
 * Phase 5 Section 11.6: onboarding_step tracks progress.
 * Each step updates profiles.onboarding_step.
 * Step 5 sets onboarding_completed = true.
 */

export async function updateOnboardingStep(
  step: number,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated.' };
  }

  switch (step) {
    case 1:
      return handleDisplayName(supabase, user.id, data);
    case 2:
      return handleWorkspaceType(supabase, user.id, data);
    case 3:
      return handleIncome(supabase, user.id, data);
    case 4:
      return handleBenefits(supabase, user.id, data);
    case 5:
      return handleStartMode(supabase, user.id, data);
    default:
      return { success: false, error: 'Invalid step.' };
  }
}

async function handleDisplayName(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const displayName = (data.displayName as string) || 'User';

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName, onboarding_step: 1 })
    .eq('id', userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

async function handleWorkspaceType(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const workspaceType = (data.workspaceType as WorkspaceType) || 'personal';
  const workspaceName = workspaceType === 'personal_household' ? 'Household' : 'My Finances';

  // Create workspace
  const { data: workspace, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name: workspaceName, type: workspaceType, owner_id: userId })
    .select('id')
    .single();

  if (wsError) return { success: false, error: wsError.message };

  // Create membership
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: workspace.id, user_id: userId, role: 'owner' });

  if (memberError) return { success: false, error: memberError.message };

  // Seed default categories
  await seedDefaultCategories(supabase, workspace.id, workspaceType);

  // Update onboarding step
  await supabase.from('profiles').update({ onboarding_step: 2 }).eq('id', userId);

  return { success: true, data: workspace.id };
}

async function handleIncome(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const workspaceId = data.workspaceId as string;

  if (data.amount && data.frequency && data.nextPayDate) {
    const { error } = await supabase.from('income_sources').insert({
      workspace_id: workspaceId,
      name: (data.name as string) || 'Salary',
      type: 'employment',
      amount: Number(data.amount),
      frequency: data.frequency as Frequency,
      next_pay_date: data.nextPayDate as string,
      is_active: true,
    });

    if (error) return { success: false, error: error.message };
  }

  await supabase.from('profiles').update({ onboarding_step: 3 }).eq('id', userId);

  return { success: true };
}

async function handleBenefits(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const workspaceId = data.workspaceId as string;
  const benefits = data.benefits as Array<{
    type: string;
    amount?: number;
    frequency?: string;
  }>;

  if (benefits && benefits.length > 0) {
    const rows = benefits
      .filter((b) => b.type)
      .map((b) => ({
        workspace_id: workspaceId,
        name: formatBenefitName(b.type),
        type: 'benefit' as const,
        benefit_type: b.type,
        amount: b.amount || 0,
        frequency: (b.frequency as Frequency) || 'monthly',
        next_pay_date: new Date().toISOString().split('T')[0],
        is_active: true,
      }));

    if (rows.length > 0) {
      const { error } = await supabase.from('income_sources').insert(rows);
      if (error) return { success: false, error: error.message };
    }
  }

  await supabase.from('profiles').update({ onboarding_step: 4 }).eq('id', userId);

  return { success: true };
}

async function handleStartMode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  const workspaceId = data.workspaceId as string;
  const mode = data.mode as 'demo' | 'blank';

  if (mode === 'demo') {
    await seedDemoData(supabase, workspaceId);
    await supabase.from('workspaces').update({ is_demo: true }).eq('id', workspaceId);
  }

  // Mark onboarding as complete
  await supabase
    .from('profiles')
    .update({
      onboarding_step: 5,
      onboarding_completed: true,
      preferences: { has_seen_tour: mode !== 'demo' },
    })
    .eq('id', userId);

  revalidatePath('/app', 'layout');
  redirect('/app/dashboard');
}

export async function skipOnboarding(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // Check if workspace already exists
  const { data: memberships } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1);

  let workspaceId: string;

  if (!memberships || memberships.length === 0) {
    // Create default workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .insert({ name: 'My Finances', type: 'personal', owner_id: user.id })
      .select('id')
      .single();

    if (!workspace) return;
    workspaceId = workspace.id;

    await supabase
      .from('workspace_members')
      .insert({ workspace_id: workspaceId, user_id: user.id, role: 'owner' });

    await seedDefaultCategories(supabase, workspaceId, 'personal');
  } else {
    workspaceId = memberships[0].workspace_id;
  }

  await supabase
    .from('profiles')
    .update({
      display_name: 'User',
      onboarding_step: 5,
      onboarding_completed: true,
      preferences: { has_seen_tour: false },
    })
    .eq('id', user.id);

  revalidatePath('/app', 'layout');
  redirect('/app/dashboard');
}

export async function clearDemoData(workspaceId: string): Promise<ActionResult> {
  const supabase = await createClient();

  // Delete in dependency order (children before parents)
  await supabase.from('goal_contributions').delete().eq('workspace_id', workspaceId);
  await supabase.from('goals').delete().eq('workspace_id', workspaceId);
  await supabase.from('debts').delete().eq('workspace_id', workspaceId);
  await supabase.from('budgets').delete().eq('workspace_id', workspaceId);
  await supabase.from('transactions').delete().eq('workspace_id', workspaceId);
  await supabase.from('bills').delete().eq('workspace_id', workspaceId);
  await supabase.from('income_sources').delete().eq('workspace_id', workspaceId);
  await supabase.from('accounts').delete().eq('workspace_id', workspaceId);

  // Mark workspace as non-demo
  await supabase.from('workspaces').update({ is_demo: false }).eq('id', workspaceId);

  revalidatePath('/app', 'layout');
  return { success: true };
}

// ── Helpers ──

/**
 * Seed default categories per workspace type.
 * Phase 5 Section 11.4 — Confirmed default categories.
 */
async function seedDefaultCategories(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
  workspaceType: WorkspaceType,
) {
  const personalExpense = [
    'Groceries',
    'Transport',
    'Eating Out',
    'Entertainment',
    'Shopping',
    'Health',
    'Utilities',
    'Rent/Mortgage',
    'Other',
  ];
  const personalIncome = ['Salary', 'Other Income'];
  const personalTransfer = ['Transfer'];

  const householdExtra = [
    'Childcare',
    'School',
    'Groceries — Household',
    'Home Maintenance',
    'Family Activities',
  ];

  const expenseCategories =
    workspaceType === 'personal_household'
      ? [...personalExpense, ...householdExtra]
      : personalExpense;

  const allCategories = [
    ...expenseCategories.map((name, i) => ({
      workspace_id: workspaceId,
      name,
      type: 'expense' as const,
      is_default: true,
      sort_order: i,
    })),
    ...personalIncome.map((name, i) => ({
      workspace_id: workspaceId,
      name,
      type: 'income' as const,
      is_default: true,
      sort_order: i,
    })),
    ...personalTransfer.map((name, i) => ({
      workspace_id: workspaceId,
      name,
      type: 'transfer' as const,
      is_default: true,
      sort_order: i,
    })),
  ];

  await supabase.from('categories').insert(allCategories);
}

/**
 * Seed demo data per Phase 2 Section 9.
 */
async function seedDemoData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  workspaceId: string,
) {
  // ── Accounts (3) ──
  const { data: accounts } = await supabase
    .from('accounts')
    .insert([
      { workspace_id: workspaceId, name: 'Barclays Current', type: 'current', balance: 1847.32 },
      { workspace_id: workspaceId, name: 'Nationwide Savings', type: 'savings', balance: 3200.0 },
      {
        workspace_id: workspaceId,
        name: 'Tesco Credit Card',
        type: 'credit_card',
        balance: -412.67,
      },
    ])
    .select('id, name');

  if (!accounts) return;

  const currentAccount = accounts.find((a) => a.name === 'Barclays Current')!;
  const creditCard = accounts.find((a) => a.name === 'Tesco Credit Card')!;

  // ── Income sources (2) ──
  await supabase.from('income_sources').insert([
    {
      workspace_id: workspaceId,
      name: 'Salary',
      type: 'employment',
      amount: 2400,
      frequency: 'monthly',
      next_pay_date: getNextDate(25),
      account_id: currentAccount.id,
    },
    {
      workspace_id: workspaceId,
      name: 'Child Benefit',
      type: 'benefit',
      benefit_type: 'child_benefit',
      amount: 96,
      frequency: 'four_weekly',
      next_pay_date: getNextDate(10),
      account_id: currentAccount.id,
    },
  ]);

  // ── Get categories for linking ──
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('workspace_id', workspaceId);

  const catMap = Object.fromEntries((categories || []).map((c) => [c.name, c.id]));

  // ── Bills (5) ──
  await supabase.from('bills').insert([
    {
      workspace_id: workspaceId,
      name: 'Rent',
      amount: 950,
      frequency: 'monthly',
      next_due_date: getNextDate(1),
      payment_method: 'standing_order',
      account_id: currentAccount.id,
      category_id: catMap['Rent/Mortgage'],
    },
    {
      workspace_id: workspaceId,
      name: 'Council Tax',
      amount: 145,
      frequency: 'monthly',
      next_due_date: getNextDate(15),
      payment_method: 'direct_debit',
      account_id: currentAccount.id,
      category_id: catMap['Utilities'],
    },
    {
      workspace_id: workspaceId,
      name: 'Energy',
      amount: 85,
      frequency: 'monthly',
      next_due_date: getNextDate(3),
      payment_method: 'direct_debit',
      account_id: currentAccount.id,
      category_id: catMap['Utilities'],
    },
    {
      workspace_id: workspaceId,
      name: 'Broadband',
      amount: 32,
      frequency: 'monthly',
      next_due_date: getNextDate(12),
      payment_method: 'direct_debit',
      account_id: currentAccount.id,
      category_id: catMap['Utilities'],
    },
    {
      workspace_id: workspaceId,
      name: 'Netflix',
      amount: 10.99,
      frequency: 'monthly',
      next_due_date: getNextDate(20),
      payment_method: 'card',
      account_id: currentAccount.id,
      category_id: catMap['Entertainment'],
      is_subscription: true,
    },
  ]);

  // ── Budgets (4) ──
  await supabase.from('budgets').insert([
    { workspace_id: workspaceId, category_id: catMap['Groceries'], amount: 300, period: 'monthly' },
    { workspace_id: workspaceId, category_id: catMap['Eating Out'], amount: 80, period: 'monthly' },
    { workspace_id: workspaceId, category_id: catMap['Transport'], amount: 100, period: 'monthly' },
    {
      workspace_id: workspaceId,
      category_id: catMap['Entertainment'],
      amount: 50,
      period: 'monthly',
    },
  ]);

  // ── Debt (1) ──
  const { data: debts } = await supabase
    .from('debts')
    .insert([
      {
        workspace_id: workspaceId,
        name: 'Tesco Credit Card',
        account_id: creditCard.id,
        balance: 412.67,
        minimum_payment: 25,
        interest_rate: 19.9,
        next_payment_date: getNextDate(5),
      },
    ])
    .select('id');

  // ── Goals (2) ──
  await supabase.from('goals').insert([
    {
      workspace_id: workspaceId,
      name: 'Holiday Fund',
      type: 'savings',
      target_amount: 1500,
      current_amount: 620,
      status: 'active',
    },
    {
      workspace_id: workspaceId,
      name: 'Pay off credit card',
      type: 'financial',
      target_amount: 412.67,
      current_amount: 0,
      debt_id: debts?.[0]?.id ?? null,
      status: 'active',
    },
  ]);

  // ── Transactions (~30 across last 2 months) ──
  const today = new Date();
  const txns = generateDemoTransactions(
    workspaceId,
    currentAccount.id,
    creditCard.id,
    catMap,
    today,
  );
  if (txns.length > 0) {
    await supabase.from('transactions').insert(txns);
  }
}

function generateDemoTransactions(
  workspaceId: string,
  currentAccountId: string,
  creditCardId: string,
  catMap: Record<string, string>,
  today: Date,
) {
  const txns: Array<Record<string, unknown>> = [];
  const daysAgo = (d: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    return date.toISOString().split('T')[0];
  };

  // Recent groceries
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 67.42,
      description: 'Tesco',
      date: daysAgo(2),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 34.18,
      description: "Sainsbury's",
      date: daysAgo(6),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 28.9,
      description: 'Aldi',
      date: daysAgo(12),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 52.15,
      description: 'Tesco',
      date: daysAgo(18),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 41.3,
      description: "Sainsbury's",
      date: daysAgo(25),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Groceries'],
      type: 'expense',
      amount: 55.8,
      description: 'Tesco',
      date: daysAgo(35),
    },
  );

  // Transport
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Transport'],
      type: 'expense',
      amount: 45.0,
      description: 'TfL Oyster top-up',
      date: daysAgo(3),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Transport'],
      type: 'expense',
      amount: 58.2,
      description: 'Fuel',
      date: daysAgo(14),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Transport'],
      type: 'expense',
      amount: 45.0,
      description: 'TfL Oyster top-up',
      date: daysAgo(33),
    },
  );

  // Eating out
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: creditCardId,
      category_id: catMap['Eating Out'],
      type: 'expense',
      amount: 24.5,
      description: "Nando's",
      date: daysAgo(4),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Eating Out'],
      type: 'expense',
      amount: 6.8,
      description: 'Greggs',
      date: daysAgo(8),
    },
    {
      workspace_id: workspaceId,
      account_id: creditCardId,
      category_id: catMap['Eating Out'],
      type: 'expense',
      amount: 32.0,
      description: 'Local pub',
      date: daysAgo(15),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Eating Out'],
      type: 'expense',
      amount: 4.5,
      description: 'Greggs',
      date: daysAgo(22),
    },
  );

  // Entertainment
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: creditCardId,
      category_id: catMap['Entertainment'],
      type: 'expense',
      amount: 10.99,
      description: 'Netflix',
      date: daysAgo(10),
      is_recurring: true,
    },
    {
      workspace_id: workspaceId,
      account_id: creditCardId,
      category_id: catMap['Entertainment'],
      type: 'expense',
      amount: 10.99,
      description: 'Spotify',
      date: daysAgo(11),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Entertainment'],
      type: 'expense',
      amount: 14.0,
      description: 'Cinema',
      date: daysAgo(20),
    },
  );

  // Bills (as transactions)
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Rent/Mortgage'],
      type: 'expense',
      amount: 950.0,
      description: 'Rent',
      date: daysAgo(28),
      is_recurring: true,
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Utilities'],
      type: 'expense',
      amount: 145.0,
      description: 'Council Tax',
      date: daysAgo(15),
      is_recurring: true,
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Utilities'],
      type: 'expense',
      amount: 85.0,
      description: 'Energy',
      date: daysAgo(27),
      is_recurring: true,
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Utilities'],
      type: 'expense',
      amount: 32.0,
      description: 'Broadband',
      date: daysAgo(18),
      is_recurring: true,
    },
  );

  // Health
  txns.push({
    workspace_id: workspaceId,
    account_id: currentAccountId,
    category_id: catMap['Health'],
    type: 'expense',
    amount: 8.5,
    description: 'Pharmacy',
    date: daysAgo(9),
  });

  // Shopping
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: creditCardId,
      category_id: catMap['Shopping'],
      type: 'expense',
      amount: 29.99,
      description: 'Amazon',
      date: daysAgo(7),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Shopping'],
      type: 'expense',
      amount: 15.0,
      description: 'Primark',
      date: daysAgo(21),
    },
  );

  // Income
  txns.push(
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Salary'],
      type: 'income',
      amount: 2400.0,
      description: 'Salary',
      date: daysAgo(5),
    },
    {
      workspace_id: workspaceId,
      account_id: currentAccountId,
      category_id: catMap['Salary'],
      type: 'income',
      amount: 2400.0,
      description: 'Salary',
      date: daysAgo(35),
    },
  );

  // Transfer
  txns.push({
    workspace_id: workspaceId,
    account_id: currentAccountId,
    category_id: catMap['Transfer'],
    type: 'transfer',
    amount: 200.0,
    description: 'To savings',
    date: daysAgo(4),
  });

  return txns;
}

function getNextDate(dayOfMonth: number): string {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
  if (target <= now) {
    target.setMonth(target.getMonth() + 1);
  }
  return target.toISOString().split('T')[0];
}

function formatBenefitName(type: string): string {
  const names: Record<string, string> = {
    universal_credit: 'Universal Credit',
    pip: 'PIP',
    child_benefit: 'Child Benefit',
    carers_allowance: "Carer's Allowance",
    esa: 'ESA',
    housing_benefit: 'Housing Benefit',
    council_tax_reduction: 'Council Tax Reduction',
    other: 'Other Benefits',
  };
  return names[type] || type;
}

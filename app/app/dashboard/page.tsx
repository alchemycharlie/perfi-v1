import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/app/dashboard-content';

/**
 * Dashboard page — Server Component.
 * Phase 4 Section 11: "Where am I financially right now?"
 * Fetches all data needed for the dashboard summary cards.
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, preferences')
    .eq('id', user.id)
    .single();

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const workspaceId = membership?.workspace_id;

  const { data: workspace } = workspaceId
    ? await supabase.from('workspaces').select('id, name, is_demo').eq('id', workspaceId).single()
    : { data: null };

  if (!workspaceId) {
    return (
      <DashboardContent
        displayName={profile?.display_name || 'User'}
        workspace={null}
        accounts={[]}
        recentTransactions={[]}
        upcomingBills={[]}
        budgetSummary={[]}
        goals={[]}
        nextPayDay={null}
        hasSeenTour={false}
        userId={user.id}
      />
    );
  }

  // Fetch all dashboard data in parallel
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const [
    accountsResult,
    rawTxnResult,
    billsResult,
    budgetsResult,
    monthTxnResult,
    goalsResult,
    incomeResult,
  ] = await Promise.all([
    supabase
      .from('accounts')
      .select('id, name, type, balance, is_active')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('transactions')
      .select('id, description, amount, type, date, category:categories(name, colour)')
      .eq('workspace_id', workspaceId)
      .order('date', { ascending: false })
      .limit(5),
    supabase
      .from('bills')
      .select('id, name, amount, next_due_date')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('next_due_date')
      .limit(5),
    supabase
      .from('budgets')
      .select('id, amount, category:categories(id, name, colour)')
      .eq('workspace_id', workspaceId),
    supabase
      .from('transactions')
      .select('category_id, amount')
      .eq('workspace_id', workspaceId)
      .eq('type', 'expense')
      .gte('date', monthStart)
      .lte('date', monthEnd),
    supabase
      .from('goals')
      .select('id, name, type, target_amount, current_amount, status')
      .eq('workspace_id', workspaceId)
      .eq('status', 'active')
      .limit(4),
    supabase
      .from('income_sources')
      .select('name, next_pay_date')
      .eq('workspace_id', workspaceId)
      .eq('is_active', true)
      .order('next_pay_date')
      .limit(1),
  ]);

  // Normalize transactions
  const recentTransactions = (rawTxnResult.data || []).map((txn) => ({
    ...txn,
    category: Array.isArray(txn.category) ? txn.category[0] || null : txn.category,
  })) as Array<{
    id: string;
    description: string;
    amount: number;
    type: string;
    date: string;
    category: { name: string; colour: string | null } | null;
  }>;

  // Calculate budget spent per category
  const spentByCategory = new Map<string, number>();
  for (const txn of monthTxnResult.data || []) {
    if (txn.category_id) {
      spentByCategory.set(
        txn.category_id,
        (spentByCategory.get(txn.category_id) || 0) + txn.amount,
      );
    }
  }

  const budgetSummary = (budgetsResult.data || []).map((b) => {
    const cat = Array.isArray(b.category) ? b.category[0] : b.category;
    return {
      id: b.id,
      amount: b.amount,
      category_name: cat?.name || 'Unknown',
      category_colour: cat?.colour || null,
      spent: spentByCategory.get(cat?.id || '') || 0,
    };
  });

  // Next pay day
  const nextIncome = incomeResult.data?.[0];
  const nextPayDay = nextIncome ? { name: nextIncome.name, date: nextIncome.next_pay_date } : null;

  const hasSeenTour = (profile?.preferences as Record<string, unknown>)?.has_seen_tour === true;

  return (
    <DashboardContent
      displayName={profile?.display_name || 'User'}
      workspace={workspace}
      accounts={accountsResult.data || []}
      recentTransactions={recentTransactions}
      upcomingBills={billsResult.data || []}
      budgetSummary={budgetSummary}
      goals={
        (goalsResult.data || []) as Array<{
          id: string;
          name: string;
          type: string;
          target_amount: number;
          current_amount: number;
          status: string;
        }>
      }
      nextPayDay={nextPayDay}
      hasSeenTour={hasSeenTour}
      userId={user.id}
    />
  );
}

import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/app/dashboard-content';

/**
 * Dashboard page — Server Component that fetches data and passes to client.
 * Renders different states:
 * - Demo workspace: shows demo data with tour trigger
 * - Blank workspace: shows empty states with CTAs
 * - Active workspace: shows real financial data (Phase C+)
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, preferences')
    .eq('id', user.id)
    .single();

  // Fetch workspace membership
  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const workspaceId = membership?.workspace_id;

  // Fetch workspace details
  const { data: workspace } = workspaceId
    ? await supabase.from('workspaces').select('id, name, is_demo').eq('id', workspaceId).single()
    : { data: null };

  // Fetch accounts summary
  const { data: accounts } = workspaceId
    ? await supabase
        .from('accounts')
        .select('id, name, type, balance, is_active')
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('sort_order')
    : { data: null };

  // Fetch recent transactions
  const { data: rawTransactions } = workspaceId
    ? await supabase
        .from('transactions')
        .select('id, description, amount, type, date, category:categories(name, colour)')
        .eq('workspace_id', workspaceId)
        .order('date', { ascending: false })
        .limit(5)
    : { data: null };

  // Normalize the joined category from Supabase's format
  const recentTransactions = (rawTransactions || []).map((txn) => ({
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

  // Fetch upcoming bills
  const { data: upcomingBills } = workspaceId
    ? await supabase
        .from('bills')
        .select('id, name, amount, next_due_date')
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('next_due_date')
        .limit(5)
    : { data: null };

  const hasSeenTour = (profile?.preferences as Record<string, unknown>)?.has_seen_tour === true;

  return (
    <DashboardContent
      displayName={profile?.display_name || 'User'}
      workspace={workspace}
      accounts={accounts || []}
      recentTransactions={recentTransactions || []}
      upcomingBills={upcomingBills || []}
      hasSeenTour={hasSeenTour}
      userId={user.id}
    />
  );
}

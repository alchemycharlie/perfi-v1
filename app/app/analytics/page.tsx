import { createClient } from '@/lib/supabase/server';
import { AnalyticsContent } from '@/components/app/analytics/analytics-content';

/**
 * Analytics page — Server Component.
 * Phase 4 Section 17.16:
 *   Free: spending by category (donut)
 *   Pro: + trends, income vs expenses, net worth
 */
export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (!membership) return null;
  const workspaceId = membership.workspace_id;

  // Fetch subscription to check plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();

  const isPro = subscription?.plan === 'pro';

  // Get transactions for last 6 months for trend data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const sixMonthsAgoStr = sixMonthsAgo.toISOString().split('T')[0];

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, type, date, category:categories(name, colour)')
    .eq('workspace_id', workspaceId)
    .gte('date', sixMonthsAgoStr)
    .order('date');

  const normalizedTxns = (transactions || []).map((t) => ({
    ...t,
    category: Array.isArray(t.category) ? t.category[0] || null : t.category,
  })) as Array<{
    amount: number;
    type: string;
    date: string;
    category: { name: string; colour: string | null } | null;
  }>;

  // Total balance for net worth
  const { data: accounts } = await supabase
    .from('accounts')
    .select('balance')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true);

  const netWorth = (accounts || []).reduce((s, a) => s + a.balance, 0);

  return <AnalyticsContent transactions={normalizedTxns} netWorth={netWorth} isPro={isPro} />;
}

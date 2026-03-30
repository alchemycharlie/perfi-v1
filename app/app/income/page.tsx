import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/shared/empty-state';
import { AddIncomeSourceDialog } from '@/components/app/income/add-income-dialog';
import { IncomeCard } from '@/components/app/income/income-card';

export default async function IncomePage() {
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

  const { data: sources } = await supabase
    .from('income_sources')
    .select('*, account:accounts(name)')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('created_at');

  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name');

  const sourceList = (sources || []).map((s) => ({
    ...s,
    account: Array.isArray(s.account) ? s.account[0] || null : s.account,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Income</h1>
        <AddIncomeSourceDialog workspaceId={workspaceId} accounts={accounts || []} />
      </div>

      {sourceList.length === 0 ? (
        <EmptyState
          title="No income sources"
          description="Add your employment income, benefits, or other income to see your full financial picture."
        />
      ) : (
        <div className="space-y-4">
          {sourceList.map((source) => (
            <IncomeCard
              key={source.id}
              source={{
                id: source.id,
                name: source.name,
                type: source.type,
                benefit_type: source.benefit_type,
                amount: source.amount,
                frequency: source.frequency,
                next_pay_date: source.next_pay_date,
                account_id: source.account_id,
                account: source.account as { name: string } | null,
              }}
              accounts={accounts || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

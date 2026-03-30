import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { DebtCard } from '@/components/app/debts/debt-card';

export default async function DebtPage() {
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

  const { data: debts } = await supabase
    .from('debts')
    .select('*, account:accounts(name)')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('created_at');

  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true);

  const { data: goals } = await supabase
    .from('goals')
    .select('id, name, debt_id')
    .eq('workspace_id', workspaceId)
    .eq('status', 'active');

  const debtList = (debts || []).map((d) => ({
    ...d,
    account: Array.isArray(d.account) ? d.account[0] || null : d.account,
    linked_goal: (goals || []).find((g) => g.debt_id === d.id),
  }));

  const totalDebt = debtList.reduce((s, d) => s + d.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Debt</h1>
          {debtList.length > 0 && (
            <p className="mt-1 text-sm text-text-secondary">
              Total outstanding: {formatCurrency(totalDebt)}
            </p>
          )}
        </div>
      </div>

      {debtList.length === 0 ? (
        <EmptyState
          title="No debts tracked"
          description="If you have credit cards, loans, or other debts, tracking them helps you plan payoff."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {debtList.map((debt) => (
            <DebtCard
              key={debt.id}
              debt={{
                id: debt.id,
                name: debt.name,
                balance: debt.balance,
                minimum_payment: debt.minimum_payment,
                interest_rate: debt.interest_rate,
                next_payment_date: debt.next_payment_date,
                account_id: debt.account_id,
                account: debt.account as { name: string } | null,
                linked_goal: debt.linked_goal || null,
              }}
              accounts={accounts || []}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

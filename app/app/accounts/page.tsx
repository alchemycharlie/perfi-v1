import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { AddAccountDialog } from '@/components/app/accounts/add-account-dialog';

const typeLabels: Record<string, string> = {
  current: 'Current account',
  savings: 'Savings',
  credit_card: 'Credit card',
  cash: 'Cash',
  investments: 'Investments',
};

export default async function AccountsPage() {
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

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('sort_order');

  const accountList = accounts || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Accounts</h1>
        <AddAccountDialog workspaceId={workspaceId} />
      </div>

      {accountList.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          description="Accounts help you track your balances. Add a current account, savings, credit card, or cash."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accountList.map((account) => (
            <Link
              key={account.id}
              href={`/app/accounts/${account.id}`}
              className="group rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 transition-colors hover:border-accent/30"
            >
              <p className="text-sm text-text-secondary">
                {typeLabels[account.type] || account.type}
              </p>
              <p className="mt-1 text-base font-semibold text-text-primary">{account.name}</p>
              <p className="mt-2 text-xl font-semibold tabular-nums text-text-primary">
                {formatCurrency(account.balance)}
              </p>
              {!account.is_active && (
                <span className="mt-2 inline-block rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-muted">
                  Archived
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { DeleteAccountButton } from '@/components/app/accounts/delete-account-button';

const typeLabels: Record<string, string> = {
  current: 'Current account',
  savings: 'Savings',
  credit_card: 'Credit card',
  cash: 'Cash',
  investments: 'Investments',
};

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: account } = await supabase.from('accounts').select('*').eq('id', id).single();

  if (!account) notFound();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, description, amount, type, date, category:categories(name, colour)')
    .eq('account_id', id)
    .order('date', { ascending: false })
    .limit(50);

  const txnList = (transactions || []).map((txn) => ({
    ...txn,
    category: Array.isArray(txn.category) ? txn.category[0] || null : txn.category,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/app/accounts"
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          &larr; Accounts
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{typeLabels[account.type] || account.type}</p>
          <h1 className="text-2xl font-semibold text-text-primary">{account.name}</h1>
          <p className="mt-1 text-3xl font-bold tabular-nums text-text-primary">
            {formatCurrency(account.balance)}
          </p>
        </div>
        <DeleteAccountButton accountId={account.id} accountName={account.name} />
      </div>

      {/* Transactions for this account */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary">Transactions</h2>
        {txnList.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No transactions for this account yet.</p>
        ) : (
          <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
            {txnList.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">{txn.description}</p>
                  <p className="text-xs text-text-muted">
                    {(txn.category as { name: string } | null)?.name || 'Uncategorised'} &middot;{' '}
                    {txn.date}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium tabular-nums ${
                    txn.type === 'income' ? 'text-success' : 'text-text-primary'
                  }`}
                >
                  {txn.type === 'income' ? '+' : '-'}
                  {formatCurrency(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

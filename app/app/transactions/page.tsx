import { createClient } from '@/lib/supabase/server';
import { EmptyState } from '@/components/shared/empty-state';
import { TransactionList } from '@/components/app/transactions/transaction-list';
import { QuickAddTransaction } from '@/components/app/transactions/quick-add-transaction';

export default async function TransactionsPage() {
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

  const { data: rawTransactions } = await supabase
    .from('transactions')
    .select(
      'id, description, amount, type, date, notes, account:accounts(id, name), category:categories(id, name, colour)',
    )
    .eq('workspace_id', workspaceId)
    .order('date', { ascending: false })
    .limit(100);

  const transactions = (rawTransactions || []).map((t) => ({
    ...t,
    account: Array.isArray(t.account) ? t.account[0] || null : t.account,
    category: Array.isArray(t.category) ? t.category[0] || null : t.category,
  }));

  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('workspace_id', workspaceId)
    .order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Transactions</h1>
        <QuickAddTransaction
          workspaceId={workspaceId}
          accounts={accounts || []}
          categories={categories || []}
        />
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Start logging your spending and income. It only takes a few seconds."
        />
      ) : (
        <TransactionList
          transactions={transactions}
          workspaceId={workspaceId}
          accounts={accounts || []}
          categories={categories || []}
        />
      )}
    </div>
  );
}

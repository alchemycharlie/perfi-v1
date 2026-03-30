import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { BudgetsList } from '@/components/app/budgets/budgets-list';

/**
 * Budgets page — Server Component.
 * Phase 5 Section 3: Budget spent = SUM(transactions) for category in current month.
 */
export default async function BudgetsPage() {
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

  // Get budgets with category info
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, amount, period, category:categories(id, name, colour)')
    .eq('workspace_id', workspaceId)
    .order('created_at');

  // Get expense transactions for current month to calculate spent
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: transactions } = await supabase
    .from('transactions')
    .select('category_id, amount')
    .eq('workspace_id', workspaceId)
    .eq('type', 'expense')
    .gte('date', monthStart)
    .lte('date', monthEnd);

  // Sum spent per category
  const spentByCategory = new Map<string, number>();
  for (const txn of transactions || []) {
    if (txn.category_id) {
      spentByCategory.set(
        txn.category_id,
        (spentByCategory.get(txn.category_id) || 0) + txn.amount,
      );
    }
  }

  // Get expense categories for the "add budget" form
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('type', 'expense')
    .order('sort_order');

  const budgetList = (budgets || []).map((b) => {
    const cat = Array.isArray(b.category) ? b.category[0] : b.category;
    return {
      id: b.id,
      amount: b.amount,
      category_id: cat?.id || '',
      category_name: cat?.name || 'Unknown',
      category_colour: cat?.colour || null,
      spent: spentByCategory.get(cat?.id || '') || 0,
    };
  });

  const totalBudget = budgetList.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgetList.reduce((s, b) => s + b.spent, 0);

  const monthLabel = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Budgets</h1>
          <p className="mt-1 text-sm text-text-secondary">{monthLabel}</p>
        </div>
      </div>

      {budgetList.length > 0 && (
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">Total budgeted</p>
            <p className="text-sm font-medium tabular-nums text-text-primary">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </p>
          </div>
        </div>
      )}

      {budgetList.length === 0 ? (
        <EmptyState
          title="No budgets set"
          description="Budgets help you control spending by category. Set a monthly limit and see how you're tracking."
        />
      ) : null}

      <BudgetsList budgets={budgetList} workspaceId={workspaceId} categories={categories || []} />
    </div>
  );
}

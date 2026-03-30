import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils/currency';
import { EmptyState } from '@/components/shared/empty-state';
import { AddBillDialog } from '@/components/app/bills/add-bill-dialog';
import { BillRow } from '@/components/app/bills/bill-row';

const paymentMethodLabels: Record<string, string> = {
  direct_debit: 'Direct debit',
  standing_order: 'Standing order',
  card: 'Card',
  manual: 'Manual',
};

export default async function BillsPage() {
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

  const { data: bills } = await supabase
    .from('bills')
    .select('*, account:accounts(name), category:categories(name)')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('next_due_date');

  const { data: accounts } = await supabase
    .from('accounts')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('is_active', true)
    .order('name');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .eq('type', 'expense')
    .order('sort_order');

  const billList = (bills || []).map((b) => ({
    ...b,
    account: Array.isArray(b.account) ? b.account[0] || null : b.account,
    category: Array.isArray(b.category) ? b.category[0] || null : b.category,
  }));

  // Split into upcoming (next 14 days) and all
  const now = new Date();
  const in14Days = new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0];
  const upcoming = billList.filter((b) => b.next_due_date <= in14Days);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Bills &amp; Subscriptions</h1>
        <AddBillDialog
          workspaceId={workspaceId}
          accounts={accounts || []}
          categories={categories || []}
        />
      </div>

      {billList.length === 0 ? (
        <EmptyState
          title="No bills tracked"
          description="Track your recurring bills and subscriptions so you never miss a payment."
        />
      ) : (
        <>
          {/* Upcoming bills */}
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-text-primary">Upcoming (next 14 days)</h2>
              <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
                {upcoming.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text-primary">{bill.name}</p>
                        {bill.is_subscription && (
                          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                            Sub
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted">
                        {bill.next_due_date} &middot; {paymentMethodLabels[bill.payment_method]}
                      </p>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-text-primary">
                      {formatCurrency(bill.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All bills */}
          <section>
            <h2 className="text-sm font-semibold text-text-primary">All bills</h2>
            <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
              {billList.map((bill) => (
                <BillRow
                  key={bill.id}
                  bill={{
                    id: bill.id,
                    name: bill.name,
                    amount: bill.amount,
                    frequency: bill.frequency,
                    next_due_date: bill.next_due_date,
                    payment_method: bill.payment_method,
                    account_id: bill.account_id,
                    category_id: bill.category_id,
                    is_subscription: bill.is_subscription,
                    notes: bill.notes,
                    account: bill.account as { name: string } | null,
                  }}
                  accounts={accounts || []}
                  categories={categories || []}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default async function AdminSubscriptionsPage() {
  const supabase = createAdminClient();

  const { data: subs } = await supabase
    .from('subscriptions')
    .select(
      'id, user_id, plan, status, current_period_end, cancel_at_period_end, user:profiles(display_name)',
    )
    .order('created_at', { ascending: false })
    .limit(200);

  const subList = (subs || []).map((s) => ({
    ...s,
    user: Array.isArray(s.user) ? s.user[0] : s.user,
  }));

  const activeCount = subList.filter((s) => s.plan === 'pro' && s.status === 'active').length;
  const mrr = activeCount * 4.99;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Subscriptions</h1>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>{activeCount} active Pro</span>
          <span>MRR: {formatCurrency(mrr)}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-bg-primary">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">User</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Plan</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Period End</th>
            </tr>
          </thead>
          <tbody>
            {subList.map((sub) => (
              <tr key={sub.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-text-primary">
                  {(sub.user as { display_name: string })?.display_name || 'Unnamed'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      sub.plan === 'pro'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-bg-tertiary text-text-muted'
                    }`}
                  >
                    {sub.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {sub.status}
                  {sub.cancel_at_period_end && ' (cancelling)'}
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {sub.current_period_end
                    ? new Date(sub.current_period_end).toLocaleDateString('en-GB')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

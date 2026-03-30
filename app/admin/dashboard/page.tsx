import { createAdminClient } from '@/lib/supabase/admin';
import { formatCurrency } from '@/lib/utils/currency';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createAdminClient();

  const [usersResult, waitlistResult, subsResult, recentResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('waitlist_entries').select('id', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('plan').eq('status', 'active'),
    supabase
      .from('profiles')
      .select('id, display_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const totalUsers = usersResult.count || 0;
  const waitlistSize = waitlistResult.count || 0;
  const proCount = (subsResult.data || []).filter((s) => s.plan === 'pro').length;
  const mrr = proCount * 4.99;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={String(totalUsers)} />
        <StatCard title="Waitlist" value={String(waitlistSize)} />
        <StatCard title="Pro Subscribers" value={String(proCount)} />
        <StatCard title="MRR" value={formatCurrency(mrr)} />
      </div>

      <section>
        <h2 className="text-sm font-semibold text-text-primary">Recent Signups</h2>
        {(recentResult.data || []).length > 0 ? (
          <div className="mt-3 divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-bg-primary">
            {(recentResult.data || []).map((user) => (
              <div key={user.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {user.display_name || 'Unnamed'}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-muted">No users yet.</p>
        )}
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
    </div>
  );
}

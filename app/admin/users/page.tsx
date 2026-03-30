import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminUsersPage() {
  const supabase = createAdminClient();

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, role, is_disabled, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('user_id, plan, status');

  const subMap = new Map((subscriptions || []).map((s) => [s.user_id, s]));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Users</h1>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-bg-primary">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Name</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Plan</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Role</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(profiles || []).map((user) => {
              const sub = subMap.get(user.id);
              return (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0 hover:bg-bg-secondary"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-medium text-accent hover:text-accent-hover"
                    >
                      {user.display_name || 'Unnamed'}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{sub?.plan || 'free'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        user.is_disabled ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {user.is_disabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{user.role}</td>
                  <td className="px-4 py-3 text-text-muted">
                    {new Date(user.created_at).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

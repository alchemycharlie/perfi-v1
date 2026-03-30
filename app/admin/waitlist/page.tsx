import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminWaitlistPage() {
  const supabase = createAdminClient();

  const { data: entries } = await supabase
    .from('waitlist_entries')
    .select('id, email, interests, status, created_at, invited_at')
    .order('created_at', { ascending: false })
    .limit(200);

  const entryList = entries || [];
  const pending = entryList.filter((e) => e.status === 'pending').length;
  const invited = entryList.filter((e) => e.status === 'invited').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Waitlist</h1>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>{entryList.length} total</span>
          <span>{pending} pending</span>
          <span>{invited} invited</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-bg-primary">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-secondary text-left">
              <th className="px-4 py-3 font-medium text-text-secondary">Email</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Interests</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Status</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Joined</th>
            </tr>
          </thead>
          <tbody>
            {entryList.map((entry) => (
              <tr key={entry.id} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3 text-text-primary">{entry.email}</td>
                <td className="px-4 py-3 text-text-muted">{entry.interests?.join(', ') || '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      entry.status === 'pending'
                        ? 'bg-warning/10 text-warning'
                        : entry.status === 'invited'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-bg-tertiary text-text-muted'
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(entry.created_at).toLocaleDateString('en-GB')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entryList.length === 0 && (
        <p className="text-center text-sm text-text-muted">No waitlist entries yet.</p>
      )}
    </div>
  );
}

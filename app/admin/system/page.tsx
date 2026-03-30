import { createAdminClient } from '@/lib/supabase/admin';
import { FeatureFlagToggle } from '@/components/admin/feature-flag-toggle';

export default async function AdminSystemPage() {
  const supabase = createAdminClient();

  const { data: flags } = await supabase
    .from('feature_flags')
    .select('id, key, value, updated_at')
    .order('key');

  const flagList = flags || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">System</h1>

      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
        <h2 className="text-sm font-semibold text-text-primary">Feature Flags</h2>
        {flagList.length > 0 ? (
          <div className="mt-3 space-y-3">
            {flagList.map((flag) => (
              <FeatureFlagToggle
                key={flag.id}
                flagId={flag.id}
                flagKey={flag.key}
                value={flag.value === true || flag.value === 'true'}
                updatedAt={flag.updated_at}
              />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-text-muted">
              No feature flags configured. Add flags directly in the database (e.g.
              maintenance_mode, signups_enabled).
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
        <h2 className="text-sm font-semibold text-text-primary">System Info</h2>
        <div className="mt-3 space-y-1 text-sm text-text-secondary">
          <p>Framework: Next.js (App Router)</p>
          <p>Database: Supabase (Postgres + RLS)</p>
          <p>Payments: Stripe</p>
          <p>Hosting: Vercel</p>
        </div>
      </section>
    </div>
  );
}

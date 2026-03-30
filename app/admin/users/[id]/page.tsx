import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { AdminUserActions } from '@/components/admin/user-actions';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, role, is_disabled, onboarding_completed, created_at')
    .eq('id', id)
    .single();

  if (!profile) notFound();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end, cancel_at_period_end')
    .eq('user_id', id)
    .single();

  const { data: workspaces } = await supabase
    .from('workspace_members')
    .select('workspace:workspaces(name, type)')
    .eq('user_id', id);

  const { data: notes } = await supabase
    .from('admin_notes')
    .select('id, content, created_at, author:profiles!admin_notes_author_id_fkey(display_name)')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="text-sm text-text-muted hover:text-text-secondary">
        &larr; Users
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            {profile.display_name || 'Unnamed'}
          </h1>
          <p className="text-sm text-text-muted">
            {profile.role} &middot; Joined{' '}
            {new Date(profile.created_at).toLocaleDateString('en-GB')}
          </p>
        </div>
        <AdminUserActions userId={profile.id} isDisabled={profile.is_disabled} />
      </div>

      {/* Subscription */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
        <h2 className="text-sm font-semibold text-text-primary">Subscription</h2>
        <div className="mt-2 space-y-1 text-sm text-text-secondary">
          <p>Plan: {subscription?.plan || 'free'}</p>
          <p>Status: {subscription?.status || 'active'}</p>
          {subscription?.current_period_end && (
            <p>
              Period ends: {new Date(subscription.current_period_end).toLocaleDateString('en-GB')}
            </p>
          )}
          {subscription?.cancel_at_period_end && (
            <p className="text-warning">Cancelling at period end</p>
          )}
        </div>
      </section>

      {/* Workspaces */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
        <h2 className="text-sm font-semibold text-text-primary">
          Workspaces ({(workspaces || []).length})
        </h2>
        {(workspaces || []).length > 0 ? (
          <ul className="mt-2 space-y-1 text-sm text-text-secondary">
            {(workspaces || []).map((wm, i) => {
              const ws = Array.isArray(wm.workspace) ? wm.workspace[0] : wm.workspace;
              return (
                <li key={i}>
                  {(ws as { name: string })?.name || 'Unknown'} ({(ws as { type: string })?.type})
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-text-muted">No workspaces.</p>
        )}
      </section>

      {/* Admin Notes */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
        <h2 className="text-sm font-semibold text-text-primary">Admin Notes</h2>
        {(notes || []).length > 0 ? (
          <div className="mt-3 space-y-3">
            {(notes || []).map((note) => {
              const author = Array.isArray(note.author) ? note.author[0] : note.author;
              return (
                <div key={note.id} className="rounded-[var(--radius-md)] bg-bg-secondary p-3">
                  <p className="text-sm text-text-primary">{note.content}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {(author as { display_name: string })?.display_name || 'Admin'} &middot;{' '}
                    {new Date(note.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 text-sm text-text-muted">No notes.</p>
        )}
      </section>
    </div>
  );
}

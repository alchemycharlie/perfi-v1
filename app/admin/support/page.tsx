import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  const supabase = createAdminClient();

  const { data: contacts } = await supabase
    .from('contact_submissions')
    .select('id, name, email, message, status, admin_notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const { data: notes } = await supabase
    .from('admin_notes')
    .select(
      'id, content, created_at, user:profiles!admin_notes_user_id_fkey(display_name), author:profiles!admin_notes_author_id_fkey(display_name)',
    )
    .order('created_at', { ascending: false })
    .limit(50);

  const contactList = contacts || [];
  const noteList = (notes || []).map((n) => ({
    ...n,
    user: Array.isArray(n.user) ? n.user[0] : n.user,
    author: Array.isArray(n.author) ? n.author[0] : n.author,
  }));

  const newContacts = contactList.filter((c) => c.status === 'new').length;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-text-primary">Support</h1>

      {/* Contact submissions */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary">
          Contact Submissions ({newContacts} new)
        </h2>
        {contactList.length > 0 ? (
          <div className="mt-3 space-y-3">
            {contactList.map((c) => (
              <div
                key={c.id}
                className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{c.name}</p>
                    <p className="text-xs text-text-muted">
                      {c.email} &middot; {new Date(c.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      c.status === 'new'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-bg-tertiary text-text-muted'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{c.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-muted">No contact submissions yet.</p>
        )}
      </section>

      {/* Recent admin notes */}
      <section>
        <h2 className="text-sm font-semibold text-text-primary">Recent Admin Notes</h2>
        {noteList.length > 0 ? (
          <div className="mt-3 space-y-3">
            {noteList.map((n) => (
              <div key={n.id} className="rounded-[var(--radius-md)] bg-bg-secondary p-3">
                <p className="text-sm text-text-primary">{n.content}</p>
                <p className="mt-1 text-xs text-text-muted">
                  About: {(n.user as { display_name: string })?.display_name || 'Unknown'} &middot;
                  By: {(n.author as { display_name: string })?.display_name || 'Admin'} &middot;
                  {new Date(n.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-text-muted">No admin notes yet.</p>
        )}
      </section>
    </div>
  );
}

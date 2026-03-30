'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/lib/actions/auth';

interface SettingsContentProps {
  userId: string;
  email: string;
  displayName: string;
  workspaceName: string;
  workspaceType: string;
  preferences: Record<string, unknown>;
}

export function SettingsContent({
  userId,
  email,
  displayName,
  workspaceName,
  workspaceType,
  preferences,
}: SettingsContentProps) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ display_name: name }).eq('id', userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleReplayTour() {
    const supabase = createClient();
    await supabase
      .from('profiles')
      .update({ preferences: { ...preferences, has_seen_tour: false } })
      .eq('id', userId);
    router.push('/app/dashboard');
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    // Delete via Supabase Auth (cascades through profiles → workspaces → all data)
    const supabase = createClient();
    await supabase.auth.admin.deleteUser(userId);
    await signOut();
  }

  return (
    <div className="max-w-xl space-y-8">
      {/* Profile */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 space-y-4">
        <h2 className="text-sm font-semibold text-text-primary">Profile</h2>
        <div>
          <label className="block text-sm font-medium text-text-primary">Display name</label>
          <div className="mt-1 flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
            <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary">Email</label>
          <p className="mt-1 text-sm text-text-secondary">{email}</p>
        </div>
      </section>

      {/* Workspace */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Workspace</h2>
        <div>
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{workspaceName}</span> (
            {workspaceType === 'personal_household' ? 'Personal + Household' : 'Personal'})
          </p>
        </div>
      </section>

      {/* Tour */}
      <section className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4 space-y-3">
        <h2 className="text-sm font-semibold text-text-primary">Help</h2>
        <button
          onClick={handleReplayTour}
          className="text-sm text-accent hover:text-accent-hover transition-colors"
        >
          Replay the PerFi tour
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-[var(--radius-lg)] border border-danger/20 bg-danger/5 p-4 space-y-4">
        <h2 className="text-sm font-semibold text-danger">Danger zone</h2>
        <p className="text-sm text-text-secondary">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-xs text-text-muted">Type DELETE to confirm</label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="mt-1"
            />
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteAccount}
            disabled={deleteConfirm !== 'DELETE' || deleting}
          >
            {deleting ? 'Deleting...' : 'Delete my account'}
          </Button>
        </div>
      </section>
    </div>
  );
}

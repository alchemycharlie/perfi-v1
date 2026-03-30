import { createClient } from '@/lib/supabase/server';
import { SettingsContent } from '@/components/app/settings/settings-content';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, preferences')
    .eq('id', user.id)
    .single();

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  const { data: workspace } = membership
    ? await supabase
        .from('workspaces')
        .select('id, name, type')
        .eq('id', membership.workspace_id)
        .single()
    : { data: null };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
      <SettingsContent
        userId={user.id}
        email={user.email || ''}
        displayName={profile?.display_name || ''}
        workspaceName={workspace?.name || ''}
        workspaceType={workspace?.type || 'personal'}
        preferences={(profile?.preferences as Record<string, unknown>) || {}}
      />
    </div>
  );
}

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { accountSchema } from '@/lib/validations/schemas';
import { canCreate, UPGRADE_MESSAGES } from '@/lib/utils/entitlements';
import type { Plan } from '@/lib/utils/entitlements';
import type { ActionResult } from '@/lib/actions/utils';

export async function createAccount(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  // Server-side entitlement check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single();
  const plan = (sub?.plan as Plan) || 'free';

  const { count } = await supabase
    .from('accounts')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);
  if (!canCreate(plan, 'accounts', count || 0)) {
    return { success: false, error: UPGRADE_MESSAGES.accounts };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = accountSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('accounts').insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    type: parsed.data.type,
    balance: parsed.data.balance,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function updateAccount(
  accountId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = accountSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase
    .from('accounts')
    .update({ name: parsed.data.name, type: parsed.data.type })
    .eq('id', accountId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function deleteAccount(accountId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('accounts').delete().eq('id', accountId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

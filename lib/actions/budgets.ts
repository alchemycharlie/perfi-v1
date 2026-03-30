'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { budgetSchema } from '@/lib/validations/schemas';
import { canCreate, UPGRADE_MESSAGES } from '@/lib/utils/entitlements';
import type { Plan } from '@/lib/utils/entitlements';
import type { ActionResult } from '@/lib/actions/utils';

export async function createBudget(
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
    .from('budgets')
    .select('id', { count: 'exact', head: true })
    .eq('workspace_id', workspaceId);
  if (!canCreate(plan, 'budgets', count || 0)) {
    return { success: false, error: UPGRADE_MESSAGES.budgets };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = budgetSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('budgets').insert({
    workspace_id: workspaceId,
    category_id: parsed.data.category_id,
    amount: parsed.data.amount,
    period: 'monthly',
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'A budget already exists for this category.' };
    }
    return { success: false, error: error.message };
  }

  revalidatePath('/app/budgets');
  return { success: true };
}

export async function updateBudget(
  budgetId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const amount = Number(formData.get('amount'));

  if (!amount || amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero.' };
  }

  const { error } = await supabase.from('budgets').update({ amount }).eq('id', budgetId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/budgets');
  return { success: true };
}

export async function deleteBudget(budgetId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/app/budgets');
  return { success: true };
}

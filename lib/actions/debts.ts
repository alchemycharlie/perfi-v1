'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { debtSchema } from '@/lib/validations/schemas';
import type { ActionResult } from '@/lib/actions/utils';

export async function createDebt(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = debtSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('debts').insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    account_id: parsed.data.account_id || null,
    balance: parsed.data.balance,
    minimum_payment: parsed.data.minimum_payment,
    interest_rate: parsed.data.interest_rate || null,
    next_payment_date: parsed.data.next_payment_date || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/debt');
  return { success: true };
}

export async function updateDebt(
  debtId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = debtSchema.safeParse(raw);

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
    .from('debts')
    .update({
      name: parsed.data.name,
      account_id: parsed.data.account_id || null,
      balance: parsed.data.balance,
      minimum_payment: parsed.data.minimum_payment,
      interest_rate: parsed.data.interest_rate || null,
      next_payment_date: parsed.data.next_payment_date || null,
    })
    .eq('id', debtId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/debt');
  return { success: true };
}

export async function deleteDebt(debtId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('debts').delete().eq('id', debtId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/app/debt');
  return { success: true };
}

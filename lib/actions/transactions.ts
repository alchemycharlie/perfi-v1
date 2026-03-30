'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { transactionSchema } from '@/lib/validations/schemas';
import type { ActionResult } from '@/lib/actions/utils';

export async function createTransaction(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = transactionSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('transactions').insert({
    workspace_id: workspaceId,
    account_id: parsed.data.account_id,
    category_id: parsed.data.category_id || null,
    type: parsed.data.type,
    amount: parsed.data.amount,
    description: parsed.data.description,
    date: parsed.data.date,
    notes: parsed.data.notes || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/transactions');
  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function updateTransaction(
  transactionId: string,
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = transactionSchema.safeParse(raw);

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
    .from('transactions')
    .update({
      account_id: parsed.data.account_id,
      category_id: parsed.data.category_id || null,
      type: parsed.data.type,
      amount: parsed.data.amount,
      description: parsed.data.description,
      date: parsed.data.date,
      notes: parsed.data.notes || null,
    })
    .eq('id', transactionId)
    .eq('workspace_id', workspaceId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/transactions');
  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function deleteTransaction(transactionId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('transactions').delete().eq('id', transactionId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/transactions');
  revalidatePath('/app/accounts');
  revalidatePath('/app/dashboard');
  return { success: true };
}

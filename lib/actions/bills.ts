'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { billSchema } from '@/lib/validations/schemas';
import type { ActionResult } from '@/lib/actions/utils';

export async function createBill(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = billSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('bills').insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    amount: parsed.data.amount,
    frequency: parsed.data.frequency,
    next_due_date: parsed.data.next_due_date,
    payment_method: parsed.data.payment_method,
    account_id: parsed.data.account_id || null,
    category_id: parsed.data.category_id || null,
    is_subscription: parsed.data.is_subscription,
    notes: parsed.data.notes || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/bills');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function updateBill(
  billId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = billSchema.safeParse(raw);

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
    .from('bills')
    .update({
      name: parsed.data.name,
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
      next_due_date: parsed.data.next_due_date,
      payment_method: parsed.data.payment_method,
      account_id: parsed.data.account_id || null,
      category_id: parsed.data.category_id || null,
      is_subscription: parsed.data.is_subscription,
      notes: parsed.data.notes || null,
    })
    .eq('id', billId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/bills');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function deleteBill(billId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('bills').delete().eq('id', billId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/bills');
  revalidatePath('/app/dashboard');
  return { success: true };
}

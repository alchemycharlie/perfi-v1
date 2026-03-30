'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { incomeSourceSchema } from '@/lib/validations/schemas';
import type { ActionResult } from '@/lib/actions/utils';

export async function createIncomeSource(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = incomeSourceSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('income_sources').insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    type: parsed.data.type,
    benefit_type: parsed.data.type === 'benefit' ? parsed.data.benefit_type || null : null,
    amount: parsed.data.amount,
    frequency: parsed.data.frequency,
    next_pay_date: parsed.data.next_pay_date,
    account_id: parsed.data.account_id || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/income');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function updateIncomeSource(
  sourceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = incomeSourceSchema.safeParse(raw);

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
    .from('income_sources')
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      benefit_type: parsed.data.type === 'benefit' ? parsed.data.benefit_type || null : null,
      amount: parsed.data.amount,
      frequency: parsed.data.frequency,
      next_pay_date: parsed.data.next_pay_date,
      account_id: parsed.data.account_id || null,
    })
    .eq('id', sourceId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/income');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function deleteIncomeSource(sourceId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('income_sources').delete().eq('id', sourceId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/income');
  revalidatePath('/app/dashboard');
  return { success: true };
}

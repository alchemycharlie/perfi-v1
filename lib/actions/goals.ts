'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { goalSchema, goalContributionSchema } from '@/lib/validations/schemas';
import type { ActionResult } from '@/lib/actions/utils';

export async function createGoal(
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = goalSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const { error } = await supabase.from('goals').insert({
    workspace_id: workspaceId,
    name: parsed.data.name,
    type: parsed.data.type,
    target_amount: parsed.data.target_amount,
    target_date: parsed.data.target_date || null,
    debt_id: parsed.data.debt_id || null,
    category_id: parsed.data.category_id || null,
    status: 'active',
  });

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/goals');
  return { success: true };
}

export async function updateGoalStatus(
  goalId: string,
  status: 'active' | 'completed' | 'abandoned',
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('goals').update({ status }).eq('id', goalId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/app/goals');
  return { success: true };
}

export async function addContribution(
  goalId: string,
  workspaceId: string,
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const raw = Object.fromEntries(formData.entries());
  const parsed = goalContributionSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.');
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  // Insert contribution
  const { error: contribError } = await supabase.from('goal_contributions').insert({
    goal_id: goalId,
    workspace_id: workspaceId,
    amount: parsed.data.amount,
    date: parsed.data.date,
    notes: parsed.data.notes || null,
  });

  if (contribError) return { success: false, error: contribError.message };

  // Update goal current_amount
  const { data: goal } = await supabase
    .from('goals')
    .select('current_amount')
    .eq('id', goalId)
    .single();

  if (goal) {
    await supabase
      .from('goals')
      .update({ current_amount: goal.current_amount + parsed.data.amount })
      .eq('id', goalId);
  }

  revalidatePath(`/app/goals/${goalId}`);
  revalidatePath('/app/goals');
  return { success: true };
}

export async function deleteGoal(goalId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from('goals').delete().eq('id', goalId);
  if (error) return { success: false, error: error.message };

  revalidatePath('/app/goals');
  return { success: true };
}

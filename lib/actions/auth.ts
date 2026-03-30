'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/lib/actions/utils';

export async function signUp(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { success: false, errors: { password: ['Password must be at least 8 characters.'] } };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    data: 'Check your email for a verification link.',
  };
}

export async function signIn(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = formData.get('redirect') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: 'Invalid email or password.' };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo || '/app/dashboard');
}

export async function signInWithMagicLink(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email is required.' };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: 'Check your email for a magic link.' };
}

export async function resetPasswordRequest(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Email is required.' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: 'Check your email for a password reset link.' };
}

export async function updatePassword(
  _prevState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();

  const password = formData.get('password') as string;

  if (!password || password.length < 8) {
    return {
      success: false,
      errors: { password: ['Password must be at least 8 characters.'] },
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect('/login?message=Password updated. Please sign in.');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

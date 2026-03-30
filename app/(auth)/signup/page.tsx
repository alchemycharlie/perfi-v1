'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/actions/auth';
import { initialActionState } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUp, initialActionState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Create your account</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Start tracking your finances in minutes. No credit card required.
        </p>
      </div>

      {state.success ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-4 text-center">
          <h2 className="font-semibold text-text-primary">Check your email</h2>
          <p className="mt-2 text-sm text-text-secondary">{state.data as string}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <Input id="signup-email" name="email" type="email" required autoComplete="email" className="mt-1" />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="mt-1"
            />
            <p className="mt-1 text-xs text-text-muted">At least 8 characters.</p>
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}
          {state.errors?.password && (
            <p className="text-sm text-danger">{state.errors.password[0]}</p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs text-text-muted">
        By signing up, you agree to our{' '}
        <Link href="/legal/terms" className="underline hover:text-text-secondary">
          Terms
        </Link>{' '}
        and{' '}
        <Link href="/legal/privacy" className="underline hover:text-text-secondary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

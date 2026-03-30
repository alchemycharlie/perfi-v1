'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetPasswordRequest } from '@/lib/actions/auth';
import { initialActionState } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPasswordRequest, initialActionState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Reset your password</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Enter your email and we&apos;ll send you a reset link.
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
            <label htmlFor="reset-email" className="block text-sm font-medium text-text-primary">
              Email
            </label>
            <Input id="reset-email" name="email" type="email" required autoComplete="email" className="mt-1" />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-text-secondary">
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

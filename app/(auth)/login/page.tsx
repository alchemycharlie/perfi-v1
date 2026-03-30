'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, signInWithMagicLink } from '@/lib/actions/auth';
import { initialActionState } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '';
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  const [signInState, signInAction, signInPending] = useActionState(signIn, initialActionState);
  const [magicState, magicAction, magicPending] = useActionState(
    signInWithMagicLink,
    initialActionState,
  );

  return (
    <div className="space-y-6">
      {message && (
        <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-3 text-sm text-text-primary">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-[var(--radius-md)] border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          Authentication failed. Please try again.
        </div>
      )}

      <div>
        <h1 className="text-xl font-semibold text-text-primary">Sign in to PerFi</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Welcome back. Enter your email to continue.
        </p>
      </div>

      {/* Email + password form */}
      <form action={signInAction} className="space-y-4">
        <input type="hidden" name="redirect" value={redirectTo} />

        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-text-primary">
            Email
          </label>
          <Input id="login-email" name="email" type="email" required autoComplete="email" className="mt-1" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-sm font-medium text-text-primary">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-accent hover:text-accent-hover">
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="mt-1"
          />
        </div>

        {signInState.error && (
          <p className="text-sm text-danger">{signInState.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={signInPending}>
          {signInPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-bg-primary px-2 text-text-muted">or</span>
        </div>
      </div>

      {/* Magic link form */}
      <form action={magicAction} className="space-y-3">
        <Input name="email" type="email" placeholder="Email for magic link" required autoComplete="email" />

        {magicState.success && (
          <p className="text-sm text-success">{magicState.data as string}</p>
        )}
        {magicState.error && (
          <p className="text-sm text-danger">{magicState.error}</p>
        )}

        <Button type="submit" variant="outline" className="w-full" disabled={magicPending}>
          {magicPending ? 'Sending...' : 'Send magic link'}
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-accent hover:text-accent-hover">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

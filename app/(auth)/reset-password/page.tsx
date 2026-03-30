'use client';

import { useActionState } from 'react';
import { updatePassword } from '@/lib/actions/auth';
import { initialActionState } from '@/lib/actions/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, initialActionState);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Set new password</h1>
        <p className="mt-1 text-sm text-text-secondary">Enter your new password below.</p>
      </div>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-text-primary">
            New password
          </label>
          <Input
            id="new-password"
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
          {pending ? 'Updating...' : 'Update password'}
        </Button>
      </form>
    </div>
  );
}

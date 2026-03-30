'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const interests = [
  { id: 'budgeting', label: 'Budgeting' },
  { id: 'cashflow', label: 'Cashflow visibility' },
  { id: 'benefits', label: 'Benefits tracking' },
  { id: 'debt', label: 'Debt tracking' },
  { id: 'goals', label: 'Savings goals' },
];

export function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-8 text-center">
        <h2 className="text-lg font-semibold text-text-primary">You&apos;re on the list</h2>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ll let you know when PerFi is ready. Thanks for your interest.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = {
          email: formData.get('email'),
          company: formData.get('company'), // honeypot
          interests: formData.getAll('interests'),
        };
        try {
          await fetch('/api/waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        } catch {
          // silently succeed
        }
        setSubmitted(true);
        setLoading(false);
      }}
      className="space-y-6"
    >
      <div>
        <label htmlFor="waitlist-email" className="block text-sm font-medium text-text-primary">
          Email address
        </label>
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="mt-1"
        />
      </div>

      {/* Honeypot anti-spam (hidden from real users) */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-text-primary">
          What interests you most? <span className="font-normal text-text-muted">(optional)</span>
        </legend>
        <div className="mt-3 space-y-2">
          {interests.map((interest) => (
            <label
              key={interest.id}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <input
                type="checkbox"
                name="interests"
                value={interest.id}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent/50"
              />
              {interest.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Joining...' : 'Join the waitlist'}
      </Button>

      <p className="text-center text-xs text-text-muted">
        No spam. We&apos;ll only email you about PerFi launch updates.
      </p>
    </form>
  );
}

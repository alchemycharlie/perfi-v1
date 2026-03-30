'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-8 text-center">
        <h2 className="text-lg font-semibold text-text-primary">Thank you</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Your message has been received. We&apos;ll get back to you within 2 working days.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Phase B backend: submit to /api/contact
        setSubmitted(true);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-text-primary">
          Name
        </label>
        <Input id="contact-name" name="name" required className="mt-1" />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-text-primary">
          Email
        </label>
        <Input id="contact-email" name="email" type="email" required className="mt-1" />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-text-primary">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={5000}
          className="mt-1 flex w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
          placeholder="How can we help?"
        />
      </div>

      <Button type="submit" className="w-full">
        Send message
      </Button>
    </form>
  );
}

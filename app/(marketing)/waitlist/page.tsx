import type { Metadata } from 'next';
import { WaitlistForm } from '@/components/marketing/waitlist-form';

export const metadata: Metadata = {
  title: 'Join the Waitlist — PerFi',
  description:
    'Be the first to know when PerFi launches. UK-focused personal finance, built for clarity.',
};

export default function WaitlistPage() {
  return (
    <section className="px-6 pb-20 pt-16">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
            Join the waitlist
          </h1>
          <p className="mt-4 text-text-secondary">
            We&apos;re building something different. Sign up to be first in when PerFi launches.
          </p>
        </div>

        <div className="mt-10">
          <WaitlistForm />
        </div>

        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-6">
          <h2 className="text-sm font-semibold text-text-primary">What to expect</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li>Early access when we launch</li>
            <li>Occasional progress updates (no spam)</li>
            <li>The chance to shape the product with feedback</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — PerFi',
  description: 'Terms of service for using PerFi.',
};

export default function TermsOfServicePage() {
  return (
    <section className="px-6 pb-20 pt-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: [Date]</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">1. Service description</h2>
            <p className="mt-2">
              PerFi is a personal finance tracking and planning tool. It allows you to manually
              record accounts, transactions, budgets, bills, goals, income, and debts. PerFi does
              not connect to your bank, move money, or provide financial advice.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">2. Accounts</h2>
            <p className="mt-2">
              You must provide a valid email address to create an account. You are responsible for
              maintaining the security of your account credentials. One person per account.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">3. Free and Pro plans</h2>
            <p className="mt-2">
              The free plan is available indefinitely at no cost. The Pro plan is available at
              &pound;4.99/month, billed monthly via Stripe. You may cancel at any time; access
              continues until the end of your current billing period.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">4. Refunds</h2>
            <p className="mt-2">
              We do not offer refunds for partial billing periods. If you cancel, you retain access
              to Pro features until the end of your current billing period.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">5. Your data</h2>
            <p className="mt-2">
              You own the data you enter into PerFi. You can export it at any time and delete your
              account at any time. See our Privacy Policy for details on how we handle your data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">6. Acceptable use</h2>
            <p className="mt-2">
              You agree not to misuse the service, attempt to access other users&apos; data, reverse
              engineer the application, or use PerFi for any unlawful purpose.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">7. Limitation of liability</h2>
            <p className="mt-2">
              PerFi is provided &ldquo;as is&rdquo; without warranty. We are not responsible for
              financial decisions you make based on data tracked in PerFi. PerFi is a tracking and
              planning tool &mdash; it does not provide financial advice.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">8. Changes to terms</h2>
            <p className="mt-2">
              We may update these terms from time to time. Material changes will be communicated via
              email. Continued use of PerFi after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">9. Contact</h2>
            <p className="mt-2">
              For questions about these terms, contact us via{' '}
              <a href="/contact" className="text-accent hover:text-accent-hover underline">
                our contact page
              </a>.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-[var(--radius-md)] border border-border bg-bg-secondary p-4">
          <p className="text-xs text-text-muted">
            PerFi is a tracking and planning tool. It does not provide financial advice.
          </p>
        </div>
      </article>
    </section>
  );
}

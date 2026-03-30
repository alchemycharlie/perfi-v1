import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PerFi',
  description: 'How PerFi handles your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <section className="px-6 pb-20 pt-16">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: [Date]</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-text-secondary">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">1. What we collect</h2>
            <p className="mt-2">
              When you create an account, we collect your email address and a display name. When you
              use PerFi, we store the financial data you enter (accounts, transactions, budgets,
              bills, goals, income sources). We do not collect data from your bank or any third party.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">2. How we use your data</h2>
            <p className="mt-2">
              Your data is used solely to provide the PerFi service: displaying your financial
              information, calculating budgets and cashflow, and managing your account. We do not
              sell, share, or monetise your data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">3. Where your data is stored</h2>
            <p className="mt-2">
              Your data is stored in a Supabase-hosted PostgreSQL database with row-level security.
              All data is encrypted in transit (TLS) and at rest. Our database is hosted in the EU.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">4. Data retention</h2>
            <p className="mt-2">
              We retain your data for as long as your account is active. When you delete your
              account, all data is permanently removed. We use hard deletes — there is no soft
              delete or retention period.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">5. Your rights</h2>
            <p className="mt-2">
              You can export your data at any time via CSV export. You can delete your account and
              all associated data from the Settings page. These rights satisfy GDPR requirements for
              data portability and the right to erasure.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">6. Cookies</h2>
            <p className="mt-2">
              PerFi uses only essential cookies for authentication (session management). We do not
              use advertising cookies, analytics cookies, or third-party tracking cookies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">7. Third-party services</h2>
            <p className="mt-2">
              We use Supabase for database and authentication, Stripe for payment processing, and
              Vercel for hosting. These services have their own privacy policies. We do not share
              your financial data with any of these services beyond what is necessary to operate.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-primary">8. Contact</h2>
            <p className="mt-2">
              For privacy-related questions, contact us at{' '}
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

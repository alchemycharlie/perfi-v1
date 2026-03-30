import type { Metadata } from 'next';
import { FAQGroup } from '@/components/marketing/faq-accordion';
import { CTASection } from '@/components/marketing/cta-section';

export const metadata: Metadata = {
  title: 'FAQ — PerFi',
  description: 'Frequently asked questions about PerFi, pricing, data privacy, and accessibility.',
};

const faqGroups = [
  {
    title: 'Product',
    items: [
      {
        question: 'What is PerFi?',
        answer:
          'PerFi is a UK-focused personal finance planner. It helps you track accounts, transactions, budgets, bills, goals, and income \u2014 all manually, without connecting to your bank.',
      },
      {
        question: 'How is PerFi different from other budgeting apps?',
        answer:
          'PerFi is manual-first (no bank sync required), UK-focused (GBP, direct debits, UK benefits), and designed with accessibility and neurodiversity in mind. It\u2019s built for clarity, not complexity.',
      },
      {
        question: 'Do I need to connect my bank account?',
        answer:
          'No. PerFi is entirely manual. You add your own accounts, log your own transactions, and stay in full control of your data. No Open Banking, no API connections.',
      },
      {
        question: 'What account types can I track?',
        answer:
          'Current accounts, savings accounts, credit cards, cash, and investments. You can create as many as your plan allows.',
      },
      {
        question: 'Can I track benefits income?',
        answer:
          'Yes. PerFi supports Universal Credit, PIP, Child Benefit, Carer\u2019s Allowance, ESA, Housing Benefit, Council Tax Reduction, and other benefits. They\u2019re tracked with the same dignity as employment income.',
      },
    ],
  },
  {
    title: 'Pricing & Billing',
    items: [
      {
        question: 'Is PerFi free?',
        answer:
          'Yes. The free plan is permanent \u2014 no time limit, no credit card required. It includes up to 3 accounts, 5 budget categories, 2 goals, and all core features.',
      },
      {
        question: 'What do I get on the free plan?',
        answer:
          'Unlimited transactions, bills tracking, income tracking (including benefits), cashflow calendar, dashboard, and basic analytics. The free plan is genuinely useful.',
      },
      {
        question: 'What does Pro include?',
        answer:
          'Unlimited accounts, budgets, and goals. Up to 5 workspaces. Advanced analytics, trends, net worth tracking, cashflow forecasting, and CSV import/export. \u00A34.99/month.',
      },
      {
        question: 'How do I upgrade or cancel?',
        answer:
          'Upgrade from your settings page. Cancel anytime \u2014 you keep access until the end of your billing period. Your data is never deleted when you downgrade.',
      },
      {
        question: 'Is there a free trial of Pro?',
        answer:
          'Not currently. The free plan is generous enough to evaluate PerFi before deciding to upgrade.',
      },
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      {
        question: 'Where is my data stored?',
        answer:
          'Your data is stored securely in a Supabase-hosted PostgreSQL database with row-level security. All data is encrypted in transit and at rest.',
      },
      {
        question: 'Do you sell my data?',
        answer:
          'No. We do not sell, share, or monetise your personal or financial data. Ever.',
      },
      {
        question: 'Can I export my data?',
        answer:
          'Yes. Free users can export transactions as CSV. Pro users can export all data. You always own your data.',
      },
      {
        question: 'Can I delete my account and all data?',
        answer:
          'Yes. You can delete your account from Settings at any time. This permanently removes all your data \u2014 no soft deletes, no retention period.',
      },
    ],
  },
  {
    title: 'Accessibility',
    items: [
      {
        question: 'Is PerFi accessible?',
        answer:
          'Yes. PerFi targets WCAG 2.1 AA compliance. We test with screen readers, keyboard navigation, and colour contrast tools.',
      },
      {
        question: 'What accessibility standards does PerFi meet?',
        answer:
          'We target WCAG 2.1 Level AA. This includes proper heading structure, ARIA labels, keyboard navigation, sufficient colour contrast, and reduced motion support.',
      },
      {
        question: 'Is PerFi designed for neurodivergent users?',
        answer:
          'Yes. PerFi uses low cognitive load design: one primary action per page, predictable navigation, progressive disclosure, generous whitespace, and calm colours. No flashing, no aggressive alerts.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-text-secondary">
              Everything you need to know about PerFi.
            </p>
          </div>

          <div className="mt-12 space-y-10">
            {faqGroups.map((group) => (
              <FAQGroup key={group.title} title={group.title} items={group.items} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

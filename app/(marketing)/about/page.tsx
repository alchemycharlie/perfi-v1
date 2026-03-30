import type { Metadata } from 'next';
import { CTASection } from '@/components/marketing/cta-section';

export const metadata: Metadata = {
  title: 'About — PerFi',
  description: 'The story behind PerFi. Built for the UK, designed for everyone.',
};

const principles = [
  {
    title: 'Manual first',
    description:
      'No Open Banking, no bank sync. You control your own data. This is a feature, not a limitation.',
  },
  {
    title: 'UK first',
    description:
      'GBP only. UK pay structures, benefits, terminology. Built for how money works here.',
  },
  {
    title: 'Accessibility focused',
    description:
      'Low cognitive load, predictable navigation, progressive disclosure. WCAG 2.1 AA. Designed with neurodivergent users in mind.',
  },
  {
    title: 'Trust first',
    description:
      'Calm, credible design. No dark patterns. Clear privacy messaging. Your data is yours.',
  },
  {
    title: 'Honest scope',
    description:
      'We ship what works. We don\u2019t over-promise. PerFi is a tracking and planning tool \u2014 not a bank, not an investment platform, not financial advice.',
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pb-20 pt-16">
        <div className="mx-auto max-w-3xl">
          {/* Mission */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">About PerFi</h1>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              PerFi is a UK-focused personal finance planner built for clarity, accessibility, and
              real life. It helps you track your money without connecting to your bank &mdash;
              because privacy and control matter.
            </p>
          </div>

          {/* Founder story placeholder */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-text-primary">Why PerFi exists</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-secondary">
              <p>
                Most budgeting apps assume you want to connect your bank account. But not everyone
                does &mdash; and not everyone can. Some people prefer manual control. Some don&apos;t
                trust third-party access. Some just want a simple way to see where their money goes.
              </p>
              <p>
                PerFi was built for those people. It&apos;s designed for the UK: GBP, direct debits,
                pay dates, council tax, and benefits income. It treats Universal Credit with the same
                dignity as a salary, because income is income.
              </p>
              <p>
                And it&apos;s built to be accessible. Not as an afterthought, but as a foundation.
                Every page follows neurodiversity-conscious design principles: one action per screen,
                calm colours, predictable navigation, and no information overload.
              </p>
            </div>
          </div>

          {/* Product principles */}
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-text-primary">Product principles</h2>
            <div className="mt-6 space-y-6">
              {principles.map((principle, i) => (
                <div key={principle.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{principle.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

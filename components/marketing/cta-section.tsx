import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  headline?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CTASection({
  headline = 'Ready to take control of your finances?',
  description = 'Join thousands getting clarity on their money. No bank connections needed.',
  buttonText = 'Get Started — it\u2019s free',
  buttonHref = '/waitlist',
}: CTASectionProps) {
  return (
    <section className="border-t border-border bg-bg-secondary px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">{headline}</h2>
        <p className="mt-4 text-text-secondary">{description}</p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href={buttonHref}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

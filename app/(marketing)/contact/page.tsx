import type { Metadata } from 'next';
import { ContactForm } from '@/components/marketing/contact-form';

export const metadata: Metadata = {
  title: 'Contact — PerFi',
  description: 'Get in touch with the PerFi team.',
};

export default function ContactPage() {
  return (
    <section className="px-6 pb-20 pt-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">Contact us</h1>
          <p className="mt-4 text-text-secondary">
            Have a question, suggestion, or found a bug? We&apos;d love to hear from you.
          </p>
          <p className="mt-2 text-sm text-text-muted">
            We typically respond within 2 working days.
          </p>
        </div>

        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

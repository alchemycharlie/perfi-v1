'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQGroupProps {
  title: string;
  items: FAQItem[];
}

function FAQItem({ question, answer }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-text-primary hover:text-accent transition-colors"
        aria-expanded={open}
      >
        <span>{question}</span>
        <svg
          className={cn(
            'h-4 w-4 shrink-0 text-text-muted transition-transform',
            open && 'rotate-180',
          )}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div className="pb-4 text-sm leading-relaxed text-text-secondary">{answer}</div>}
    </div>
  );
}

export function FAQGroup({ title, items }: FAQGroupProps) {
  return (
    <div>
      {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
      <div
        className={cn(
          title ? 'mt-4' : '',
          'rounded-[var(--radius-lg)] border border-border bg-bg-primary px-4',
        )}
      >
        {items.map((item) => (
          <FAQItem key={item.question} {...item} />
        ))}
      </div>
    </div>
  );
}

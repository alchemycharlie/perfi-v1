'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Guided tour tooltip walkthrough.
 * Phase 2 Section 9: 4-step tooltip-based tour for demo users.
 *
 * Steps:
 * 1. Dashboard overview
 * 2. Quick-add button
 * 3. Sidebar navigation
 * 4. Cashflow calendar
 *
 * Lightweight tooltip overlay. Dismissible. Shows once per user.
 * Can be replayed from Settings → Help.
 */

const TOUR_STEPS = [
  {
    title: 'Your dashboard',
    description:
      'This is your dashboard. It shows your balances, upcoming bills, and budget status at a glance.',
  },
  {
    title: 'Quick-add',
    description:
      'Tap the "+ Transaction" button to add a transaction quickly from anywhere in the app.',
  },
  {
    title: 'Navigation',
    description: 'Use the sidebar to explore your accounts, budgets, cashflow, goals, and more.',
  },
  {
    title: 'Cashflow calendar',
    description:
      'Your cashflow calendar shows when money comes in and goes out, so you always know where you stand.',
  },
];

interface GuidedTourProps {
  onComplete: () => void;
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the dashboard renders first
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  function handleNext() {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">
            Step {currentStep + 1} of {TOUR_STEPS.length}
          </span>
          <button
            onClick={onComplete}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip tour
          </button>
        </div>

        <h3 className="mt-3 text-base font-semibold text-text-primary">{step.title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{step.description}</p>

        <div className="mt-4 flex items-center justify-between">
          {/* Step dots */}
          <div className="flex gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === currentStep ? 'bg-accent' : 'bg-bg-tertiary'
                }`}
              />
            ))}
          </div>

          <Button size="sm" onClick={handleNext}>
            {isLast ? 'Got it' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

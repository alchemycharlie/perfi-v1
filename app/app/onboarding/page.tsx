'use client';

import { useState } from 'react';
import { updateOnboardingStep, skipOnboarding } from '@/lib/actions/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { WorkspaceType, Frequency, BenefitType } from '@/lib/types/database';

/**
 * 5-step progressive onboarding flow.
 * Phase 2 Section 8 — Principles: progressive, skippable, fast, forgiving.
 */

const BENEFIT_OPTIONS: { value: BenefitType; label: string }[] = [
  { value: 'universal_credit', label: 'Universal Credit' },
  { value: 'pip', label: 'PIP' },
  { value: 'child_benefit', label: 'Child Benefit' },
  { value: 'carers_allowance', label: "Carer's Allowance" },
  { value: 'esa', label: 'ESA' },
  { value: 'housing_benefit', label: 'Housing Benefit' },
  { value: 'council_tax_reduction', label: 'Council Tax Reduction' },
  { value: 'other', label: 'Other' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state across steps
  const [displayName, setDisplayName] = useState('');
  const [workspaceType, setWorkspaceType] = useState<WorkspaceType>('personal');
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState<Frequency>('monthly');
  const [incomePayDate, setIncomePayDate] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState<Set<BenefitType>>(new Set());

  async function handleNext() {
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (step) {
        case 1:
          result = await updateOnboardingStep(1, { displayName: displayName || 'User' });
          break;
        case 2:
          result = await updateOnboardingStep(2, { workspaceType });
          if (result.success && result.data) {
            setWorkspaceId(result.data);
          }
          break;
        case 3:
          result = await updateOnboardingStep(3, {
            workspaceId,
            amount: incomeAmount || undefined,
            frequency: incomeFrequency,
            nextPayDate: incomePayDate || undefined,
          });
          break;
        case 4:
          result = await updateOnboardingStep(4, {
            workspaceId,
            benefits: Array.from(selectedBenefits).map((type) => ({ type })),
          });
          break;
        case 5:
          // Handled by startMode buttons directly
          return;
      }

      if (result && !result.success) {
        setError(result.error || 'Something went wrong.');
      } else {
        setStep(step + 1);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStartMode(mode: 'demo' | 'blank') {
    setLoading(true);
    setError(null);
    try {
      // Step 5 redirects on success, so no need to handle the result
      await updateOnboardingStep(5, { workspaceId, mode });
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Welcome to PerFi</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Let&apos;s get you set up. This takes about a minute.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`h-2 w-8 rounded-full transition-colors ${
              s === step ? 'bg-accent' : s < step ? 'bg-accent/40' : 'bg-bg-tertiary'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
        {error && (
          <div className="mb-4 rounded-[var(--radius-md)] border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {step === 1 && <Step1DisplayName value={displayName} onChange={setDisplayName} />}
        {step === 2 && <Step2WorkspaceType value={workspaceType} onChange={setWorkspaceType} />}
        {step === 3 && (
          <Step3Income
            amount={incomeAmount}
            onAmountChange={setIncomeAmount}
            frequency={incomeFrequency}
            onFrequencyChange={setIncomeFrequency}
            payDate={incomePayDate}
            onPayDateChange={setIncomePayDate}
          />
        )}
        {step === 4 && <Step4Benefits selected={selectedBenefits} onChange={setSelectedBenefits} />}
        {step === 5 && <Step5StartMode onSelect={handleStartMode} loading={loading} />}

        {/* Navigation */}
        {step < 5 && (
          <div className="mt-6 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              {step >= 3 && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors"
                >
                  Skip
                </button>
              )}
              <Button onClick={handleNext} disabled={loading}>
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Skip all */}
      <div className="mt-4 text-center">
        <form action={skipOnboarding}>
          <button
            type="submit"
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip setup entirely
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Step Components ──

function Step1DisplayName({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">What should we call you?</h2>
      <p className="mt-1 text-sm text-text-secondary">This is your display name in PerFi.</p>
      <div className="mt-4">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your name"
          autoFocus
        />
      </div>
    </div>
  );
}

function Step2WorkspaceType({
  value,
  onChange,
}: {
  value: WorkspaceType;
  onChange: (v: WorkspaceType) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">How will you use PerFi?</h2>
      <p className="mt-1 text-sm text-text-secondary">
        This sets up your categories. You can change this later.
      </p>
      <div className="mt-4 space-y-3">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 transition-colors ${
            value === 'personal'
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50'
          }`}
        >
          <input
            type="radio"
            name="workspaceType"
            value="personal"
            checked={value === 'personal'}
            onChange={() => onChange('personal')}
            className="mt-0.5"
          />
          <div>
            <span className="text-sm font-medium text-text-primary">Personal</span>
            <p className="mt-0.5 text-xs text-text-secondary">
              Track your own finances — income, spending, savings, and bills.
            </p>
          </div>
        </label>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 transition-colors ${
            value === 'personal_household'
              ? 'border-accent bg-accent/5'
              : 'border-border hover:border-accent/50'
          }`}
        >
          <input
            type="radio"
            name="workspaceType"
            value="personal_household"
            checked={value === 'personal_household'}
            onChange={() => onChange('personal_household')}
            className="mt-0.5"
          />
          <div>
            <span className="text-sm font-medium text-text-primary">Personal + Household</span>
            <p className="mt-0.5 text-xs text-text-secondary">
              Everything above, plus categories for childcare, school, and household expenses.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

function Step3Income({
  amount,
  onAmountChange,
  frequency,
  onFrequencyChange,
  payDate,
  onPayDateChange,
}: {
  amount: string;
  onAmountChange: (v: string) => void;
  frequency: Frequency;
  onFrequencyChange: (v: Frequency) => void;
  payDate: string;
  onPayDateChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">Your income</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Add your primary income source. You can add more later.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="income-amount" className="block text-sm font-medium text-text-primary">
            Amount (after tax)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-text-secondary">&pound;</span>
            <Input
              id="income-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="2,400"
            />
          </div>
        </div>
        <div>
          <label htmlFor="income-frequency" className="block text-sm font-medium text-text-primary">
            How often are you paid?
          </label>
          <select
            id="income-frequency"
            value={frequency}
            onChange={(e) => onFrequencyChange(e.target.value as Frequency)}
            className="mt-1 flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary"
          >
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="four_weekly">Every 4 weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label htmlFor="income-pay-date" className="block text-sm font-medium text-text-primary">
            Next pay date
          </label>
          <Input
            id="income-pay-date"
            type="date"
            value={payDate}
            onChange={(e) => onPayDateChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Benefits({
  selected,
  onChange,
}: {
  selected: Set<BenefitType>;
  onChange: (v: Set<BenefitType>) => void;
}) {
  function toggleBenefit(type: BenefitType) {
    const next = new Set(selected);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    onChange(next);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">Do you receive benefits?</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Select any that apply. These are tracked as income, with the same dignity as a salary.
      </p>
      <div className="mt-4 space-y-2">
        {BENEFIT_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border px-3 py-2 transition-colors hover:border-accent/50"
          >
            <input
              type="checkbox"
              checked={selected.has(opt.value)}
              onChange={() => toggleBenefit(opt.value)}
              className="h-4 w-4 rounded border-border text-accent"
            />
            <span className="text-sm text-text-primary">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step5StartMode({
  onSelect,
  loading,
}: {
  onSelect: (mode: 'demo' | 'blank') => void;
  loading: boolean;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary">How would you like to start?</h2>
      <p className="mt-1 text-sm text-text-secondary">
        You can always clear demo data or add your own data later.
      </p>
      <div className="mt-4 space-y-3">
        <button
          onClick={() => onSelect('demo')}
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] border border-accent bg-accent/5 p-4 text-left transition-colors hover:bg-accent/10 disabled:opacity-50"
        >
          <span className="text-sm font-medium text-text-primary">Explore with demo data</span>
          <p className="mt-0.5 text-xs text-text-secondary">
            See PerFi in action with realistic UK financial data — accounts, transactions, bills,
            budgets, and goals.
          </p>
        </button>
        <button
          onClick={() => onSelect('blank')}
          disabled={loading}
          className="w-full rounded-[var(--radius-md)] border border-border p-4 text-left transition-colors hover:border-accent/50 disabled:opacity-50"
        >
          <span className="text-sm font-medium text-text-primary">
            Start with a blank workspace
          </span>
          <p className="mt-0.5 text-xs text-text-secondary">
            Set up your finances from scratch. Add your own accounts, transactions, and budgets.
          </p>
        </button>
      </div>
    </div>
  );
}

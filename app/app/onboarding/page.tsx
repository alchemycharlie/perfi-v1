/**
 * Onboarding flow shell.
 *
 * Phase 2 Section 8 — 5 steps, progressive, skippable:
 *   1. Display name
 *   2. Workspace type (Personal / Personal + Household)
 *   3. Income (amount, frequency, next pay date)
 *   4. Benefits (named UK types)
 *   5. Start mode (Demo data / Blank workspace)
 *
 * Full flow coming in Phase C. This is the route shell.
 */
export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-text-primary">Welcome to PerFi</h1>
        <p className="mt-2 text-text-secondary">
          Let&apos;s get you set up. This takes about a minute.
        </p>
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-bg-primary p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <StepIndicator step={1} active />
            <span className="text-sm font-medium text-text-primary">Display name</span>
          </div>
          <div className="flex items-center gap-3">
            <StepIndicator step={2} />
            <span className="text-sm text-text-muted">Workspace type</span>
          </div>
          <div className="flex items-center gap-3">
            <StepIndicator step={3} />
            <span className="text-sm text-text-muted">Income</span>
          </div>
          <div className="flex items-center gap-3">
            <StepIndicator step={4} />
            <span className="text-sm text-text-muted">Benefits</span>
          </div>
          <div className="flex items-center gap-3">
            <StepIndicator step={5} />
            <span className="text-sm text-text-muted">Get started</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Full onboarding flow coming in Phase C.
        </p>
      </div>
    </div>
  );
}

function StepIndicator({ step, active = false }: { step: number; active?: boolean }) {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
        active ? 'bg-accent text-white' : 'bg-bg-tertiary text-text-muted'
      }`}
    >
      {step}
    </span>
  );
}

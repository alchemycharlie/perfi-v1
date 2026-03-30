import Link from 'next/link';

/**
 * UpgradeBanner — soft inline banner shown at plan limit gating points.
 * Phase 4 Section 5: "Soft inline banner shown when a user hits a plan limit.
 * Not a blocking modal — appears inline where the action was attempted."
 *
 * Final Master Plan: Enforcement is server-side (authoritative) +
 * client-side (UX). Soft gates with inline UpgradeBanner, not blocking modals.
 */
interface UpgradeBannerProps {
  feature: string;
  message: string;
}

export function UpgradeBanner({ feature, message }: UpgradeBannerProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-accent/20 bg-accent/5 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-primary">{feature}</p>
          <p className="mt-1 text-sm text-text-secondary">{message}</p>
        </div>
        <Link
          href="/app/settings/billing"
          className="shrink-0 rounded-[var(--radius-md)] bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
          Upgrade to Pro
        </Link>
      </div>
    </div>
  );
}

/**
 * Pro badge shown next to features that are Pro-only.
 */
export function ProBadge() {
  return (
    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
      Pro
    </span>
  );
}

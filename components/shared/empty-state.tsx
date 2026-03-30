import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * Consistent empty state component.
 * Phase 4 Section 5: "A consistent component for empty pages/sections.
 * Props: title, description, action (optional CTA button).
 * Ensures no blank screens anywhere in the app."
 */
interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border bg-bg-secondary/50 px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-6">
          <Button asChild size="sm">
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        </div>
      )}
      {actionLabel && onAction && !actionHref && (
        <div className="mt-6">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

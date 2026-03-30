import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-bg-tertiary text-text-primary',
        variant === 'accent' && 'bg-accent/10 text-accent',
        variant === 'muted' && 'bg-bg-secondary text-text-secondary',
        className,
      )}
    >
      {children}
    </span>
  );
}

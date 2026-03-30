'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

/**
 * Admin sidebar navigation.
 * Phase 2 Section 3 — Admin navigation:
 *   Dashboard (overview), Users, Waitlist, Subscriptions, Support, System
 */

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/waitlist', label: 'Waitlist' },
  { href: '/admin/subscriptions', label: 'Subscriptions' },
  { href: '/admin/support', label: 'Support' },
  { href: '/admin/system', label: 'System' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-52 shrink-0 border-r border-border bg-bg-tertiary lg:flex lg:flex-col">
      <div className="p-4">
        <Link
          href="/admin/dashboard"
          className="text-lg font-bold tracking-tight text-text-primary"
        >
          PerFi Admin
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <Link
          href="/app/dashboard"
          className="block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-text-muted hover:bg-bg-secondary hover:text-text-primary transition-colors"
        >
          &larr; Back to app
        </Link>
      </div>
    </aside>
  );
}

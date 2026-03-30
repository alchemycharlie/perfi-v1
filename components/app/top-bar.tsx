'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

/**
 * App top bar.
 * Phase 2 Section 2 — Secondary navigation:
 *   [Workspace switcher]  [Quick add: + Transaction]  [User avatar menu]
 *
 * User menu: Settings, Workspace settings, Subscription & billing, Help, Sign out
 */

export function AppTopBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-bg-primary px-4 lg:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-secondary hover:bg-bg-secondary transition-colors lg:hidden"
        aria-label="Toggle navigation"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>

      {/* Quick add transaction */}
      <div className="flex items-center gap-3">
        <Button size="sm">+ Transaction</Button>
      </div>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          aria-label="User menu"
          aria-expanded={userMenuOpen}
        >
          U
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-[var(--radius-lg)] border border-border bg-bg-primary py-1 shadow-lg">
              <UserMenuLink href="/app/settings" onClick={() => setUserMenuOpen(false)}>
                Settings
              </UserMenuLink>
              <UserMenuLink href="/app/settings/billing" onClick={() => setUserMenuOpen(false)}>
                Subscription &amp; billing
              </UserMenuLink>
              <UserMenuLink href="/contact" onClick={() => setUserMenuOpen(false)}>
                Help / Support
              </UserMenuLink>
              <div className="my-1 border-t border-border" />
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Mobile navigation drawer */}
      {mobileNavOpen && <MobileNav onClose={() => setMobileNavOpen(false)} />}
    </header>
  );
}

function UserMenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary transition-colors"
    >
      {children}
    </Link>
  );
}

/**
 * Mobile bottom-sheet style nav.
 * Phase 2: Mobile bottom tab bar (Dashboard, Transactions, Budgets, Cashflow, More)
 */
function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  const mobileNavItems = [
    { href: '/app/dashboard', label: 'Dashboard' },
    { href: '/app/accounts', label: 'Accounts' },
    { href: '/app/transactions', label: 'Transactions' },
    { href: '/app/budgets', label: 'Budgets' },
    { href: '/app/bills', label: 'Bills' },
    { href: '/app/cashflow', label: 'Cashflow' },
    { href: '/app/goals', label: 'Goals' },
    { href: '/app/debt', label: 'Debt' },
    { href: '/app/income', label: 'Income' },
    { href: '/app/analytics', label: 'Analytics' },
    { href: '/app/settings', label: 'Settings' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-bg-primary shadow-lg lg:hidden">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="text-lg font-bold text-text-primary">PerFi</span>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-secondary hover:bg-bg-secondary"
            aria-label="Close menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-1 p-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-bg-secondary',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}

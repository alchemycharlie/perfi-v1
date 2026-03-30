import { signOut } from '@/lib/actions/auth';

export function AdminTopBar() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-bg-primary px-4 lg:px-6">
      <span className="text-xs font-medium text-text-muted">Admin Panel</span>
      <form action={signOut}>
        <button
          type="submit"
          className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          Sign out
        </button>
      </form>
    </header>
  );
}

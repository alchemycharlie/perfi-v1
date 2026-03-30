export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full">
      {/* Phase E: Admin sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-tertiary lg:block">
        <div className="p-4">
          <span className="text-lg font-semibold text-text-primary">PerFi Admin</span>
        </div>
        <nav className="px-2 py-4">
          <p className="px-2 text-xs text-text-muted">Admin nav — coming in Phase E</p>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-border px-6 py-3">
          <p className="text-sm text-text-muted">Admin panel — coming in Phase E</p>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full">
      {/* Phase C: Sidebar navigation */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-bg-secondary lg:block">
        <div className="p-4">
          <span className="text-lg font-semibold text-text-primary">PerFi</span>
        </div>
        <nav className="px-2 py-4">
          <p className="px-2 text-xs text-text-muted">Sidebar — coming in Phase C</p>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Phase C: Top bar with quick-add and workspace switcher */}
        <header className="border-b border-border px-6 py-3">
          <p className="text-sm text-text-muted">Top bar — coming in Phase C</p>
        </header>

        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

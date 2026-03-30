export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      {/* Phase B: Marketing header nav */}
      <header className="border-b border-border px-6 py-4">
        <nav>
          <span className="text-lg font-semibold text-text-primary">PerFi</span>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      {/* Phase B: Marketing footer */}
      <footer className="border-t border-border px-6 py-4 text-sm text-text-muted">
        PerFi is a tracking and planning tool. It does not provide financial advice.
      </footer>
    </div>
  );
}

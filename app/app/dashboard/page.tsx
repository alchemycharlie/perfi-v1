export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Your financial overview at a glance. Full dashboard coming in Phase C.
      </p>

      {/* Placeholder dashboard cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Total Balance" value="—" />
        <DashboardCard title="This Month Spending" value="—" />
        <DashboardCard title="Budget Status" value="—" />
      </div>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-bg-secondary p-6">
        <h2 className="text-sm font-semibold text-text-primary">Recent Transactions</h2>
        <p className="mt-2 text-sm text-text-muted">
          No transactions yet. Add your first transaction using the button above.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg-primary p-4">
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
    </div>
  );
}

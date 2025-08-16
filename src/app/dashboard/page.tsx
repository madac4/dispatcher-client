export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Dashboard cards and content */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Active Permits</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium">Pending Approvals</h3>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>
    </div>
  )
}

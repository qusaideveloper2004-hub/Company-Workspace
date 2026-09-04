export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 rounded bg-border" />
        <div className="mt-2 h-4 w-64 rounded bg-border" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 rounded-lg border border-border bg-surface"
          />
        ))}
      </div>

      <div className="h-72 rounded-lg border border-border bg-surface" />
    </div>
  );
}

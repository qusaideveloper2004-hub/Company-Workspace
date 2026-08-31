export default function Loading() {
  return (
    <div className="p-6">
      <div className="animate-pulse">
        <div className="h-6 w-32 rounded bg-surface" />

        <div className="mt-2 h-4 w-20 rounded bg-surface" />

        <div className="mt-5 h-9 w-32 rounded bg-surface" />

        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
          <div className="divide-y divide-border">
            <div className="h-16" />
            <div className="h-16" />
            <div className="h-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
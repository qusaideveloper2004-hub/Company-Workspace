export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-24 animate-pulse rounded-md bg-border" />

          <div className="mt-2 h-4 w-20 animate-pulse rounded-md bg-border" />
        </div>

        <div className="h-10 w-28 animate-pulse rounded-md bg-border" />
      </div>

      <div className="mt-5 flex gap-2">
        <div className="h-8 w-14 animate-pulse rounded-full bg-border" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-border" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-border" />
        <div className="h-8 w-24 animate-pulse rounded-full bg-border" />
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between border-b border-border px-5 py-4"
          >
            <div>
              <div className="h-4 w-48 animate-pulse rounded-md bg-border" />
              <div className="mt-2 h-3 w-32 animate-pulse rounded-md bg-border" />
            </div>

            <div className="flex gap-2">
              <div className="h-6 w-14 animate-pulse rounded-full bg-border" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
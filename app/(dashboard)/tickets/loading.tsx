export default function Loading() {
  return (
    <div className="p-6">
      {/* Title */}
      <div className="h-8 w-40 animate-pulse rounded bg-gray-300"></div>

      {/* Filters */}
      <div className="mt-6 flex gap-2">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-300"></div>
        <div className="h-8 w-20 animate-pulse rounded bg-gray-300"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-gray-300"></div>
        <div className="h-8 w-20 animate-pulse rounded bg-gray-300"></div>
      </div>

      {/* Tickets List */}
      <div className="mt-6 space-y-4">
        <div className="h-20 animate-pulse rounded-lg bg-gray-300"></div>

        <div className="h-20 animate-pulse rounded-lg bg-gray-300"></div>

        <div className="h-20 animate-pulse rounded-lg bg-gray-300"></div>
      </div>
    </div>
  );
}
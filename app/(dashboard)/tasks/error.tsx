"use client";

interface TasksErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TasksError({
  reset
}: TasksErrorProps) {
  return (
    <div className="p-6">
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-red-600">
          We couldnt load the tasks. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-4 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

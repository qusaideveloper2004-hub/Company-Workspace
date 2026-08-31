"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">
        Something went wrong
      </h1>

      <p className="mt-3">
        {error.message}
      </p>

      <button
        onClick={reset}
        className="mt-5 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try Again
      </button>
    </div>
  );
}
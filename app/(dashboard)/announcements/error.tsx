"use client";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  reset,
}: ErrorPageProps) {
  return (
    <div className="p-6">
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted">
          We couldnt load the announcements.
          Please try again.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
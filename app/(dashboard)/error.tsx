"use client";

import { useEffect } from "react";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function DashboardError({
  error,
  retry,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 text-center">
      <h1 className="text-xl font-semibold text-foreground">
        Something went wrong
      </h1>

      <p className="mt-2 text-sm text-muted">
        We could not load this page. Please try again.
      </p>

      <button
        type="button"
        onClick={() => retry()}
        className="mt-5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}

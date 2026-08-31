import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium tracking-wide text-muted uppercase">
        Internal Portal
      </span>

      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Company Workspace
      </h1>

      <p className="mt-4 max-w-md text-muted">
        One place for Dashboard, Employees, Tickets, Tasks, Announcements,
        Reports and Settings.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Enter Workspace
      </Link>
    </main>
  );
}

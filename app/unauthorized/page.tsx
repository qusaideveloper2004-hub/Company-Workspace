import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Access denied
        </h1>

        <p className="mt-3 text-sm text-muted">
          Your account is not linked to an active employee record.
          Please contact your administrator.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-black/[0.02]"
          >
            Back to home
          </Link>

          <SignOutButton>
            <button className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    </main>
  );
}

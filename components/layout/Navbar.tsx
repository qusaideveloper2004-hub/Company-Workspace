"use client";

import { SignInButton, SignUpButton, UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Employees", href: "/employees" },
  { label: "Tickets", href: "/tickets" },
  { label: "Tasks", href: "/tasks" },
  { label: "Announcements", href: "/announcements" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

function titleFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <header className="border-b border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold">{titleFromPath(pathname)}</h2>

        {!isLoaded ? null : isSignedIn ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">
              {user?.firstName ?? user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <SignInButton mode="redirect">
              <button className="rounded bg-accent px-4 py-2 text-white">
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <button className="rounded bg-accent-soft px-4 py-2 text-accent">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        )}
      </div>

      <nav className="flex gap-2 overflow-x-auto border-t border-border px-4 py-3 lg:hidden">
        {mobileNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-accent-soft hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  status: "active" | "soon";
};

const icon = (d: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d={d} />
  </svg>
);

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    status: "active",
    icon: icon("M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"),
  },
  {
    label: "Employees",
    href: "/employees",
    status: "active",
    icon: icon(
      "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
    ),
  },
  {
    label: "Tickets",
    href: "/tickets",
    status: "active",
    icon: icon(
      "M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6V7Z"
    ),
  },
  {
    label: "Tasks",
    href: "/tasks",
    status: "active",
    icon: icon("m9 11 3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"),
  },
  // {
  //   label: "Users",
  //   href: "/users",
  //   status: "active",
  //   icon: icon(
  //     "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 10v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
  //   ),
  // },
  {
    label: "Announcements",
    href: "/announcements",
    status: "active",
    icon: icon("M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Zm14.54-4.54a9 9 0 0 1 0 11.08M15.71 8.29a5 5 0 0 1 0 6.42"),
  },
  {
    label: "Reports",
    href: "/reports",
    status: "active",
    icon: icon("M3 3v18h18M8 17V10m5 7V6m5 11v-4"),
  },
  {
    label: "Settings",
    href: "/settings",
    status: "active",
    icon: icon(
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.13-1.39l2-1.55-2-3.46-2.36.95a7.44 7.44 0 0 0-2.4-1.39L14 2h-4l-.51 2.16a7.44 7.44 0 0 0-2.4 1.39l-2.36-.95-2 3.46 2 1.55A7.4 7.4 0 0 0 4.6 12c0 .47.05.93.13 1.39l-2 1.55 2 3.46 2.36-.95c.71.6 1.52 1.08 2.4 1.39L10 22h4l.51-2.16c.88-.31 1.69-.79 2.4-1.39l2.36.95 2-3.46-2-1.55c.08-.46.13-.92.13-1.39Z"
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-surface px-5 py-6 text-sm text-foreground lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          C
        </div>
        <div>
          <p className="font-semibold">Company Workspace</p>
          <p className="text-xs text-muted">Internal portal</p>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 transition-colors ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-foreground hover:bg-accent-soft"
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </span>
              {item.status === "soon" && (
                <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">
                  SOON
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-gray-50 p-4 text-xs text-muted">
        v0.1 · Tickets module active
      </div>
    </aside>
  );
}

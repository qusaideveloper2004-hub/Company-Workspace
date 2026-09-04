import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import ThemeSync from "@/components/theme/ThemeSync";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getUserPreferences } from "@/lib/modules/settings/data";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const currentEmployee = await requireActiveEmployee();
  const preferences = await getUserPreferences(currentEmployee.id);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <ThemeSync theme={preferences.theme} />
      <Sidebar />

      <div className="flex-1 min-h-screen">
        <Navbar />
        <main className="px-6 py-6">{children}</main>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import ThemeProvider from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Workspace",
  description:
    "Internal company portal — Dashboard, Employees, Tickets, Tasks, Announcements, Reports & Settings.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
      </html>
  );
}

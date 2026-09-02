import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getCurrentEmployee } from "@/lib/current-employee";

export async function requireActiveEmployee() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee || currentEmployee.status !== "active") {
    redirect("/unauthorized");
  }

  return currentEmployee;
}

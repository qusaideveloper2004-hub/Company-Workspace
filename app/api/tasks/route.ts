import { NextRequest, NextResponse } from "next/server";

import { getCurrentEmployee } from "@/lib/current-employee";
import { getEmployeeById } from "@/lib/modules/employees/data";
import { getCompanySettings } from "@/lib/modules/settings/data";
import {
  createTask,
  getVisibleTasks,
} from "@/lib/modules/tasks/data";
import { canCreateTask } from "@/lib/permissions/tasks";
import type { CreateTaskInput } from "@/lib/types/task";

export async function GET() {
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return NextResponse.json(
      { error: "Your account is not linked to an employee record." },
      { status: 403 }
    );
  }

  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      { error: "Your employee account is inactive." },
      { status: 403 }
    );
  }

  const tasks = await getVisibleTasks(currentEmployee);

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return NextResponse.json(
      { error: "Your account is not linked to an employee record." },
      { status: 403 }
    );
  }

  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      { error: "Your employee account is inactive." },
      { status: 403 }
    );
  }

  if (!canCreateTask(currentEmployee)) {
    return NextResponse.json(
      { error: "Employees are not allowed to create tasks." },
      { status: 403 }
    );
  }

  const body: CreateTaskInput = await request.json();

  if (
    !body.title ||
    !body.description ||
    !body.priority ||
    !body.department ||
    !body.assignedEmployeeId ||
    !body.dueDate
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const assignedEmployee = await getEmployeeById(
    body.assignedEmployeeId
  );

  if (!assignedEmployee) {
    return NextResponse.json(
      { error: "Assigned employee not found." },
      { status: 404 }
    );
  }

  if (
    currentEmployee.role === "manager" &&
    (
      body.department !== currentEmployee.department ||
      assignedEmployee.department !== currentEmployee.department
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Managers can only create tasks within their own department.",
      },
      { status: 403 }
    );
  }

  const companySettings = await getCompanySettings();

  const task = await createTask(
    body,
    companySettings.defaultTaskStatus
  );

  return NextResponse.json(task, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";

import type { TaskStatus } from "@/lib/generated/prisma/client";
import { getCurrentEmployee } from "@/lib/current-employee";
import {
  deleteTaskFromDatabase,
  getTaskByIdFromDatabase,
  updateTaskStatusFromDatabase,
} from "@/lib/modules/tasks/data";
import {
  canDeleteTask,
  canUpdateTask,
} from "@/lib/permissions/tasks";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
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

  const { id } = await params;
  const task = await getTaskByIdFromDatabase(id);

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  if (!canUpdateTask(currentEmployee, task)) {
    return NextResponse.json(
      { error: "You do not have permission to update this task." },
      { status: 403 }
    );
  }

  const body: { status?: TaskStatus } = await request.json();

  if (!body.status) {
    return NextResponse.json(
      { error: "Status is required." },
      { status: 400 }
    );
  }

  const updatedTask = await updateTaskStatusFromDatabase(
    id,
    body.status
  );

  return NextResponse.json(updatedTask);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
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

  const { id } = await params;
  const task = await getTaskByIdFromDatabase(id);

  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  if (!canDeleteTask(currentEmployee, task)) {
    return NextResponse.json(
      { error: "You do not have permission to delete this task." },
      { status: 403 }
    );
  }

  const deletedTask = await deleteTaskFromDatabase(id);

  return NextResponse.json(deletedTask);
}

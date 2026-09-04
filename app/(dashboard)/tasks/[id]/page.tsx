import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import TaskActions from "@/components/tasks/TaskActions";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getTaskById } from "@/lib/modules/tasks/data";
import {
  canDeleteTask,
  canUpdateTask,
  canViewTask,
} from "@/lib/permissions/tasks";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const currentEmployee = await requireActiveEmployee();
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  if (!canViewTask(currentEmployee, task)) {
    redirect("/unauthorized");
  }

  return (
    <div className="p-6">
      <Link
        href="/tasks"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to tasks
      </Link>

      <div className="mt-4">
        <h1 className="text-xl font-semibold text-foreground">
          {task.title}
        </h1>
        <p className="mt-1 text-xs text-muted">
          Assigned to {task.assignedEmployee.name} · {task.department}
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-foreground">
          Description
        </h2>
        <p className="mt-2 text-sm text-muted">
          {task.description}
        </p>
      </div>

      <TaskActions
        task={task}
        canUpdate={canUpdateTask(currentEmployee, task)}
        canDelete={canDeleteTask(currentEmployee, task)}
      />
    </div>
  );
}

import Link from "next/link";

import type { TaskStatus } from "@/lib/generated/prisma/client";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getVisibleTasks } from "@/lib/modules/tasks/data";
import { canCreateTask } from "@/lib/permissions/tasks";

interface TasksPageProps {
  searchParams: Promise<{ status?: string }>;
}

const statusFilters: {
  label: string;
  value: TaskStatus | undefined;
}[] = [
  { label: "All", value: undefined },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default async function TasksPage({
  searchParams,
}: TasksPageProps) {
  const currentEmployee = await requireActiveEmployee();
  const params = await searchParams;
  const status = params.status as TaskStatus | undefined;
  const tasks = await getVisibleTasks(currentEmployee, { status });
  const canCreate = canCreateTask(currentEmployee);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tasks</h1>
          <p className="mt-1 text-sm text-muted">
            {tasks.length} task{tasks.length !== 1 && "s"}
          </p>
        </div>

        {canCreate && (
          <Link
            href="/tasks/new"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            New Task
          </Link>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        {statusFilters.map((filter) => {
          const isActive =
            (params.status ?? undefined) === filter.value;
          const href = filter.value
            ? `/tasks?status=${filter.value}`
            : "/tasks";

          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
        {tasks.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            No tasks match this filter.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {tasks.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {task.assignedEmployee.name} · {task.department}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                      {task.priority}
                    </span>
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium">
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

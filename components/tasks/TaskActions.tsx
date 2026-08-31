"use client";

import { useRouter } from "next/navigation";
// import { Task, TaskStatus } from "@/lib/types/task";
import {
  Task,
  TaskStatus,
} from "@/lib/generated/prisma/client";

interface TaskActionsProps {
  task: Task;
}

const statusOptions: TaskStatus[] = [
  "todo",
  "in_progress",
  "completed",
];

export default function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter();

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = event.target.value as TaskStatus;

    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });

    router.push("/tasks");
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <label htmlFor="status" className="text-sm text-muted">
          Status
        </label>

        <select
          id="status"
          value={task.status}
          onChange={handleStatusChange}
          className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleDelete}
        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        Delete Task
      </button>
    </div>
  );
}
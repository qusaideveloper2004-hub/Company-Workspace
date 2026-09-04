"use client";

import { useRouter } from "next/navigation";

import type {
  Task,
  TaskStatus,
} from "@/lib/generated/prisma/client";

interface TaskActionsProps {
  task: Task;
  canUpdate: boolean;
  canDelete: boolean;
}

const statusOptions: TaskStatus[] = [
  "todo",
  "in_progress",
  "completed",
];

export default function TaskActions({
  task,
  canUpdate,
  canDelete,
}: TaskActionsProps) {
  const router = useRouter();

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: event.target.value as TaskStatus,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to update task status.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to delete this task.");
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  if (!canUpdate && !canDelete) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      {canUpdate && (
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
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      )}

      {canDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete Task
        </button>
      )}
    </div>
  );
}

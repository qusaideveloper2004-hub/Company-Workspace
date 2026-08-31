import Link from "next/link";
// import { getTaskById } from "@/lib/modules/tasks/data";
import { getTaskByIdFromDatabase } from "@/lib/modules/tasks/data";
import  TaskActions  from "@/components/tasks/TaskActions";

interface TaskDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { id } = await params;

  // const task = getTaskById(id);
  const task = await getTaskByIdFromDatabase(id);

  if (!task) {
    return (
      <div>
        <Link
          href="/tasks"
          className="text-sm text-muted hover:text-foreground"
        >
          ← Back to tasks
        </Link>

        <p className="mt-6 text-sm text-muted">
          This task doesnt exist, or it may have already been deleted.
        </p>
      </div>
    );
  }

  return (
    <div>
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
          {/* Assigned to {task.assignedTo.} · {task.department} */}
          Assigned to {task.assignedEmployee.name}  · {task.department}
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

        <TaskActions task={task} />

    </div>
  );
}
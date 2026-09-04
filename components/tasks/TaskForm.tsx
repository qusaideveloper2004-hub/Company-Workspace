"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type {
  EmployeeDepartment,
  EmployeeRole,
} from "@/lib/generated/prisma/client";
import type {
  CreateTaskInput,
  TaskPriority,
} from "@/lib/types/task";

interface EmployeeOption {
  id: string;
  name: string;
  email: string;
  department: EmployeeDepartment;
  status: "active" | "inactive";
}

interface TaskFormProps {
  currentEmployeeRole: EmployeeRole;
  currentEmployeeDepartment: EmployeeDepartment;
  employees: EmployeeOption[];
}

export default function TaskForm({
  currentEmployeeRole,
  currentEmployeeDepartment,
  employees,
}: TaskFormProps) {
  const router = useRouter();
  const isManager = currentEmployeeRole === "manager";

  const availableEmployees = isManager
    ? employees.filter(
        (employee) =>
          employee.department === currentEmployeeDepartment &&
          employee.status === "active"
      )
    : employees.filter((employee) => employee.status === "active");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const input: CreateTaskInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as TaskPriority,
      department: formData.get("department") as EmployeeDepartment,
      assignedEmployeeId: formData.get(
        "assignedEmployeeId"
      ) as string,
      dueDate: formData.get("dueDate") as string,
    };

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  return (
    <div className="p-6">
      <Link
        href="/tasks"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to tasks
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-foreground">
        New Task
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="text-sm font-medium text-foreground">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="medium"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="text-sm font-medium text-foreground">
              Department
            </label>
            <select
              id="department"
              name="department"
              defaultValue={
                isManager ? currentEmployeeDepartment : "engineering"
              }
              disabled={isManager}
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            >
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
            {isManager && (
              <input
                type="hidden"
                name="department"
                value={currentEmployeeDepartment}
              />
            )}
          </div>
        </div>

        <div>
          <label htmlFor="assignedEmployeeId" className="text-sm font-medium text-foreground">
            Assigned To
          </label>
          <select
            id="assignedEmployeeId"
            name="assignedEmployeeId"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Select an employee
            </option>
            {availableEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} ({employee.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="text-sm font-medium text-foreground">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}

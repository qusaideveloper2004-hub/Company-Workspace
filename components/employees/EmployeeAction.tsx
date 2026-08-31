"use client";

import { useRouter } from "next/navigation";
// import {Employee,EmployeeStatus,} from "@/lib/types/employee";
import { Employee, EmployeeStatus } from "@/lib/generated/prisma/client";
interface EmployeeActionsProps {
  employee: Employee;
}

const statusOptions: EmployeeStatus[] = ["active", "inactive"];

export default function EmployeeActions({ employee }: EmployeeActionsProps) {
  const router = useRouter();

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const newStatus = event.target.value as EmployeeStatus;

    const response = await fetch(`/api/employees/${employee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) {
      alert("Failed to update employee status.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${employee.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/employees/${employee.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete employee.");
      return;
    }

    router.push("/employees");
    router.refresh();
  }

  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface p-4">
      <label htmlFor="status" className="text-sm text-muted">
        Status
      </label>

      <select
        id="status"
        value={employee.status}
        onChange={handleStatusChange}
        className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleDelete}
        className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
      >
        Delete Employee
      </button>
    </div>
  );
}

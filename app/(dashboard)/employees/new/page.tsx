"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CreateEmployeeInput,
  EmployeeDepartment,
  EmployeeRole,
} from "@/lib/types/employee";

export default function NewEmployeePage() {
  const router = useRouter();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const input: CreateEmployeeInput = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      position: formData.get("position") as string,
      department: formData.get(
        "department"
      ) as EmployeeDepartment,
      role: formData.get("role") as EmployeeRole,
    };

    const response = await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json();

      alert(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/employees");
    router.refresh();
  }

  return (
    <div className="p-6">
      <Link
        href="/employees"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to employees
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-foreground">
        Add Employee
      </h1>

      <p className="mt-1 text-sm text-muted">
        Create a new employee for your company.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-lg border border-border bg-surface p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="position"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Position
          </label>

          <input
            id="position"
            name="position"
            required
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="department"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Department
            </label>

            <select
              id="department"
              name="department"
              required
              defaultValue=""
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Select department
              </option>
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              required
              defaultValue="employee"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Create Employee
          </button>

          <Link
            href="/employees"
            className="text-sm text-muted hover:text-foreground"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
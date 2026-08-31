import { getAllEmployees } from "@/lib/modules/employees/data";

import EmployeeTable from "@/components/employees/EmployeeTable";
// import EmployeeAction from "@/components/employees/EmployeeAction";

import Link from "next/link";

export default async function EmployeesPage() {
  const employees = await getAllEmployees();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/employees/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add Employee
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Employees</h1>

        <p className="mt-1 text-sm text-muted">
          Manage employees in your company
        </p>
      </div>

      <EmployeeTable employees={employees} />

      {/* <EmployeeAction employee={employees[0]} /> */}
    </div>
  );
}

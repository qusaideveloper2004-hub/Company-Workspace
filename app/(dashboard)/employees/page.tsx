import EmployeeTable from "@/components/employees/EmployeeTable";
import Link from "next/link";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getAllEmployees } from "@/lib/modules/employees/data";

export default async function EmployeesPage() {
  const currentEmployee = await requireActiveEmployee();
  const employees = await getAllEmployees();

  const canCreateEmployee =
    currentEmployee.role === "admin" ||
    currentEmployee.role === "manager";

  const canViewEmployeeDetails =
    currentEmployee.role === "admin" ||
    currentEmployee.role === "manager";

  return (
    <div className="space-y-6">
      {canCreateEmployee && (
        <div>
          <Link
            href="/employees/new"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Add Employee
          </Link>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Employees</h1>

        <p className="mt-1 text-sm text-muted">
          Manage employees in your company
        </p>
      </div>

      <EmployeeTable
        employees={employees}
        canViewDetails={canViewEmployeeDetails}
      />
    </div>
  );
}

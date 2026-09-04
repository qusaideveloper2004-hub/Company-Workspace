import { redirect } from "next/navigation";

import TaskForm from "@/components/tasks/TaskForm";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getAllEmployees } from "@/lib/modules/employees/data";
import { canCreateTask } from "@/lib/permissions/tasks";

export default async function NewTaskPage() {
  const currentEmployee = await requireActiveEmployee();

  if (!canCreateTask(currentEmployee)) {
    redirect("/unauthorized");
  }

  const employees = await getAllEmployees();

  return (
    <TaskForm
      currentEmployeeRole={currentEmployee.role}
      currentEmployeeDepartment={currentEmployee.department}
      employees={employees}
    />
  );
}

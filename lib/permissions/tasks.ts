import type {
  Employee,
  Task,
} from "@/lib/generated/prisma/client";

type CurrentEmployeeForTaskPermissions = Pick<
  Employee,
  "id" | "role" | "department"
>;

type TaskForPermissions = Pick<
  Task,
  "department" | "assignedEmployeeId"
>;

export function canCreateTask(
  currentEmployee: CurrentEmployeeForTaskPermissions
) {
  return (
    currentEmployee.role === "admin" ||
    currentEmployee.role === "manager"
  );
}

export function canViewTask(
  currentEmployee: CurrentEmployeeForTaskPermissions,
  task: TaskForPermissions
) {
  if (currentEmployee.role === "admin") {
    return true;
  }

  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === task.department
  ) {
    return true;
  }

  return (
    currentEmployee.role === "employee" &&
    currentEmployee.id === task.assignedEmployeeId
  );
}

export function canUpdateTask(
  currentEmployee: CurrentEmployeeForTaskPermissions,
  task: TaskForPermissions
) {
  return canViewTask(currentEmployee, task);
}

export function canDeleteTask(
  currentEmployee: CurrentEmployeeForTaskPermissions,
  task: TaskForPermissions
) {
  return (
    currentEmployee.role === "admin" ||
    (
      currentEmployee.role === "manager" &&
      currentEmployee.department === task.department
    )
  );
}

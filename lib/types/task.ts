import type {
  EmployeeDepartment,
  TaskPriority,
  TaskStatus,
} from "@/lib/generated/prisma/client";

export type {
  EmployeeDepartment as TaskDepartment,
  TaskPriority,
  TaskStatus,
};

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  department: EmployeeDepartment;
  assignedEmployeeId: string;
  dueDate: string;
}

export interface UpdateTaskInput {
  status?: TaskStatus;
  priority?: TaskPriority;
  department?: EmployeeDepartment;
  assignedEmployeeId?: string;
  dueDate?: string;
}

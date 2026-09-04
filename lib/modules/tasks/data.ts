import type {
  Employee,
  TaskPriority,
  TaskStatus,
} from "@/lib/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  CreateTaskInput,
  TaskDepartment,
} from "@/lib/types/task";

interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  department?: TaskDepartment;
}

type CurrentEmployeeForTasks = Pick<
  Employee,
  "id" | "role" | "department"
>;

const taskWithEmployee = {
  assignedEmployee: true,
};

export async function getAllTasks(filters?: TaskFilters) {
  return prisma.task.findMany({
    where: {
      status: filters?.status,
      priority: filters?.priority,
      department: filters?.department,
    },
    include: taskWithEmployee,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getVisibleTasks(
  currentEmployee: CurrentEmployeeForTasks,
  filters?: TaskFilters
) {
  if (currentEmployee.role === "admin") {
    return getAllTasks(filters);
  }

  if (currentEmployee.role === "manager") {
    return prisma.task.findMany({
      where: {
        status: filters?.status,
        priority: filters?.priority,
        department: currentEmployee.department,
      },
      include: taskWithEmployee,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return prisma.task.findMany({
    where: {
      status: filters?.status,
      priority: filters?.priority,
      department: filters?.department,
      assignedEmployeeId: currentEmployee.id,
    },
    include: taskWithEmployee,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAllTasksFromDatabase() {
  return getAllTasks();
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: taskWithEmployee,
  });
}

export async function getTaskByIdFromDatabase(id: string) {
  return getTaskById(id);
}

export async function createTask(
  input: CreateTaskInput,
  initialStatus: TaskStatus
) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: initialStatus,
      department: input.department,
      assignedEmployeeId: input.assignedEmployeeId,
      dueDate: new Date(input.dueDate),
    },
    include: taskWithEmployee,
  });
}

export async function updateTaskStatusFromDatabase(
  id: string,
  status: TaskStatus
) {
  const task = await getTaskById(id);

  if (!task) {
    return undefined;
  }

  return prisma.task.update({
    where: { id },
    data: { status },
    include: taskWithEmployee,
  });
}

export async function deleteTaskFromDatabase(id: string) {
  const task = await getTaskById(id);

  if (!task) {
    return undefined;
  }

  return prisma.task.delete({
    where: { id },
  });
}

export async function getTasksByEmployeeId(employeeId: string) {
  return prisma.task.findMany({
    where: { assignedEmployeeId: employeeId },
    orderBy: { createdAt: "desc" },
  });
}

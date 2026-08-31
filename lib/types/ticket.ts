import type {
  EmployeeDepartment,
  TicketPriority,
  TicketStatus,
} from "@/lib/generated/prisma/client";

export type {
  EmployeeDepartment as Department,
  TicketPriority,
  TicketStatus,
};

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  department: EmployeeDepartment;
  createdByEmployeeId: string;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  department?: EmployeeDepartment;
}

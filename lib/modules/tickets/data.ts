// import { prisma } from "@/lib/prisma";
// import type {
//   CreateTicketInput,
//   Department,
//   TicketPriority,
//   TicketStatus,
//   UpdateTicketInput,
// } from "@/lib/types/ticket";

// interface TicketFilters {
//   status?: TicketStatus;
//   priority?: TicketPriority;
//   department?: Department;
// }

// const ticketWithCreator = {
//   createdBy: true,
// };

// export async function getAllTickets(filters?: TicketFilters) {
//   return prisma.ticket.findMany({
//     where: {
//       status: filters?.status,
//       priority: filters?.priority,
//       department: filters?.department,
//     },
//     include: ticketWithCreator,
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

// export async function getTicketById(id: string) {
//   return prisma.ticket.findUnique({
//     where: { id },
//     include: ticketWithCreator,
//   });
// }

// export async function createTicket(input: CreateTicketInput) {
//   return prisma.ticket.create({
//     data: input,
//     include: ticketWithCreator,
//   });
// }

// export async function updateTicket(
//   id: string,
//   input: UpdateTicketInput
// ) {
//   const ticket = await getTicketById(id);

//   if (!ticket) {
//     return undefined;
//   }

//   return prisma.ticket.update({
//     where: { id },
//     data: input,
//     include: ticketWithCreator,
//   });
// }

// export async function deleteTicket(id: string) {
//   const ticket = await getTicketById(id);

//   if (!ticket) {
//     return undefined;
//   }

//   return prisma.ticket.delete({
//     where: { id },
//   });
// }

// export async function getTicketsByEmployeeId(employeeId: string) {
//   return prisma.ticket.findMany({
//     where: { createdByEmployeeId: employeeId },
//     orderBy: { createdAt: "desc" },
//   });
// }


import { prisma } from "@/lib/prisma";
import type {
  CreateTicketInput,
  Department,
  TicketPriority,
  TicketStatus,
  UpdateTicketInput,
} from "@/lib/types/ticket";
import type { EmployeeRole } from "@/lib/generated/prisma/client";

interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  department?: Department;
}

interface CurrentEmployeeForTickets {
  id: string;
  role: EmployeeRole;
  department: Department;
}

const ticketWithCreator = {
  createdBy: true,
};

export async function getAllTickets(
  filters?: TicketFilters
) {
  return prisma.ticket.findMany({
    where: {
      status: filters?.status,
      priority: filters?.priority,
      department: filters?.department,
    },
    include: ticketWithCreator,
    orderBy: {
      createdAt: "desc",
    },
  });
}

// هذه الدالة ترجع فقط التذاكر التي يحق للموظف الحالي رؤيتها.
export async function getVisibleTickets(
  currentEmployee: CurrentEmployeeForTickets,
  filters?: TicketFilters
) {
  // الأدمن يرى كل التذاكر، مع تطبيق الفلاتر إن وُجدت.
  if (currentEmployee.role === "admin") {
    return getAllTickets(filters);
  }

  // المدير يرى تذاكر قسمه فقط.
  if (currentEmployee.role === "manager") {
    return prisma.ticket.findMany({
      where: {
        status: filters?.status,
        priority: filters?.priority,
        department: currentEmployee.department,
      },
      include: ticketWithCreator,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // الموظف العادي يرى التذاكر التي أنشأها فقط.
  return prisma.ticket.findMany({
    where: {
      status: filters?.status,
      priority: filters?.priority,
      department: filters?.department,
      createdByEmployeeId: currentEmployee.id,
    },
    include: ticketWithCreator,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: ticketWithCreator,
  });
}

export async function createTicket(input: CreateTicketInput) {
  return prisma.ticket.create({
    data: input,
    include: ticketWithCreator,
  });
}

export async function updateTicket(
  id: string,
  input: UpdateTicketInput
) {
  const ticket = await getTicketById(id);

  if (!ticket) {
    return undefined;
  }

  return prisma.ticket.update({
    where: { id },
    data: input,
    include: ticketWithCreator,
  });
}

export async function deleteTicket(id: string) {
  const ticket = await getTicketById(id);

  if (!ticket) {
    return undefined;
  }

  return prisma.ticket.delete({
    where: { id },
  });
}

export async function getTicketsByEmployeeId(
  employeeId: string
) {
  return prisma.ticket.findMany({
    where: { createdByEmployeeId: employeeId },
    orderBy: { createdAt: "desc" },
  });
}
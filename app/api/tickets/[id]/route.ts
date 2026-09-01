// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// import {
//   deleteTicket,
//   getTicketById,
//   updateTicket,
// } from "@/lib/modules/tickets/data";
// import type { UpdateTicketInput } from "@/lib/types/ticket";

// interface RouteContext {
//   params: Promise<{ id: string }>;
// }

// export async function GET(
//   _request: NextRequest,
//   { params }: RouteContext
// ) {
//   const { id } = await params;
//   const ticket = await getTicketById(id);

//   if (!ticket) {
//     return NextResponse.json(
//       { error: "Ticket not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(ticket);
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: RouteContext
// ) {
//   const { id } = await params;
//   const body: UpdateTicketInput = await request.json();
//   const updatedTicket = await updateTicket(id, body);

//   if (!updatedTicket) {
//     return NextResponse.json(
//       { error: "Ticket not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(updatedTicket);
// }

// export async function DELETE(
//   _request: NextRequest,
//   { params }: RouteContext
// ) {
//   const { userId, sessionClaims } = await auth();

//   if (!userId) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const role =
//     typeof sessionClaims?.metadata === "object" &&
//     sessionClaims.metadata !== null &&
//     "role" in sessionClaims.metadata
//       ? String((sessionClaims.metadata as { role?: unknown }).role)
//       : "employee";

//   if (role !== "admin") {
//     return NextResponse.json(
//       { error: "Forbidden" },
//       { status: 403 }
//     );
//   }

//   const { id } = await params;
//   const deletedTicket = await deleteTicket(id);

//   if (!deletedTicket) {
//     return NextResponse.json(
//       { error: "Ticket not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(deletedTicket);
// }



import { NextRequest, NextResponse } from "next/server";

import { getCurrentEmployee } from "@/lib/current-employee";
import {
  deleteTicket,
  getTicketById,
  updateTicket,
} from "@/lib/modules/tickets/data";
import type {
  Department,
  UpdateTicketInput,
} from "@/lib/types/ticket";
import type { EmployeeRole } from "@/lib/generated/prisma/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// هذه الدالة تسأل:
// هل الموظف الحالي مسموح له يعدّل هذه التذكرة؟
function canUpdateTicket(
  currentEmployee: {
    id: string;
    role: EmployeeRole;
    department: Department;
  },
  ticket: {
    department: Department;
    createdByEmployeeId: string;
  }
) {
  // الأدمن يملك صلاحية تعديل كل التذاكر.
  if (currentEmployee.role === "admin") {
    return true;
  }

  // المدير يعدّل التذاكر التابعة لقسمه فقط.
  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === ticket.department
  ) {
    return true;
  }

  // الموظف العادي يعدّل التذكرة التي أنشأها فقط.
  if (
    currentEmployee.role === "employee" &&
    currentEmployee.id === ticket.createdByEmployeeId
  ) {
    return true;
  }

  // أي حالة أخرى ممنوعة.
  return false;
}

// هذه الدالة تسأل:
// هل الموظف الحالي مسموح له يحذف هذه التذكرة؟
function canDeleteTicket(
  currentEmployee: {
    role: EmployeeRole;
    department: Department;
  },
  ticket: {
    department: Department;
  }
) {
  // الأدمن يحذف أي تذكرة.
  if (currentEmployee.role === "admin") {
    return true;
  }

  // المدير يحذف تذاكر قسمه فقط.
  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === ticket.department
  ) {
    return true;
  }

  // الموظف العادي ليس لديه صلاحية حذف.
  return false;
}

function canViewTicket(
  currentEmployee: {
    id: string;
    role: EmployeeRole;
    department: Department;
  },
  ticket: {
    department: Department;
    createdByEmployeeId: string;
  }
) {
  if (currentEmployee.role === "admin") {
    return true;
  }

  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === ticket.department
  ) {
    return true;
  }

  if (
    currentEmployee.role === "employee" &&
    currentEmployee.id === ticket.createdByEmployeeId
  ) {
    return true;
  }

  return false;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      { error: "Your employee account is inactive." },
      { status: 403 }
    );
  }

  const { id } = await params;

  const ticket = await getTicketById(id);

  if (!ticket || !canViewTicket(currentEmployee, ticket)) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(ticket);
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  // 1) نعرف من هو الشخص الذي أرسل طلب التعديل.
  const currentEmployee = await getCurrentEmployee();

  // 2) نرفض الحساب غير المربوط بسجل Employee.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // 3) نمنع الحساب غير النشط.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // 4) نأخذ id التذكرة من الرابط.
  const { id } = await params;

  // 5) نجلب التذكرة نفسها حتى نقارن القسم والمنشئ.
  const ticket = await getTicketById(id);

  if (!ticket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  // 6) نتحقق من الصلاحية قبل أي تعديل في Neon.
  if (!canUpdateTicket(currentEmployee, ticket)) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to update this ticket.",
      },
      { status: 403 }
    );
  }

  // 7) بعد النجاح نقرأ البيانات التي يريد المستخدم تعديلها.
  const body: UpdateTicketInput = await request.json();

  // لا نقبل طلب تعديل فارغ.
  if (
    !body.status &&
    !body.priority &&
    !body.department
  ) {
    return NextResponse.json(
      { error: "At least one field is required." },
      { status: 400 }
    );
  }

  // 8) الآن فقط نحدّث التذكرة في Neon.
  const updatedTicket = await updateTicket(id, body);

  return NextResponse.json(updatedTicket);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  // 1) نعرف صاحب طلب الحذف.
  const currentEmployee = await getCurrentEmployee();

  // 2) نمنع الحساب غير المربوط.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // 3) نمنع الحساب غير النشط.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // 4) نأخذ id التذكرة من الرابط.
  const { id } = await params;

  // 5) نجلب التذكرة أولًا، لأننا نحتاج قسمها لفحص الصلاحية.
  const ticket = await getTicketById(id);

  if (!ticket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  // 6) نتحقق من صلاحية الحذف قبل تنفيذ الحذف.
  if (!canDeleteTicket(currentEmployee, ticket)) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to delete this ticket.",
      },
      { status: 403 }
    );
  }

  // 7) بعد نجاح كل الفحوصات نحذف من Neon.
  const deletedTicket = await deleteTicket(id);

  return NextResponse.json(deletedTicket);
}

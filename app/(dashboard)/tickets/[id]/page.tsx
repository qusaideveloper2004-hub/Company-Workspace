// import Link from "next/link";
// import { getTicketById } from "@/lib/modules/tickets/data";
// import TicketActions from "@/components/tickets/TicketActions";
// interface TicketDetailPageProps {
//   params: Promise<{ id: string }>;
// }



// export default async function TicketDetailPage({
//   params,
// }: TicketDetailPageProps) {
//   const { id } = await params;
//   const ticket = await getTicketById(id);

//   // حالة التذكرة مش موجودة (اتحذفت، أو الرابط غلط)
//   if (!ticket) {
//     return (
//       <div className="p-6">
//         <Link
//           href="/tickets"
//           className="text-sm text-accent hover:underline"
//         >
//           ← Back to tickets
//         </Link>
//         <p className="mt-6 text-sm text-muted">
//           This ticket doesn&apos;t exist, or it may have already been deleted.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl p-6">
//       <Link
//         href="/tickets"
//         className="text-sm text-muted hover:text-foreground"
//       >
//         ← Back to tickets
//       </Link>

//       <div className="mt-4 flex items-start justify-between gap-4">
//         <h1 className="text-xl font-semibold text-foreground">
//           {ticket.title}
//         </h1>

//         <div className="flex shrink-0 gap-2">
//           <span
//             className={`rounded-full border px-2.5 py-1 text-xs font-medium ${[ticket.priority]}`}
//           >
//             {ticket.priority}
//           </span>
//           <span
//             className={`rounded-full px-2.5 py-1 text-xs font-medium ${[ticket.status]}`}
//           >
//             {ticket.status}
//           </span>
//         </div>
//       </div>

//       <p className="mt-1 text-xs text-muted">
//         Opened by {ticket.createdBy.name} · {ticket.department} ·{" "}
//         {new Date(ticket.createdAt).toLocaleDateString()}
//       </p>

//       <div className="mt-6 rounded-lg border border-border bg-surface p-5">
//         <h2 className="text-sm font-medium text-foreground">Description</h2>
//         <p className="mt-2 text-sm text-muted">{ticket.description}</p>
//       </div>

//       <TicketActions ticket={ticket} />
      
//     </div>
//   );
// }


import Link from "next/link";

import TicketActions from "@/components/tickets/TicketActions";
import { getCurrentEmployee } from "@/lib/current-employee";
import { getTicketById } from "@/lib/modules/tickets/data";
import type { EmployeeRole } from "@/lib/generated/prisma/client";
import type { Department } from "@/lib/types/ticket";

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

// هذه الدالة تفحص: هل الموظف الحالي مسموح له برؤية التذكرة؟
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
  // الأدمن يرى كل التذاكر.
  if (currentEmployee.role === "admin") {
    return true;
  }

  // المدير يرى تذاكر قسمه فقط.
  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === ticket.department
  ) {
    return true;
  }

  // الموظف يرى التذاكر التي أنشأها فقط.
  if (
    currentEmployee.role === "employee" &&
    currentEmployee.id === ticket.createdByEmployeeId
  ) {
    return true;
  }

  return false;
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  // 1) نأخذ id التذكرة من الرابط.
  const { id } = await params;

  // 2) نعرف الموظف الحقيقي الحالي من Clerk ثم Neon.
  const currentEmployee = await getCurrentEmployee();

  // 3) نرفض الحساب غير المربوط.
  if (!currentEmployee) {
    return (
      <div className="p-6">
        <Link
          href="/tickets"
          className="text-sm text-accent hover:underline"
        >
          ← Back to tickets
        </Link>

        <p className="mt-6 text-sm text-muted">
          Your account is not linked to an employee record.
        </p>
      </div>
    );
  }

  // 4) نرفض الحساب غير النشط.
  if (currentEmployee.status !== "active") {
    return (
      <div className="p-6">
        <Link
          href="/tickets"
          className="text-sm text-accent hover:underline"
        >
          ← Back to tickets
        </Link>

        <p className="mt-6 text-sm text-muted">
          Your employee account is inactive.
        </p>
      </div>
    );
  }

  // 5) نجلب التذكرة المطلوبة من Neon.
  const ticket = await getTicketById(id);

  // 6) لا نعرضها إن لم تكن موجودة،
  // أو كانت موجودة لكن الموظف لا يملك صلاحية رؤيتها.
  if (!ticket || !canViewTicket(currentEmployee, ticket)) {
    return (
      <div className="p-6">
        <Link
          href="/tickets"
          className="text-sm text-accent hover:underline"
        >
          ← Back to tickets
        </Link>

        <p className="mt-6 text-sm text-muted">
          This ticket doesn&apos;t exist, or you do not have
          permission to view it.
        </p>
      </div>
    );
  }

  // 7) وصلنا هنا معناها أن الموظف مسموح له برؤية التذكرة.
  return (
    <div className="max-w-2xl p-6">
      <Link
        href="/tickets"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to tickets
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {ticket.title}
        </h1>

        <div className="flex shrink-0 gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${[
              ticket.priority,
            ]}`}
          >
            {ticket.priority}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${[
              ticket.status,
            ]}`}
          >
            {ticket.status}
          </span>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted">
        Opened by {ticket.createdBy.name} · {ticket.department} ·{" "}
        {new Date(ticket.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-foreground">
          Description
        </h2>

        <p className="mt-2 text-sm text-muted">
          {ticket.description}
        </p>
      </div>

      <TicketActions ticket={ticket} />
    </div>
  );
}
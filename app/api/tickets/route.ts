import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
import { getCurrentEmployee } from "@/lib/current-employee";
import { createTicket, getAllTickets } from "@/lib/modules/tickets/data";
import type {
  CreateTicketInput,
  Department,
  TicketPriority,
  TicketStatus,
} from "@/lib/types/ticket";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const tickets = await getAllTickets({
    status: (searchParams.get("status") ?? undefined) as
      | TicketStatus
      | undefined,
    priority: (searchParams.get("priority") ?? undefined) as
      | TicketPriority
      | undefined,
    department: (searchParams.get("department") ?? undefined) as
      | Department
      | undefined,
  });

  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  try {
    // const { userId } = await auth();
    const currentEmployee = await getCurrentEmployee();

    // if (!userId) {
    if (!currentEmployee) {
      return NextResponse.json(
        // { error: "Unauthorized" },
        // { status: 401 }
        {
          error: "Your account is not linked to an employee record.",
        },
        {
          status: 403,
        },
      );
    }

  // const body: CreateTicketInput = await request.json();

  // معناها: نفس شكل بيانات إنشاء Ticket، لكن بدون حقل createdByEmployeeId.
  const body: Omit<CreateTicketInput, "createdByEmployeeId"> =
    await request.json();

    // الآن صاحب الـ Ticket يأتي من Clerk ثم Neon، وليس من المستخدم أو الـ Form. 

//   if (
//     !body.title ||
//     !body.description ||
//     !body.priority ||
//     !body.department ||
//     !body.createdByEmployeeId
//   ) {
//     return NextResponse.json(
//       { error: "All fields are required." },
//       { status: 400 },
//     );
//   }

//   const ticket = await createTicket(body);

//   return NextResponse.json(ticket, { status: 201 });
// }



 if (
    !body.title ||
    !body.description ||
    !body.priority ||
    !body.department
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

    const ticket = await createTicket({
      ...body,
      createdByEmployeeId: currentEmployee.id,
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticket:", error);

    const details =
      error instanceof Error ? error.message : "Unknown server error.";

    return NextResponse.json(
      {
        error: "The server could not create this ticket.",
        ...(process.env.NODE_ENV === "development" && { details }),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import {
  deleteTicket,
  getTicketById,
  updateTicket,
} from "@/lib/modules/tickets/data";
import type { UpdateTicketInput } from "@/lib/types/ticket";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
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
  const { id } = await params;
  const body: UpdateTicketInput = await request.json();
  const updatedTicket = await updateTicket(id, body);

  if (!updatedTicket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedTicket);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const role =
    typeof sessionClaims?.metadata === "object" &&
    sessionClaims.metadata !== null &&
    "role" in sessionClaims.metadata
      ? String((sessionClaims.metadata as { role?: unknown }).role)
      : "employee";

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const deletedTicket = await deleteTicket(id);

  if (!deletedTicket) {
    return NextResponse.json(
      { error: "Ticket not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(deletedTicket);
}

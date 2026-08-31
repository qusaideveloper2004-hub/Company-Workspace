import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  deleteEmployee,
  updateEmployee,
} from "@/lib/modules/employees/data";

import { UpdateEmployeeInput } from "@/lib/types/employee";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;

  const body: UpdateEmployeeInput =
    await request.json();

  const updatedEmployee = await updateEmployee(
    id,
    body
  );

  if (!updatedEmployee) {
    return NextResponse.json(
      { error: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedEmployee);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  const { id } = await params;

  const deletedEmployee = await deleteEmployee(id);

  if (!deletedEmployee) {
    return NextResponse.json(
      { error: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(deletedEmployee);
}
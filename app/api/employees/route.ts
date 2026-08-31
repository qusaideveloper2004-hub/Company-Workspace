import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  EmployeeDepartment,
  EmployeeRole,
} from "@/lib/generated/prisma/client";

export async function GET() {
  const employees = await prisma.employee.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    name,
    email,
    position,
    department,
    role,
  } = body;

  if (!name || !email || !position || !department || !role) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const existingEmployee = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  if (existingEmployee) {
    return NextResponse.json(
      { error: "An employee with this email already exists." },
      { status: 409 }
    );
  }

  const employee = await prisma.employee.create({
    data: {
      name,
      email,
      position,
      department: department as EmployeeDepartment,
      role: role as EmployeeRole,
    },
  });

  return NextResponse.json(employee, {
    status: 201,
  });
}

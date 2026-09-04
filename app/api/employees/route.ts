// import { NextRequest, NextResponse } from "next/server";

// import { prisma } from "@/lib/prisma";
// import {
//   EmployeeDepartment,
//   EmployeeRole,
// } from "@/lib/generated/prisma/client";
// import { getCurrentEmployee } from "@/lib/current-employee";

// export async function GET() {

//   const currentEmployee = await getCurrentEmployee();

//   if (!currentEmployee) {
//     return NextResponse.json(
//       { error: "Your account is not linked to an employee record." },
//       { status: 403 }
//     );
//   }

//   if (currentEmployee.status !== "active") {
//     return NextResponse.json(
//       { error: "You do not have permission to view employees Because your account is not active." },
//       { status: 403 }
//     );
//   }

//   const employees = await prisma.employee.findMany({
//     orderBy: {
//       name: "asc",
//     },
//   });

//   return NextResponse.json(employees);
// }

// export async function POST(request: NextRequest) {

//   const currentEmployee = await getCurrentEmployee();

//   if (!currentEmployee) {
//     return NextResponse.json(
//       { error: "Your account is not linked to an employee record." },
//       { status: 403 }
//     );
//   }

//   if (currentEmployee.status !== "active") {
//     return NextResponse.json(
//       { error: "You do not have permission to create employees Because your account is not active." },
//       { status: 403 }
//     );
//   }

//     if (
//           currentEmployee.role !== "admin" &&
//           currentEmployee.role !== "manager"
//         ) {
//     return NextResponse.json(
//       { error: "You do not have permission to create employees." },
//       { status: 403 }
//     );
//   }

//   const body = await request.json();

//   const {
//     name,
//     email,
//     position,
//     department,
//     role,
//   } = body;

//   if (!name || !email || !position || !department || !role) {
//     return NextResponse.json(
//       { error: "All fields are required." },
//       { status: 400 }
//     );
//   }

//   const existingEmployee = await prisma.employee.findUnique({
//     where: {
//       email,
//     },
//   });

//   if (existingEmployee) {
//     return NextResponse.json(
//       { error: "An employee with this email already exists." },
//       { status: 409 }
//     );
//   }

//   const employee = await prisma.employee.create({
//     data: {
//       name,
//       email,
//       position,
//       department: department as EmployeeDepartment,
//       role: role as EmployeeRole,
//     },
//   });

//   return NextResponse.json(employee, {
//     status: 201,
//   });
// }



import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCurrentEmployee } from "@/lib/current-employee";
import {
  EmployeeDepartment,
  EmployeeRole,
} from "@/lib/generated/prisma/client";

export async function GET() {
  // نعرف الحساب المسجل حاليًا ونربطه بسجل Employee في Neon.
  const currentEmployee = await getCurrentEmployee();

  // نمنع أي حساب غير مربوط بموظف.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // نمنع الموظف غير النشط من استخدام بيانات الشركة.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // كل موظف نشط، مهما كان دوره، مسموح له برؤية قائمة الموظفين.
  const employees = await prisma.employee.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(employees);
}

export async function POST(request: NextRequest) {
  // قبل إنشاء أي موظف، نعرف من أرسل الطلب.
  const currentEmployee = await getCurrentEmployee();

  // الحساب غير المربوط لا ينشئ موظفين.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // الحساب غير النشط لا ينشئ موظفين.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // الـEmployee العادي ليس له صلاحية إنشاء موظفين.
  if (
    currentEmployee.role !== "admin" &&
    currentEmployee.role !== "manager"
  ) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to create employees.",
      },
      { status: 403 }
    );
  }

  // بعد نجاح فحص الصلاحيات، نقرأ بيانات الموظف الجديد من الفورم.
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

  // الـManager لا يستطيع إنشاء Admin أو Manager آخر.
  if (
    currentEmployee.role === "manager" &&
    role !== "employee"
  ) {
    return NextResponse.json(
      {
        error:
          "Managers can only create employees with the employee role.",
      },
      { status: 403 }
    );
  }

  // الـManager ينشئ موظفين في قسمه فقط، وليس في قسم آخر.
  if (
    currentEmployee.role === "manager" &&
    department !== currentEmployee.department
  ) {
    return NextResponse.json(
      {
        error:
          "Managers can only create employees in their own department.",
      },
      { status: 403 }
    );
  }

  // البريد الإلكتروني unique في قاعدة البيانات، فنفحصه أولًا.
  const existingEmployee = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  if (existingEmployee) {
    return NextResponse.json(
      {
        error:
          "An employee with this email already exists.",
      },
      { status: 409 }
    );
  }

  // الـAdmin يمكنه اختيار أي role وأي department.
  // الـManager وصل هنا بعد أن تأكدنا أنه يضيف Employee في قسمه.
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
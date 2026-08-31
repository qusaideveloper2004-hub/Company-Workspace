// import { NextRequest, NextResponse } from "next/server";

// import { getCurrentEmployee } from "@/lib/current-employee";
// import {
//   createTask,
//   getAllTasks,
// } from "@/lib/modules/tasks/data";
// import type { CreateTaskInput } from "@/lib/types/task";

// export async function GET() {
//   const tasks = await getAllTasks();

//   return NextResponse.json(tasks);
// }

// export async function POST(request: NextRequest) {
//   const currentEmployee = await getCurrentEmployee();

//   // هشوف الصلاحيات الاول وبعدين انشاء التذكره عشان كدا خليتها فوق 
//   if (!currentEmployee) {
//     return NextResponse.json(
//       {
//         error:
//           "Your account is not linked to an employee record.",
//       },
//       {
//         status: 403,
//       }
//     );
//   }

//   const body: CreateTaskInput = await request.json();

//   if (
//     !body.title ||
//     !body.description ||
//     !body.priority ||
//     !body.department ||
//     !body.assignedEmployeeId ||
//     !body.dueDate
//   ) {
//     return NextResponse.json(
//       { error: "All fields are required." },
//       { status: 400 }
//     );
//   }

//   const task = await createTask(body);

//   return NextResponse.json(task, { status: 201 });
// }



import { NextRequest, NextResponse } from "next/server";

import { getCurrentEmployee } from "@/lib/current-employee";
import { getEmployeeById } from "@/lib/modules/employees/data";
import {
  createTask,
  getAllTasks,
} from "@/lib/modules/tasks/data";
import type { CreateTaskInput } from "@/lib/types/task";

export async function GET() {
  const tasks = await getAllTasks();

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  // نعرف من هو الشخص الذي يحاول إنشاء الـ Task
  const currentEmployee = await getCurrentEmployee();

  // غير مسجل، أو حساب Clerk غير مربوط بـ Employee في Neon
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // حساب Employee غير نشط: ممنوع من إنشاء Tasks
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // نقرأ بيانات المهمة القادمة من الـ Form
  const body: CreateTaskInput = await request.json();

  // نتحقق أن البيانات الأساسية موجودة
  if (
    !body.title ||
    !body.description ||
    !body.priority ||
    !body.department ||
    !body.assignedEmployeeId ||
    !body.dueDate
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  // Employee العادي ممنوع من إنشاء Tasks
  if (currentEmployee.role === "employee") {
    return NextResponse.json(
      {
        error:
          "Employees are not allowed to create tasks.",
      },
      { status: 403 }
    );
  }

  // نأتي بالموظف الذي اختاره المنشئ لتُسند له المهمة
  const assignedEmployee = await getEmployeeById(
    body.assignedEmployeeId
  );

  // لو ID المُرسل لا يخص Employee موجود
  if (!assignedEmployee) {
    return NextResponse.json(
      { error: "Assigned employee not found." },
      { status: 404 }
    );
  }

  // Manager لا ينشئ Task إلا لموظف في نفس القسم
  if (
    currentEmployee.role === "manager" &&
    assignedEmployee.department !== currentEmployee.department
  ) {
    return NextResponse.json(
      {
        error:
          "Managers can only assign tasks within their department.",
      },
      { status: 403 }
    );
  }

  // Admin يصل هنا ويسند المهمة لأي Employee.
  // Manager يصل هنا فقط بعد نجاح مقارنة القسم.
  const task = await createTask(body);

  return NextResponse.json(task, { status: 201 });
}
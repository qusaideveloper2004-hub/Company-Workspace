import { NextRequest, NextResponse } from "next/server";

// بجيب نوع الحالة من Prisma عشان ميسمحش غير بالحالات الصح
import { TaskStatus } from "@/lib/generated/prisma/client";

// الدالة دي بتجيب الموظف الحالي:
// Clerk يجيب userId → Neon تجيب Employee المرتبط بيه
import { getCurrentEmployee } from "@/lib/current-employee";

// دي الدوال اللي بتتعامل مع جدول Tasks في Neon
import {
  deleteTaskFromDatabase,
  getTaskByIdFromDatabase,
  updateTaskStatusFromDatabase,
} from "@/lib/modules/tasks/data";

// Next بيبعت id اللي جاي من الرابط، زي: /api/tasks/task_123
interface RouteContext {
  params: Promise<{ id: string }>;
}

// الدالة دي مسؤولة عن صلاحية تعديل حالة الـ Task
function canUpdateTask(
  currentEmployee: {
    id: string;
    role: string;
    department: string;
  },
  task: {
    department: string;
    assignedEmployeeId: string;
  }
) {
  // الـ Admin يقدر يعدل أي Task بدون مقارنة
  if (currentEmployee.role === "admin") {
    return true;
  }

  // الـ Manager يقدر يعدل بس Tasks الموجودة في قسمه
  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === task.department
  ) {
    return true;
  }

  // الـ Employee يقدر يعدل حالة الـ Task لو هي متسندة إليه هو فقط
  if (
    currentEmployee.role === "employee" &&
    currentEmployee.id === task.assignedEmployeeId
  ) {
    return true;
  }

  // أي حالة غير اللي فوق: لا يملك صلاحية التعديل
  return false;
}

// الدالة دي مسؤولة عن صلاحية حذف الـ Task
function canDeleteTask(
  currentEmployee: {
    role: string;
    department: string;
  },
  task: {
    department: string;
  }
) {
  // الـ Admin يقدر يحذف أي Task
  if (currentEmployee.role === "admin") {
    return true;
  }

  // الـ Manager يقدر يحذف Task لو هي في نفس قسمه
  if (
    currentEmployee.role === "manager" &&
    currentEmployee.department === task.department
  ) {
    return true;
  }

  // الـ Employee ممنوع من الحذف في كل الحالات
  return false;
}

// PUT معناها تعديل Task موجودة
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  // أول حاجة: نعرف الشخص اللي بعت طلب التعديل
  const currentEmployee = await getCurrentEmployee();

  // لو مفيش Login أو الحساب مش مربوط بـ Employee في Neon
  // منسمحش له يعدل
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // حتى لو الحساب مربوط، لو Employee حالته inactive
  // يبقى ممنوع يعدل أو يحذف
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // بناخد id بتاع الـ Task من الرابط
  const { id } = await params;

  // بنجيب الـ Task الحقيقية من Neon
  // عشان نعرف قسمها ولمين متسندة
  const task = await getTaskByIdFromDatabase(id);

  // لو الـ id مش موجود في قاعدة البيانات
  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  // هنا بنقارن الموظف الحالي بالـ Task
  // Admin أو Manager نفس القسم أو Employee المهمة له؟
  if (!canUpdateTask(currentEmployee, task)) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to update this task.",
      },
      { status: 403 }
    );
  }

  // بعد ما اتأكدنا أن المستخدم مسموح له،
  // نقرأ البيانات القادمة من TaskActions
  const body: { status?: TaskStatus } = await request.json();

  // لازم يرسل status جديدة
  if (!body.status) {
    return NextResponse.json(
      { error: "Status is required." },
      { status: 400 }
    );
  }

  // هنا فقط نعدل حالة الـ Task في Neon
  const updatedTask = await updateTaskStatusFromDatabase(
    id,
    body.status
  );

  // نرجع الـ Task بعد التعديل للـ Client
  return NextResponse.json(updatedTask);
}

// DELETE معناها حذف Task موجودة
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  // نعرف مين اللي بعت طلب الحذف
  const currentEmployee = await getCurrentEmployee();

  // لازم يكون مسجل دخول ومربوط بـ Employee
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // لو الحساب inactive ممنوع يعمل أي عملية
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // بناخد id الـ Task من الرابط
  const { id } = await params;

  // نجيب الـ Task قبل الحذف
  // لأننا محتاجين قسمها للحكم على صلاحية الـ Manager
  const task = await getTaskByIdFromDatabase(id);

  // لو مش موجودة لا نحاول نحذفها
  if (!task) {
    return NextResponse.json(
      { error: "Task not found" },
      { status: 404 }
    );
  }

  // هنا Admin مسموح له،
  // Manager لو من نفس القسم،
  // Employee ممنوع في كل الحالات
  if (!canDeleteTask(currentEmployee, task)) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to delete this task.",
      },
      { status: 403 }
    );
  }

  // بعد كل فحوصات الحماية، نحذف Task من Neon
  const deletedTask = await deleteTaskFromDatabase(id);

  // نرجع الـ Task التي تم حذفها
  return NextResponse.json(deletedTask);
}
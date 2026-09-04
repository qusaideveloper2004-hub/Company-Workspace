// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// import {
//   deleteEmployee,
//   updateEmployee,
// } from "@/lib/modules/employees/data";

// import { UpdateEmployeeInput } from "@/lib/types/employee";

// interface RouteContext {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: RouteContext
// ) {
//   const { id } = await params;

//   const body: UpdateEmployeeInput =
//     await request.json();

//   const updatedEmployee = await updateEmployee(
//     id,
//     body
//   );

//   if (!updatedEmployee) {
//     return NextResponse.json(
//       { error: "Employee not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(updatedEmployee);
// }

// export async function DELETE(
//   _request: NextRequest,
//   { params }: RouteContext
// ) {
//   const { id } = await params;

//   const deletedEmployee = await deleteEmployee(id);

//   if (!deletedEmployee) {
//     return NextResponse.json(
//       { error: "Employee not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(deletedEmployee);
// }



import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getCurrentEmployee } from "@/lib/current-employee";
import {
  deleteEmployee,
  getEmployeeById,
  updateEmployee,
} from "@/lib/modules/employees/data";
import type { UpdateEmployeeInput } from "@/lib/types/employee";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  // 1. نعرف من أرسل طلب التعديل.
  const currentEmployee = await getCurrentEmployee();

  // 2. نرفض الحساب غير المربوط بسجل Employee.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // 3. نرفض الموظف غير النشط.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // 4. نأخذ id الموظف المطلوب تعديل حالته من الرابط.
  const { id } = await params;

  // 5. نجلب الموظف المستهدف، لأن المدير يحتاج معرفة قسمه ودوره.
  const targetEmployee = await getEmployeeById(id);

  if (!targetEmployee) {
    return NextResponse.json(
      { error: "Employee not found" },
      { status: 404 }
    );
  }

  // 6. الـEmployee العادي لا يملك تعديل حالة أي موظف.
  if (currentEmployee.role === "employee") {
    return NextResponse.json(
      {
        error:
          "You do not have permission to update employees.",
      },
      { status: 403 }
    );
  }

  // 7. الـManager يعدّل موظفًا عاديًا من قسمه فقط.
  if (
    currentEmployee.role === "manager" &&
    (
      targetEmployee.department !== currentEmployee.department ||
      targetEmployee.role !== "employee"
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Managers can only update employees in their own department.",
      },
      { status: 403 }
    );
  }

  // 8. بعد نجاح الصلاحيات، نقرأ البيانات القادمة من الواجهة.
  const body: UpdateEmployeeInput =
    await request.json();

  // التعديل المتاح حاليًا في المشروع هو حالة الموظف فقط.
  if (!body.status) {
    return NextResponse.json(
      { error: "Status is required." },
      { status: 400 }
    );
  }

  // 9. الـAdmin يعدل أي موظف، والـManager وصل هنا بعد تحقق قيوده.
  const updatedEmployee = await updateEmployee(
    id,
    body
  );

  return NextResponse.json(updatedEmployee);
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  // 1. نعرف من أرسل طلب الحذف.
  const currentEmployee = await getCurrentEmployee();

  // 2. نرفض الحساب غير المربوط.
  if (!currentEmployee) {
    return NextResponse.json(
      {
        error:
          "Your account is not linked to an employee record.",
      },
      { status: 403 }
    );
  }

  // 3. نرفض الموظف غير النشط.
  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      {
        error: "Your employee account is inactive.",
      },
      { status: 403 }
    );
  }

  // 4. الحذف قرار إداري كامل، لذلك الـAdmin فقط مسموح له.
  if (currentEmployee.role !== "admin") {
    return NextResponse.json(
      {
        error:
          "Only administrators can delete employees.",
      },
      { status: 403 }
    );
  }

  // 5. نأخذ id الموظف المطلوب حذفه من الرابط.
  const { id } = await params;

  // 6. نحذف الموظف؛ والدالة تعيد undefined إذا لم يكن موجودًا.
  const deletedEmployee = await deleteEmployee(id);

  if (!deletedEmployee) {
    return NextResponse.json(
      { error: "Employee not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(deletedEmployee);
}
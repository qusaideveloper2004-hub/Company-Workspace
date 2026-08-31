import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export async function getCurrentEmployee() {
  // 1) نسأل Clerk: من المستخدم الذي سجّل دخوله؟
  const { userId } = await auth();

  // لا توجد Session، إذن لا يوجد مستخدم حالي.
  if (!userId) {
    return null;
  }

  // 2) نبحث بالطريقة الأساسية: Clerk userId.
  const employeeByClerkId = await prisma.employee.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  // إذا كان مرتبطًا من قبل، نعيد الموظف مباشرة.
  if (employeeByClerkId) {
    return employeeByClerkId;
  }

  // 3) هذه أول مرة يدخل فيها المستخدم:
  // نطلب بياناته من Clerk لكي نعرف إيميله.
  const user = await currentUser();

  const email = user?.emailAddresses.find(
    (emailAddress) =>
      emailAddress.id === user.primaryEmailAddressId
  )?.emailAddress;

  // لا نملك إيميلًا، فلا نستطيع عمل الربط.
  if (!email) {
    return null;
  }

  // 4) نبحث عن Employee موجود بنفس الإيميل في Neon.
  const employeeByEmail = await prisma.employee.findUnique({
    where: {
      email,
    },
  });

  // لا يوجد موظف بهذا الإيميل في شركتنا.
  if (!employeeByEmail) {
    return null;
  }

  // حماية: لا نسمح باستبدال حساب Clerk مرتبط بالفعل بموظف.
  if (
    employeeByEmail.clerkUserId &&
    employeeByEmail.clerkUserId !== userId
  ) {
    return null;
  }

  // 5) أول ربط ناجح:
  // نحفظ Clerk userId داخل سجل الموظف في Neon.
  return prisma.employee.update({
    where: {
      id: employeeByEmail.id,
    },
    data: {
      clerkUserId: userId,
    },
  });
}
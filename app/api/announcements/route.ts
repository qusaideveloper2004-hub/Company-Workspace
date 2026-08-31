// // import { NextRequest, NextResponse } from "next/server";
// // import { auth } from "@clerk/nextjs/server";

// // import { createAnnouncement } from "@/lib/modules/announcements/data";
// // import { CreateAnnouncementInput } from "@/lib/types/announcement";

// // export async function POST(request: NextRequest) {
// //   const { userId } = await auth();

// //   if (!userId) {
// //     return NextResponse.json(
// //       { error: "Unauthorized" },
// //       { status: 401 }
// //     );
// //   }

// //   const body: CreateAnnouncementInput = await request.json();

// //   if (!body.title || !body.content) {
// //     return NextResponse.json(
// //       { error: "title and content are required" },
// //       { status: 400 }
// //     );
// //   }

// //   const announcementInput = {
// //     ...body,
// //     createdBy: userId,
// //   };

// //   const newAnnouncement =
// //     createAnnouncement(announcementInput);

// //   return NextResponse.json(
// //     newAnnouncement,
// //     { status: 201 }
// //   );
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// // import { createAnnouncement } from "@/lib/modules/announcements/data";

// // import { getUserById } from "@/lib/modules/users/data";
// import { getEmployeeById } from "@/lib/modules/employees/data";
// import { CreateAnnouncementInput } from "@/lib/types/announcement";

// export async function POST(request: NextRequest) {
//   const { userId } = await auth();

//   if (!userId) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const employee = await getEmployeeById(userId);

//   if (!employee) {
//     return NextResponse.json(
//       { error: "Employee not found" },
//       { status: 404 }
//     );
//   }

//   if (employee.role !== "admin" && employee.role !== "manager") {
//     return NextResponse.json(
//       { error: "You are not allowed to create announcements" },
//       { status: 403 }
//     );
//   }

//   const body: CreateAnnouncementInput =
//     await request.json();

//   if (!body.title || !body.content) {
//     return NextResponse.json(
//       { error: "title and content are required" },
//       { status: 400 }
//     );
//   }

//   const announcementInput = {
//     ...body,
//     createdBy: employee.id,
//   };

//   const newAnnouncement =
//     createAnnouncement(announcementInput);

//   return NextResponse.json(
//     newAnnouncement,
//     { status: 201 }
//   );
// }


import {
  NextRequest,
  NextResponse,
} from "next/server";

import { auth } from "@clerk/nextjs/server";

import {
  AnnouncementPriority,
} from "@/lib/generated/prisma/client";

import {
  createAnnouncementFromDatabase,
  getAllAnnouncementsFromDatabase,
} from "@/lib/modules/announcements/data";

interface CreateAnnouncementRequest {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  createdByEmployeeId: string;
}

export async function GET() {
  const announcements =
    await getAllAnnouncementsFromDatabase();

  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body: CreateAnnouncementRequest =
    await request.json();

  if (
    !body.title ||
    !body.content ||
    !body.priority ||
    !body.createdByEmployeeId
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const announcement =
    await createAnnouncementFromDatabase(
      body.title,
      body.content,
      body.priority,
      body.createdByEmployeeId
    );

  return NextResponse.json(announcement, {
    status: 201,
  });
}
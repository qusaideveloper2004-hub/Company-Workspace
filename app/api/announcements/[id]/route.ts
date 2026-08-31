// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";

// // import {
// //   getUserById,
// // } from "@/lib/modules/users/data";

// import {
//   getEmployeeById,
// } from "@/lib/modules/employees/data";

// import {
//   getAnnouncementById,
//   updateAnnouncement,
// } from "@/lib/modules/announcements/data";

// import {
//   UpdateAnnouncementInput,
// } from "@/lib/types/announcement";

// import { 
//     deleteAnnouncement 
// } from "@/lib/modules/announcements/data";

// interface AnnouncementRouteProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: AnnouncementRouteProps
// ) {
//   const { id } = await params;

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

//   if (
//     employee.role !== "admin" &&
//     employee.role !== "manager"
//   ) {
//     return NextResponse.json(
//       {
//         error:
//           "You are not allowed to update announcements",
//       },
//       { status: 403 }
//     );
//   }

//   const announcement = getAnnouncementById(id);

//   if (!announcement) {
//     return NextResponse.json(
//       { error: "Announcement not found" },
//       { status: 404 }
//     );
//   }

//   const body: UpdateAnnouncementInput =
//     await request.json();

//   if (!body.priority) {
//     return NextResponse.json(
//       { error: "priority is required" },
//       { status: 400 }
//     );
//   }

//   const updatedAnnouncement = updateAnnouncement(
//     id,
//     body
//   );

//   return NextResponse.json(updatedAnnouncement);
// }


// export async function DELETE(
//   request: NextRequest,
//   { params }: AnnouncementRouteProps
// ) {
//   const { id } = await params;

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

//   if (
//     employee.role !== "admin" &&
//     employee.role !== "manager"
//   ) {
//     return NextResponse.json(
//       {
//         error:
//           "You are not allowed to delete announcements",
//       },
//       { status: 403 }
//     );
//   }

//   const announcement = getAnnouncementById(id);

//   if (!announcement) {
//     return NextResponse.json(
//       { error: "Announcement not found" },
//       { status: 404 }
//     );
//   }

//   const deleted = deleteAnnouncement(id);

//   if (!deleted) {
//     return NextResponse.json(
//       { error: "Failed to delete announcement" },
//       { status: 500 }
//     );
//   }

//   return NextResponse.json({
//     message: "Announcement deleted successfully",
//   });
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
  updateAnnouncementPriorityFromDatabase,
  deleteAnnouncementFromDatabase
} from "@/lib/modules/announcements/data";

interface AnnouncementRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: AnnouncementRouteProps
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const body: {
    priority?: AnnouncementPriority;
  } = await request.json();

  if (!body.priority) {
    return NextResponse.json(
      { error: "Priority is required." },
      { status: 400 }
    );
  }

  const updatedAnnouncement =
    await updateAnnouncementPriorityFromDatabase(
      id,
      body.priority
    );

  if (!updatedAnnouncement) {
    return NextResponse.json(
      { error: "Announcement not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedAnnouncement);
}


export async function DELETE(
  _request: NextRequest,
  { params }: AnnouncementRouteProps
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  const deletedAnnouncement =
    await deleteAnnouncementFromDatabase(id);

  if (!deletedAnnouncement) {
    return NextResponse.json(
      { error: "Announcement not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(deletedAnnouncement);
}
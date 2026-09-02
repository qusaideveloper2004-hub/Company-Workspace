
// import {
//   NextRequest,
//   NextResponse,
// } from "next/server";

// import { auth } from "@clerk/nextjs/server";


// import {
//   AnnouncementPriority,
// } from "@/lib/generated/prisma/client";

// import {
//   updateAnnouncementPriorityFromDatabase,
//   deleteAnnouncementFromDatabase
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
//   const { userId } = await auth();

//   if (!userId) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { id } = await params;

//   const body: {
//     priority?: AnnouncementPriority;
//   } = await request.json();

//   if (!body.priority) {
//     return NextResponse.json(
//       { error: "Priority is required." },
//       { status: 400 }
//     );
//   }

//   const updatedAnnouncement =
//     await updateAnnouncementPriorityFromDatabase(
//       id,
//       body.priority
//     );

//   if (!updatedAnnouncement) {
//     return NextResponse.json(
//       { error: "Announcement not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(updatedAnnouncement);
// }


// export async function DELETE(
//   _request: NextRequest,
//   { params }: AnnouncementRouteProps
// ) {
//   const { userId } = await auth();

//   if (!userId) {
//     return NextResponse.json(
//       { error: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { id } = await params;

//   const deletedAnnouncement =
//     await deleteAnnouncementFromDatabase(id);

//   if (!deletedAnnouncement) {
//     return NextResponse.json(
//       { error: "Announcement not found" },
//       { status: 404 }
//     );
//   }

//   return NextResponse.json(deletedAnnouncement);
// }


import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  AnnouncementPriority,
} from "@/lib/generated/prisma/client";

import {
  updateAnnouncementPriorityFromDatabase,
  deleteAnnouncementFromDatabase,
} from "@/lib/modules/announcements/data";

import { getCurrentEmployee } from "@/lib/current-employee";
import {
  canDeleteAnnouncement,
  canUpdateAnnouncement,
} from "@/lib/permissions/announcements";

interface AnnouncementRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(
  request: NextRequest,
  { params }: AnnouncementRouteProps
) {
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      { error: "Your employee account is inactive." },
      { status: 403 }
    );
  }

  if (!canUpdateAnnouncement(currentEmployee.role)) {
    return NextResponse.json(
      {
        error:
          "You are not allowed to update announcements.",
      },
      { status: 403 }
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
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (currentEmployee.status !== "active") {
    return NextResponse.json(
      { error: "Your employee account is inactive." },
      { status: 403 }
    );
  }

  if (!canDeleteAnnouncement(currentEmployee.role)) {
    return NextResponse.json(
      {
        error:
          "You are not allowed to delete announcements.",
      },
      { status: 403 }
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

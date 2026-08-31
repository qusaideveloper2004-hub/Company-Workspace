// import {
//   Announcement,
//   CreateAnnouncementInput,
//     UpdateAnnouncementInput,
// } from "@/lib/types/announcement";

// import { prisma } from "@/lib/prisma";


// const announcements: Announcement[] = [
//   {
//     id: crypto.randomUUID(),
//     title: "New Security Policy",
//     content:
//       "Please update your company password according to the new security policy.",
//     priority: "high",
//     createdBy: "Admin",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "Company Holiday",
//     content:
//       "The company will be closed on August 20, 2026.",
//     priority: "medium",
//     createdBy: "HR",
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: crypto.randomUUID(),
//     title: "Office Maintenance",
//     content:
//       "The second floor will be under maintenance tomorrow.",
//     priority: "low",
//     createdBy: "Admin",
//     createdAt: new Date().toISOString(),
//   },
// ];

// // فانكشن لإرجاع جميع الإعلانات
// export function getAllAnnouncements(): Announcement[] {
//   return announcements;
// }

// // فانكشن لإرجاع إعلان معين حسب الـ ID
// export function getAnnouncementById(
//   id: string
// ): Announcement | undefined {
//   return announcements.find(
//     (announcement) => announcement.id === id
//   );
// }

// // فانكشن لإنشاء إعلان جديد 
// export function createAnnouncement(
//   input: CreateAnnouncementInput
// ): Announcement {
//   const newAnnouncement: Announcement = {
//     id: crypto.randomUUID(),
//     ...input,
//     createdAt: new Date().toISOString(),
//   };

//   announcements.push(newAnnouncement);

//   return newAnnouncement;
// }

// // فانكشن لتحديث إعلان موجود
// export function updateAnnouncement(
//   id: string,
//   updates: UpdateAnnouncementInput
// ): Announcement | null {
//   const announcement = announcements.find(
//     (announcement) => announcement.id === id
//   );

//   if (!announcement) {
//     return null;
//   }

//   Object.assign(announcement, updates);

//   return announcement;
// }

// // فانكشن لحذف إعلان
// export function deleteAnnouncement(id: string): boolean {
//   const index = announcements.findIndex(
//     (announcement) => announcement.id === id
//   );

//   if (index === -1) {
//     return false;
//   }

//   announcements.splice(index, 1);

//   return true;
// }


// export async function getAllAnnouncementsFromDatabase() {
//   return prisma.announcement.findMany({
//     include: {
//       createdBy: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }


// export async function getAnnouncementByIdFromDatabase(
//   id: string
// ) {
//   return prisma.announcement.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       createdBy: true,
//     },
//   });
// }


import {
  AnnouncementPriority,
} from "@/lib/generated/prisma/client";

import { prisma } from "@/lib/prisma";

export async function getAllAnnouncementsFromDatabase() {
  return prisma.announcement.findMany({
    include: {
      createdBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAnnouncementByIdFromDatabase(
  id: string
) {
  return prisma.announcement.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: true,
    },
  });
}

export async function updateAnnouncementPriorityFromDatabase(
  id: string,
  priority: AnnouncementPriority
) {
  const announcement =
    await getAnnouncementByIdFromDatabase(id);

  if (!announcement) {
    return undefined;
  }

  return prisma.announcement.update({
    where: {
      id,
    },
    data: {
      priority,
    },
    include: {
      createdBy: true,
    },
  });
}

export async function deleteAnnouncementFromDatabase(
  id: string
) {
  const announcement =
    await getAnnouncementByIdFromDatabase(id);

  if (!announcement) {
    return undefined;
  }

  return prisma.announcement.delete({
    where: {
      id,
    },
  });
}


export async function createAnnouncementFromDatabase(
  title: string,
  content: string,
  priority: AnnouncementPriority,
  createdByEmployeeId: string
) {
  return prisma.announcement.create({
    data: {
      title,
      content,
      priority,
      createdByEmployeeId,
    },
    include: {
      createdBy: true,
    },
  });
}
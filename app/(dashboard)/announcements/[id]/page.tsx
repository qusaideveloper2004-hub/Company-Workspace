import Link from "next/link";
// import { getAnnouncementById } from "@/lib/modules/announcements/data";
import {
  getAnnouncementByIdFromDatabase,
} from "@/lib/modules/announcements/data";
import AnnouncementActions from "@/components/announcements/AnnouncementActions";



import {
  // canCreateAnnouncement,
  canDeleteAnnouncement,
  canUpdateAnnouncement,
} from "@/lib/permissions/announcements";

import { requireActiveEmployee } from "@/lib/require-active-employee";

interface AnnouncementDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AnnouncementDetailPage({
  params,
}: AnnouncementDetailPageProps) {
  const { id } = await params;
  const currentEmployee = await requireActiveEmployee();
  const announcement = await getAnnouncementByIdFromDatabase(id);

  const canUpdate = canUpdateAnnouncement(
    currentEmployee.role
  );

  const canDelete = canDeleteAnnouncement(
    currentEmployee.role
  );
  if (!announcement) {
    return (
      <div className="p-6">
        <Link
          href="/announcements"
          className="text-sm text-muted hover:text-foreground"
        >
          ← Back to announcements
        </Link>

        <p className="mt-6 text-sm text-muted">
          This announcement doesnt exist.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link
        href="/announcements"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to announcements
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {announcement.title}
          </h1>

          <p className="mt-1 text-xs text-muted">
            Published by {announcement.createdBy.name} ·{" "}
            {new Date(
              announcement.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium">
          {announcement.priority}
        </span>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-foreground">
          Announcement
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          {announcement.content}
        </p>
      </div>

      {(canUpdate || canDelete) && (
        <AnnouncementActions
          announcement={announcement}
          canUpdate={canUpdate}
          canDelete={canDelete}
        />
      )}

    </div>
  );
}


"use client";

import { useRouter } from "next/navigation";
// import {
//   Announcement,
//   AnnouncementPriority,
// } from "@/lib/types/announcement";

import {
  Announcement,
  AnnouncementPriority,
} from "@/lib/generated/prisma/client";

interface AnnouncementActionsProps {
  announcement: Announcement;
  canUpdate: boolean;
  canDelete: boolean;
}

const priorityOptions: AnnouncementPriority[] = [
  "low",
  "medium",
  "high",
];

export default function AnnouncementActions({
  announcement,
  canUpdate,
  canDelete,
}: AnnouncementActionsProps) {
  const router = useRouter();

  if (!canUpdate && !canDelete) {
    return null;
  }

  async function handlePriorityChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newPriority =
      event.target.value as AnnouncementPriority;

    const response = await fetch(
      `/api/announcements/${announcement.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: newPriority,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to update announcement priority.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    const response = await fetch(
      `/api/announcements/${announcement.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to delete announcement.");
      return;
    }

    router.push("/announcements");
    router.refresh();
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      {canUpdate && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="priority"
            className="text-sm text-muted"
          >
            Priority
          </label>

        <select
          id="priority"
          value={announcement.priority}
          onChange={handlePriorityChange}
          className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
        >
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        </div>
      )}

      {canDelete && (
        <button
          onClick={handleDelete}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete Announcement
        </button>
      )}
    </div>
  );
}

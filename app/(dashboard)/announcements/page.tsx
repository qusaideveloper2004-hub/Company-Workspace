import Link from "next/link";
// import { getAllAnnouncements } from "@/lib/modules/announcements/data";
import { getAllAnnouncementsFromDatabase } from "@/lib/modules/announcements/data";

export default async function AnnouncementsPage() {
  // const announcements = getAllAnnouncements();
  const announcements = await getAllAnnouncementsFromDatabase();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Announcements
          </h1>

          <p className="mt-1 text-sm text-muted">
            {announcements.length} announcement
            {announcements.length !== 1 && "s"}
          </p>
        </div>

        <Link
          href="/announcements/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Announcement
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {announcements.map((announcement) => (
          <Link
            key={announcement.id}
            href={`/announcements/${announcement.id}`}
            className="block rounded-lg border border-border bg-surface p-5 hover:bg-black/[0.02]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-medium text-foreground">
                  {announcement.title}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {announcement.content}
                </p>

                <p className="mt-2 text-xs text-muted">
                  {announcement.createdBy.name} ·{" "}
                  {new Date(
                    announcement.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs font-medium">
                {announcement.priority}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}



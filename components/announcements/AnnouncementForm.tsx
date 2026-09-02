"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  CreateAnnouncementInput,
  AnnouncementPriority,
} from "@/lib/types/announcement";

export default function AnnouncementForm() {
  const router = useRouter();

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const input: CreateAnnouncementInput = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      priority: formData.get(
        "priority"
      ) as AnnouncementPriority,
    };

    const response = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const data = await response.json();

      alert(
        data.error ??
          "Something went wrong. Please try again."
      );

      return;
    }

    const newAnnouncement = await response.json();

    router.push(`/announcements/${newAnnouncement.id}`);
    router.refresh();
  }

  return (
    <div className="p-6">
      <Link
        href="/announcements"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to announcements
      </Link>

      <h1 className="mt-4 text-xl font-semibold">
        New Announcement
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 max-w-2xl space-y-4"
      >
        <div>
          <label
            htmlFor="title"
            className="text-sm font-medium text-foreground"
          >
            Title
          </label>

          <input
            id="title"
            name="title"
            required
            placeholder="e.g. New company policy"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="text-sm font-medium text-foreground"
          >
            Content
          </label>

          <textarea
            id="content"
            name="content"
            required
            rows={5}
            placeholder="Write the announcement..."
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="priority"
            className="text-sm font-medium text-foreground"
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            defaultValue="medium"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Create Announcement
        </button>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import type {
  CreateTicketInput,
  Department,
  TicketPriority,
} from "@/lib/types/ticket";

export default function NewTicketPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const input: Omit<CreateTicketInput, "createdByEmployeeId"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as TicketPriority,
      department: formData.get("department") as Department,
    };

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        setSubmitError(
          data.error ?? "Something went wrong. Please try again."
        );
        return;
      }

      router.push("/tickets");
      router.refresh();
    } catch {
      setSubmitError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <Link href="/tickets" className="text-sm text-muted hover:text-foreground">
        ← Back to tickets
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-foreground">
        New Ticket
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <input id="title" name="title" required placeholder="e.g. VPN not connecting" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent" />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <textarea id="description" name="description" required rows={4} placeholder="Describe the issue in a bit more detail..." className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="text-sm font-medium text-foreground">Priority</label>
            <select id="priority" name="priority" defaultValue="medium" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="text-sm font-medium text-foreground">Department</label>
            <select id="department" name="department" defaultValue="engineering" className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent">
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-red-600">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}

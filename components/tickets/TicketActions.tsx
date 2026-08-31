"use client";

import { useRouter } from "next/navigation";
// import { Ticket, TicketStatus } from "@/lib/types/ticket";
import {
  Ticket,
  TicketStatus,
} from "@/lib/generated/prisma/client";

interface TicketActionsProps {
  ticket: Ticket;
}

const statusOptions: TicketStatus[] = [
  "open",
  "in_progress",
  "resolved",
];

export default function TicketActions({ ticket }: TicketActionsProps) {
  const router = useRouter();

  async function handleStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus = event.target.value as TicketStatus;

    const response = await fetch(`/api/tickets/${ticket.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    });

    if (!response.ok) {
      alert("Failed to update ticket status.");
      return;
    }

    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    const response = await fetch(`/api/tickets/${ticket.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to delete ticket.");
      return;
    }

    router.push("/tickets");
    router.refresh();
  }

  return (
    <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <label htmlFor="status" className="text-sm text-muted">
          Status
        </label>

        <select
          id="status"
          value={ticket.status}
          onChange={handleStatusChange}
          className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleDelete}
        className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
      >
        Delete Ticket
      </button>
    </div>
  );
}

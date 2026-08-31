import Link from "next/link";

import { getAllTickets } from "@/lib/modules/tickets/data";
import type { TicketStatus } from "@/lib/types/ticket";

interface TicketsPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

const statusFilters: {
  label: string;
  value: TicketStatus | undefined;
}[] = [
  { label: "All", value: undefined },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

export default async function TicketsPage({
  searchParams,
}: TicketsPageProps) {
  const params = await searchParams;
  const status = params.status as TicketStatus | undefined;
  const tickets = await getAllTickets({ status });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Tickets
          </h1>

          <p className="mt-1 text-sm text-muted">
            {tickets.length} ticket{tickets.length !== 1 && "s"}
          </p>
        </div>

        <Link
          href="/tickets/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          New Ticket
        </Link>
      </div>

      <div className="mt-5 flex gap-2">
        {statusFilters.map((filter) => {
          const isActive =
            (params.status ?? undefined) === filter.value;
          const href = filter.value
            ? `/tickets?status=${filter.value}`
            : "/tickets";

          return (
            <Link
              key={filter.label}
              href={href}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
        {tickets.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            No tickets match this filter.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-black/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {ticket.title}
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      {ticket.createdBy.name} · {ticket.department}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium">
                      {ticket.priority}
                    </span>

                    <span className="rounded-full px-2.5 py-1 text-xs font-medium">
                      {ticket.status.replace("_", " ")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

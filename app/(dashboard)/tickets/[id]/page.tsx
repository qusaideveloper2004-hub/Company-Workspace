import Link from "next/link";

import TicketActions from "@/components/tickets/TicketActions";
import { getTicketById } from "@/lib/modules/tickets/data";

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return (
      <div className="p-6">
        <Link
          href="/tickets"
          className="text-sm text-accent hover:underline"
        >
          ← Back to tickets
        </Link>

        <p className="mt-6 text-sm text-muted">
          This ticket doesn&apos;t exist, or it may have already been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-6">
      <Link
        href="/tickets"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to tickets
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold text-foreground">
          {ticket.title}
        </h1>

        <div className="flex shrink-0 gap-2">
          <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
            {ticket.priority}
          </span>
          <span className="rounded-full px-2.5 py-1 text-xs font-medium">
            {ticket.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted">
        Opened by {ticket.createdBy.name} · {ticket.department} ·{" "}
        {ticket.createdAt.toLocaleDateString()}
      </p>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-foreground">Description</h2>
        <p className="mt-2 text-sm text-muted">{ticket.description}</p>
      </div>

      <TicketActions ticket={ticket} />
    </div>
  );
}

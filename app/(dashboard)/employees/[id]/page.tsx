import Link from "next/link";

import EmployeeAction from "@/components/employees/EmployeeAction";

import { getEmployeeById } from "@/lib/modules/employees/data";

import { getTasksByEmployeeId } from "@/lib/modules/tasks/data";

import { getTicketsByEmployeeId } from "@/lib/modules/tickets/data";

interface EmployeeDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailsPage({
  params,
}: EmployeeDetailsPageProps) {
  const { id } = await params;

  const employee = await getEmployeeById(id);

  const employeeTasks = await getTasksByEmployeeId(id);
  const employeeTickets = await getTicketsByEmployeeId(id);

  if (!employee) {
    return (
      <div className="p-6">
        <Link
          href="/employees"
          className="text-sm text-muted hover:text-foreground"
        >
          ← Back to employees
        </Link>

        <p className="mt-6 text-sm text-muted">This employee doesnt exist.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link
        href="/employees"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to employees
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-foreground">
          {employee.name}
        </h1>

        <p className="mt-1 text-sm text-muted">{employee.email}</p>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Employee Information
        </h2>

        <div className="mt-4 space-y-3 text-sm">
          <p>
            <span className="text-muted">Department:</span>{" "}
            {employee.department}
          </p>

          <p>
            <span className="text-muted">Role:</span> {employee.role}
          </p>

          <p>
            <span className="text-muted">Status:</span> {employee.status}
          </p>
        </div>
      </div>


      <EmployeeAction employee={employee} />



      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Assigned Tasks
        </h2>

        <div className="mt-4 space-y-3">
          {employeeTasks.map((task) => (
            <div key={task.id} className="rounded-md border border-border p-3">
              <h3 className="text-sm font-medium text-foreground">
                {task.title}
              </h3>

              <p className="mt-1 text-xs text-muted">
                {task.status} · {task.priority}
              </p>
            </div>
          ))}

          {employeeTasks.length === 0 && (
            <p className="text-sm text-muted">
              No tasks assigned to this employee.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">
          Created Tickets
        </h2>

        <div className="mt-4 space-y-3">
          {employeeTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-md border border-border p-3"
            >
              <h3 className="text-sm font-medium text-foreground">
                {ticket.title}
              </h3>

              <p className="mt-1 text-xs text-muted">
                {ticket.status} · {ticket.priority}
              </p>
            </div>
          ))}

          {employeeTickets.length === 0 && (
            <p className="text-sm text-muted">
              No tickets created by this employee.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// import { getAllTickets } from "@/lib/modules/tickets/data";
// import { getAllTasks } from "@/lib/modules/tasks/data";
// // import { getAllUsers } from "@/lib/modules/users/data";
// import { getAllEmployees } from "@/lib/modules/employees/data";

// export default async function ReportsPage() {
//   const tickets = await getAllTickets();
//   const tasks = await getAllTasks();
//   // const users = getAllUsers();
//   const employee = await getAllEmployees();

//   // Tickets metrics
//   const totalTickets = tickets.length;

//   const openTickets = tickets.filter(
//     (ticket) => ticket.status === "open"
//   ).length;

//   const inProgressTickets = tickets.filter(
//     (ticket) => ticket.status === "in_progress"
//   ).length;

//   const resolvedTickets = tickets.filter(
//     (ticket) => ticket.status === "resolved"
//   ).length;

//   // Tasks metrics
//   const totalTasks = tasks.length;

//   const todoTasks = tasks.filter(
//     (task) => task.status === "todo"
//   ).length;

//   const inProgressTasks = tasks.filter(
//     (task) => task.status === "in_progress"
//   ).length;

//   const completedTasks = tasks.filter(
//     (task) => task.status === "completed"
//   ).length;

//   // Employees metrics
//   // const totalUsers = users.length;
//   const totalEmployees = employee.length;

//   // const employees = users.filter(
//   //   (user) => user.role === "employee"
//   // ).length;

//   const employees = employee.filter(
//     (user) => user.role === "employee"
//   ).length;

// // const managers = user.filter(
// //     (user) => user.role === "manager"
// //   ).length;

//   const managers = employee.filter(
//     (user) => user.role === "manager"
//   ).length;

//   // const admins = users.filter(
//   //   (user) => user.role === "admin"
//   // ).length;

//   const admins = employee.filter(
//     (user) => user.role === "admin"
//   ).length;

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-foreground">
//           Reports
//         </h1>

//         <p className="mt-1 text-sm text-muted">
//           Overview of company activity
//         </p>
//       </div>

//       {/* Tickets */}
//       <section className="mt-8">
//         <h2 className="text-sm font-semibold text-foreground">
//           Tickets Overview
//         </h2>

//         <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <ReportCard
//             label="Total Tickets"
//             value={totalTickets}
//           />

//           <ReportCard
//             label="Open"
//             value={openTickets}
//           />

//           <ReportCard
//             label="In Progress"
//             value={inProgressTickets}
//           />

//           <ReportCard
//             label="Resolved"
//             value={resolvedTickets}
//           />
//         </div>
//       </section>

//       {/* Tasks */}
//       <section className="mt-8">
//         <h2 className="text-sm font-semibold text-foreground">
//           Tasks Overview
//         </h2>

//         <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <ReportCard
//             label="Total Tasks"
//             value={totalTasks}
//           />

//           <ReportCard
//             label="Todo"
//             value={todoTasks}
//           />

//           <ReportCard
//             label="In Progress"
//             value={inProgressTasks}
//           />

//           <ReportCard
//             label="Completed"
//             value={completedTasks}
//           />
//         </div>
//       </section>

//       {/* Employees */}
//       <section className="mt-8">
//         <h2 className="text-sm font-semibold text-foreground">
//           Employees Overview
//         </h2>

//         <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <ReportCard
//             label="Total Employees"
//             value={totalEmployees}
//           />

//           <ReportCard
//             label="Employees"
//             value={employees}
//           />

//           <ReportCard
//             label="Managers"
//             value={managers}
//           />

//           <ReportCard
//             label="Admins"
//             value={admins}
//           />
//         </div>
//       </section>
//     </div>
//   );
// }

// interface ReportCardProps {
//   label: string;
//   value: number;
// }

// function ReportCard({
//   label,
//   value,
// }: ReportCardProps) {
//   return (
//     <div className="rounded-lg border border-border bg-surface p-5">
//       <p className="text-sm text-muted">
//         {label}
//       </p>

//       <p className="mt-2 text-2xl font-semibold text-foreground">
//         {value}
//       </p>
//     </div>
//   );
// }



import { requireActiveEmployee } from "@/lib/require-active-employee";
import {
  getVisibleEmployees,
} from "@/lib/modules/employees/data";
import {
  getVisibleTasks,
} from "@/lib/modules/tasks/data";
import {
  getVisibleTickets,
} from "@/lib/modules/tickets/data";

export default async function ReportsPage() {
  // 1. نعرف المستخدم الحالي ونتأكد أنه active.
  const currentEmployee = await requireActiveEmployee();

  // 2. نطلب من كل Feature البيانات المسموح بها لهذا المستخدم فقط.
  // تعمل الطلبات معًا لأن كل واحدة مستقلة عن الأخرى.
  const [tickets, tasks, employees] = await Promise.all([
    getVisibleTickets(currentEmployee),
    getVisibleTasks(currentEmployee),
    getVisibleEmployees(currentEmployee),
  ]);

  // 3. Tickets metrics.
  // هذه الحسابات الآن تعتمد على Tickets المرئية فقط.
  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in_progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  // 4. Tasks metrics.
  // هذه الحسابات تعتمد على Tasks المرئية فقط.
  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // 5. Employees metrics.
  // الـAdmin: الشركة كلها.
  // الـManager: قسمه فقط.
  // الـEmployee: سجله فقط.
  const totalEmployees = employees.length;

  const employeeCount = employees.filter(
    (employee) => employee.role === "employee"
  ).length;

  const managerCount = employees.filter(
    (employee) => employee.role === "manager"
  ).length;

  const adminCount = employees.filter(
    (employee) => employee.role === "admin"
  ).length;

  return (
    <div className="p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Reports
        </h1>

        <p className="mt-1 text-sm text-muted">
          {currentEmployee.role === "admin"
            ? "Overview of company activity"
            : currentEmployee.role === "manager"
              ? "Overview of your department activity"
              : "Overview of your work activity"}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">
          Tickets Overview
        </h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReportCard
            label="Total Tickets"
            value={totalTickets}
          />

          <ReportCard
            label="Open"
            value={openTickets}
          />

          <ReportCard
            label="In Progress"
            value={inProgressTickets}
          />

          <ReportCard
            label="Resolved"
            value={resolvedTickets}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">
          Tasks Overview
        </h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReportCard
            label="Total Tasks"
            value={totalTasks}
          />

          <ReportCard
            label="Todo"
            value={todoTasks}
          />

          <ReportCard
            label="In Progress"
            value={inProgressTasks}
          />

          <ReportCard
            label="Completed"
            value={completedTasks}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold text-foreground">
          Employees Overview
        </h2>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ReportCard
            label="Total Employees"
            value={totalEmployees}
          />

          <ReportCard
            label="Employees"
            value={employeeCount}
          />

          <ReportCard
            label="Managers"
            value={managerCount}
          />

          <ReportCard
            label="Admins"
            value={adminCount}
          />
        </div>
      </section>
    </div>
  );
}

interface ReportCardProps {
  label: string;
  value: number;
}

function ReportCard({
  label,
  value,
}: ReportCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-muted">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}
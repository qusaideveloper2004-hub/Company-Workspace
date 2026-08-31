// import { getAllUsers } from "@/lib/modules/users/data";
import { getAllEmployees } from "@/lib/modules/employees/data";
import { getAllTickets } from "@/lib/modules/tickets/data";
import { getAllTasks } from "@/lib/modules/tasks/data";
import {
  getAllAnnouncementsFromDatabase,
} from "@/lib/modules/announcements/data";


import TasksChart from "@/components/dashboard/TasksChart";


export default async function DashboardPage() {
  // const users = getAllUsers();
  const employees = await getAllEmployees();
  const tickets = await getAllTickets();
  const tasks = await getAllTasks();
  const announcements =
    await getAllAnnouncementsFromDatabase();

  // Totals
  // const totalUsers = users.length;
  const totalEmployees = employees.length;
  const totalTickets = tickets.length;
  const totalTasks = tasks.length;
  const totalAnnouncements = announcements.length;

  // Derived data
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  );

  const highPriorityAnnouncements =
    announcements.filter(
      (announcement) =>
        announcement.priority === "high"
    );

  // Dashboard statistics
  const stats = {
    // totalUsers,
    totalEmployees,
    totalTickets,
    totalTasks,
    totalAnnouncements,

    openTickets: openTickets.length,

    completedTasks: completedTasks.length,

    highPriorityAnnouncements:
      highPriorityAnnouncements.length,
  };

  // Cards configuration
  const statCards = [
    // {
    //   title: "Users",
    //   value: stats.totalUsers,
    //   description: "Total users in workspace",
    // },
    {
      title: "Employees",
      value: stats.totalEmployees,
      description: "Total employees in workspace",
    },
    {
      title: "Tickets",
      value: stats.totalTickets,
      description: `${stats.openTickets} open tickets`,
    },
    {
      title: "Tasks",
      value: stats.totalTasks,
      description: `${stats.completedTasks} completed`,
    },
    {
      title: "Announcements",
      value: stats.totalAnnouncements,
      description: `${stats.highPriorityAnnouncements} high priority`,
    },
  ];



  // Tasks chart data
  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  );

  const completedTaskItems = tasks.filter(
    (task) => task.status === "completed"
  );


  // Cards configuration
  const taskChartData = [
    {
      status: "Todo",
      count: todoTasks.length,
    },
    {
      status: "In Progress",
      count: inProgressTasks.length,
    },
    {
      status: "Completed",
      count: completedTaskItems.length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted">
          Overview of your company workspace
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <p className="text-sm text-muted">
              {card.title}
            </p>

            <p className="mt-2 text-2xl font-semibold text-foreground">
              {card.value}
            </p>

            <p className="mt-1 text-xs text-muted">
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Task Chart */}

      <div className="rounded-lg border border-border bg-surface p-5">

        <h2 className="text-sm font-semibold text-foreground">
          Task Status Overview
        </h2>

        <div className="mt-5">
          <TasksChart data={taskChartData} />
        </div>

      </div>

      
      
    </div>
  );
}

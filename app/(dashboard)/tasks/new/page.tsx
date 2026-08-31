// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import {
//   CreateTaskInput,
//   TaskPriority,
//   TaskDepartment,
// } from "@/lib/types/task";

// export default function NewTaskPage() {
//   const router = useRouter();

//   async function handleSubmit(
//     event: React.FormEvent<HTMLFormElement>
//   ) {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);

//     const input: CreateTaskInput = {
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       priority: formData.get("priority") as TaskPriority,
//       assignedTo: formData.get("assignedTo") as string,
//       department: formData.get("department") as TaskDepartment,
//       dueDate: formData.get("dueDate") as string,
//     };

//     const response = await fetch("/api/tasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(input),
//     });

//     if (!response.ok) {
//       const contentType = response.headers.get("content-type") ?? "";

//       if (contentType.includes("application/json")) {
//         const data = await response.json();
//         alert(data.error ?? "Something went wrong. Please try again.");
//         return;
//       }

//       const text = await response.text();
//       alert(text || "Something went wrong. Please try again.");
//       return;
//     }

//     router.push("/tasks");
//     router.refresh();
//   }

//   return (
//     <div>
//       <Link
//         href="/tasks"
//         className="text-sm text-muted hover:text-foreground"
//       >
//         ← Back to tasks
//       </Link>

//       <h1 className="mt-4 text-xl font-semibold text-foreground">
//         New Task
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="mt-6 space-y-4"
//       >
//         <div>
//           <label
//             htmlFor="title"
//             className="text-sm font-medium text-foreground"
//           >
//             Title
//           </label>

//           <input
//             id="title"
//             name="title"
//             required
//             placeholder="e.g. Install Microsoft Office"
//             className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="description"
//             className="text-sm font-medium text-foreground"
//           >
//             Description
//           </label>

//           <textarea
//             id="description"
//             name="description"
//             required
//             rows={4}
//             placeholder="Describe the task..."
//             className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label
//               htmlFor="priority"
//               className="text-sm font-medium text-foreground"
//             >
//               Priority
//             </label>

//             <select
//               id="priority"
//               name="priority"
//               defaultValue="medium"
//               className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="department"
//               className="text-sm font-medium text-foreground"
//             >
//               Department
//             </label>

//             <select
//               id="department"
//               name="department"
//               defaultValue="engineering"
//               className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//             >
//               <option value="engineering">
//                 Engineering
//               </option>
//               <option value="sales">Sales</option>
//               <option value="marketing">
//                 Marketing
//               </option>
//               <option value="hr">HR</option>
//               <option value="finance">
//                 Finance
//               </option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="assignedTo"
//             className="text-sm font-medium text-foreground"
//           >
//             Assigned To
//           </label>

//           <input
//             id="assignedTo"
//             name="assignedTo"
//             required
//             placeholder="e.g. Ahmed Ali"
//             className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="dueDate"
//             className="text-sm font-medium text-foreground"
//           >
//             Due Date
//           </label>

//           <input
//             id="dueDate"
//             name="dueDate"
//             type="date"
//             required
//             className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          
//         >
//           Create Task
//         </button>
//       </form>
//     </div>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  CreateTaskInput,
  TaskDepartment,
  TaskPriority,
} from "@/lib/types/task";

interface EmployeeOption {
  id: string;
  name: string;
  email: string;
}

export default function NewTaskPage() {
  const router = useRouter();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employeesError, setEmployeesError] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      const response = await fetch("/api/employees");

      if (!response.ok) {
        setEmployeesError("Unable to load employees.");
        return;
      }

      const data: EmployeeOption[] = await response.json();
      setEmployees(data);
    }

    loadEmployees();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const input: CreateTaskInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as TaskPriority,
      department: formData.get(
        "department"
      ) as TaskDepartment,
      assignedEmployeeId: formData.get(
        "assignedEmployeeId"
      ) as string,
      dueDate: formData.get("dueDate") as string,
    };

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const contentType =
        response.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        alert(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      const text = await response.text();
      alert(text || "Something went wrong. Please try again.");
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  return (
    <div className="p-6">
      <Link
        href="/tasks"
        className="text-sm text-muted hover:text-foreground"
      >
        ← Back to tasks
      </Link>

      <h1 className="mt-4 text-xl font-semibold text-foreground">
        New Task
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
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
            placeholder="e.g. Install Microsoft Office"
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Describe the task..."
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label
              htmlFor="department"
              className="text-sm font-medium text-foreground"
            >
              Department
            </label>

            <select
              id="department"
              name="department"
              defaultValue="engineering"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="engineering">Engineering</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="assignedEmployeeId"
            className="text-sm font-medium text-foreground"
          >
            Assigned To
          </label>

          <select
            id="assignedEmployeeId"
            name="assignedEmployeeId"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="" disabled>
              Select an employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.name} ({employee.email})
              </option>
            ))}
          </select>

          {employeesError && (
            <p className="mt-1 text-sm text-red-600">
              {employeesError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-foreground"
          >
            Due Date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            required
            className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Create Task
        </button>
      </form>
    </div>
  );
}
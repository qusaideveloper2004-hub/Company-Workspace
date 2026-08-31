"use client";

import { useState } from "react";
import Link from "next/link";

// import { Employee } from "@/lib/types/employee";
import { Employee } from "@/lib/generated/prisma/client";


interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({
  employees,
}: EmployeeTableProps) {

  const [search, setSearch] = useState("");


  const [department, setDepartment] = useState<Employee["department"] | "all">("all");
  const [role, setRole] = useState<Employee["role"] | "all">("all");
  const [status, setStatus] = useState<Employee["status"] | "all">("all");

//   const filteredEmployees = employees.filter(
//     (employee) =>
//       employee.name
//         .toLowerCase()
//         .includes(search.toLowerCase()) ||
//       employee.email
//         .toLowerCase()
//         .includes(search.toLowerCase()) ||
//       (department === "all" || employee.department === department) ||
//       (role === "all" || employee.role === role) ||
//       (status === "all" || employee.status === status)
//   );


const filteredEmployees = employees.filter(
  (employee) =>
    (
      employee.name.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase())
    ) &&
    (department === "all" || employee.department === department) &&
    (role === "all" || employee.role === role) &&
    (status === "all" || employee.status === status)
);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>


      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          value={department}
          onChange={(event) =>
            setDepartment(event.target.value as Employee["department"] | "all")
          }
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="sales">Sales</option>
          <option value="marketing">Marketing</option>
          <option value="hr">HR</option>
          <option value="finance">Finance</option>
        </select>

        <select
          value={role}
          onChange={(event) =>
            setRole(event.target.value as Employee["role"] | "all")
          }
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Roles</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
          <option value="employee">Employee</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as Employee["status"] | "all")
          }
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3">
                Name
              </th>

              <th className="px-4 py-3">
                Email
              </th>

              <th className="px-4 py-3">
                Department
              </th>

              <th className="px-4 py-3">
                Role
              </th>

              <th className="px-4 py-3">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map(
              (employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {employee.name}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted">
                    {employee.email}
                  </td>

                  <td className="px-4 py-3 text-sm text-muted">
                    {employee.department}
                  </td>

                  <td className="px-4 py-3 text-sm text-muted">
                    {employee.role}
                  </td>

                  <td className="px-4 py-3 text-sm">
                    {employee.status}
                  </td>
                </tr>
              )
            )}

            {filteredEmployees.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-muted"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
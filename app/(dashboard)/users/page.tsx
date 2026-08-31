// // import Link from "next/link";
// // import { getAllUsers } from "@/lib/modules/users/data";



// // export default function UsersPage() {
// //   const users = getAllUsers();

// //   return (
// //     <div className="p-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h1 className="text-xl font-semibold">
// //             Users
// //           </h1>

// //           <p className="mt-1 text-sm text-muted">
// //             {users.length} user
// //             {users.length !== 1 && "s"}
// //           </p>
// //         </div>
// //       </div>


// //       <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
// //         {users.length === 0 ? (
// //           <p className="p-8 text-center text-sm text-muted">
// //             No users found.
// //           </p>
// //         ) : (
// //           <ul className="divide-y divide-border">
// //             {users.map((user) => (
// //               <li key={user.id}>
// //                 <Link
// //                   href={`/users/${user.id}`}
// //                   className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-black/[0.02]"
// //                 >
// //                   <div className="min-w-0">
// //                     <p className="truncate text-sm font-medium text-foreground">
// //                       {user.name}
// //                     </p>

// //                     <p className="mt-0.5 text-xs text-muted">
// //                       {user.email}
// //                     </p>
// //                   </div>

// //                   <div className="flex shrink-0 items-center gap-2">
// //                     <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
// //                       {user.role}
// //                     </span>

// //                     <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
// //                       {user.department}
// //                     </span>
// //                   </div>
// //                 </Link>
// //               </li>
// //             ))}
// //           </ul>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import Link from "next/link";

// import { getAllUsers } from "@/lib/modules/users/data";

// import {
//   UserRole,
//   UserDepartment,
// } from "@/lib/types/user";

// interface UsersPageProps {
//   searchParams: Promise<{
//     role?: string;
//     department?: string;
//   }>;
// }

// const roleFilters: {
//   label: string;
//   value: UserRole | undefined;
// }[] = [
//   { label: "All", value: undefined },
//   { label: "Admin", value: "admin" },
//   { label: "Manager", value: "manager" },
//   { label: "Employee", value: "employee" },
// ];

// const departmentFilters: {
//   label: string;
//   value: UserDepartment | undefined;
// }[] = [
//   { label: "All", value: undefined },
//   { label: "Engineering", value: "engineering" },
//   { label: "Sales", value: "sales" },
//   { label: "Marketing", value: "marketing" },
//   { label: "HR", value: "hr" },
//   { label: "Finance", value: "finance" },
// ];

// export default async function UsersPage({
//   searchParams,
// }: UsersPageProps) {
//   const params = await searchParams;

//   const users = getAllUsers({
//     role: params.role as UserRole | undefined,
//     department: params.department as UserDepartment | undefined,
//   });

//   return (
//     <div className="p-6">
//       <div>
//         <h1 className="text-xl font-semibold">
//           Users
//         </h1>

//         <p className="mt-1 text-sm text-muted">
//           {users.length} user
//           {users.length !== 1 && "s"}
//         </p>
//       </div>

//       {/* Role Filters */}
//       <div className="mt-5">
//         <p className="mb-2 text-sm font-medium text-foreground">
//           Role
//         </p>

//         <div className="flex gap-2">
//           {roleFilters.map((filter) => {
//             const isActive =
//               (params.role ?? undefined) === filter.value;

//             const href = filter.value
//               ? `/users?role=${filter.value}`
//               : "/users";

//             return (
//               <Link
//                 key={filter.label}
//                 href={href}
//                 className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
//                   isActive
//                     ? "border-accent bg-accent-soft text-accent"
//                     : "border-border bg-surface text-muted hover:text-foreground"
//                 }`}
//               >
//                 {filter.label}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Department Filters */}
//       <div className="mt-5">
//         <p className="mb-2 text-sm font-medium text-foreground">
//           Department
//         </p>

//         <div className="flex flex-wrap gap-2">
//           {departmentFilters.map((filter) => {
//             const isActive =
//               (params.department ?? undefined) ===
//               filter.value;

//             const href = filter.value
//               ? `/users?department=${filter.value}`
//               : "/users";

//             return (
//               <Link
//                 key={filter.label}
//                 href={href}
//                 className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
//                   isActive
//                     ? "border-accent bg-accent-soft text-accent"
//                     : "border-border bg-surface text-muted hover:text-foreground"
//                 }`}
//               >
//                 {filter.label}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Users List */}
//       <div className="mt-5 overflow-hidden rounded-lg border border-border bg-surface">
//         {users.length === 0 ? (
//           <p className="p-8 text-center text-sm text-muted">
//             No users match this filter.
//           </p>
//         ) : (
//           <ul className="divide-y divide-border">
//             {users.map((user) => (
//               <li key={user.id}>
//                 <Link
//                   href={`/users/${user.id}`}
//                   className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-black/[0.02]"
//                 >
//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-medium text-foreground">
//                       {user.name}
//                     </p>

//                     <p className="mt-0.5 text-xs text-muted">
//                       {user.email}
//                     </p>
//                   </div>

//                   <div className="flex shrink-0 items-center gap-2">
//                     <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
//                       {user.role}
//                     </span>

//                     <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
//                       {user.department}
//                     </span>
//                   </div>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

export default function UsersPage() {
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold text-foreground">Users</h1>
			<p className="mt-2 text-sm text-muted">
				User management is not available yet.
			</p>
		</div>
	);
}
// import Link from "next/link";
// import { getUserById } from "@/lib/modules/users/data";

// interface UserDetailPageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function UserDetailPage({
//   params,
// }: UserDetailPageProps) {
//   const { id } = await params;

//   const user = getUserById(id);

//   if (!user) {
//     return (
//       <div className="p-6">
//         <Link
//           href="/users"
//           className="text-sm text-muted hover:text-foreground"
//         >
//           ← Back to users
//         </Link>

//         <div className="mt-6 rounded-lg border border-border bg-surface p-6">
//           <h1 className="text-lg font-semibold text-foreground">
//             User not found
//           </h1>

//           <p className="mt-2 text-sm text-muted">
//             This user doesnt exist, or may have already been removed.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <Link
//         href="/users"
//         className="text-sm text-muted hover:text-foreground"
//       >
//         ← Back to users
//       </Link>

//       <div className="mt-4 rounded-lg border border-border bg-surface p-6">
//         <div className="flex items-start justify-between gap-4">
//           <div>
//             <h1 className="text-xl font-semibold text-foreground">
//               {user.name}
//             </h1>

//             <p className="mt-1 text-sm text-muted">
//               {user.email}
//             </p>
//           </div>

//           <div className="flex gap-2">
//             <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
//               {user.role}
//             </span>

//             <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
//               {user.department}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function UserDetailPage() {
	return (
		<div className="p-6">
			<h1 className="text-xl font-semibold text-foreground">User</h1>
			<p className="mt-2 text-sm text-muted">
				User details are not available yet.
			</p>
		</div>
	);
}
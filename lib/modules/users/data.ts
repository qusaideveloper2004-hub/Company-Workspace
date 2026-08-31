// import { User } from "@/lib/types/user";

// const users: User[] = [
//   {
//     id: crypto.randomUUID(),
//     name: "Ahmed Ali",
//     email: "ahmed.ali@company.com",
//     role: "employee",
//     department: "engineering",
//   },
//   {
//     id: crypto.randomUUID(),
//     name: "Sara Mohamed",
//     email: "sara.mohamed@company.com",
//     role: "manager",
//     department: "hr",
//   },
//   {
//     id: crypto.randomUUID(),
//     name: "Omar Hassan",
//     email: "omar.hassan@company.com",
//     role: "employee",
//     department: "sales",
//   },
// ];

// interface UserFilters {
//   role?: User["role"];
//   department?: User["department"];
// }

// export function getAllUsers(filters?: UserFilters): User[] {
//   return users.filter((user) => {
//     if (filters?.role && user.role !== filters.role) {
//       return false;
//     }
//     if (filters?.department && user.department !== filters.department) {
//       return false;
//     }
//     return true;
//   });
// }

// export function getUserById(
//   id: string
// ): User | undefined {
//   return users.find((user) => user.id === id);
// }
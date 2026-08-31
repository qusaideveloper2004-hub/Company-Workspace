// import { Employee , UpdateEmployeeInput  } from "@/lib/types/employee";


// import { prisma } from "@/lib/prisma"


// const employees: Employee[] = [
//   {
//     id: crypto.randomUUID(),
//     name: "Ahmed Ali",
//     email: "ahmed.ali@company.com",
//     role: "employee",
//     department: "engineering",
//     position: "Frontend Developer",
//     status: "active",
//   },
//   {
//     id: crypto.randomUUID(),
//     name: "Sara Mohamed",
//     email: "sara.mohamed@company.com",
//     role: "manager",
//     department: "hr",
//     position: "HR Manager",
//     status: "active",
//   },
//   {
//     id: crypto.randomUUID(),
//     name: "Omar Hassan",
//     email: "omar.hassan@company.com",
//     role: "employee",
//     department: "sales",
//     position: "Sales Representative",
//     status: "active",
//   },
//   {
//     id: crypto.randomUUID(),
//     name: "Mona Adel",
//     email: "mona.adel@company.com",
//     role: "employee",
//     department: "marketing",
//     position: "Marketing Specialist",
//     status: "inactive",
//   },
// ];

// // export function getAllEmployees(): Employee[] {
// //   return employees;
// // }

// export async function getAllEmployees() {
//   return prisma.employee.findMany({
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }


// export function getEmployeeById(
//   id: string
// ): Employee | undefined {
//   return employees.find((employee) => employee.id === id);
// }


// export function updateEmployee(
//   id: string,
//   input: UpdateEmployeeInput
// ) {
//   const employee = getEmployeeById(id);
//   if (!employee) {
//     return undefined;
//   }

//   Object.assign(employee, input);
//   return employee;
// }




import { prisma } from "@/lib/prisma";
import { UpdateEmployeeInput } from "@/lib/types/employee";

export async function getAllEmployees() {
  return prisma.employee.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getEmployeeById(id: string) {
  return prisma.employee.findUnique({
    where: {
      id,
    },
  });
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput
) {
  const employee = await getEmployeeById(id);

  if (!employee) {
    return undefined;
  }

  return prisma.employee.update({
    where: {
      id,
    },
    data: input,
  });
}


export async function deleteEmployee(id: string) {
  const employee = await getEmployeeById(id);

  if (!employee) {
    return undefined;
  }

  return prisma.employee.delete({
    where: {
      id,
    },
  });
}
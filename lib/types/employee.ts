export type EmployeeRole =
  | "admin"
  | "manager"
  | "employee";

export type EmployeeDepartment =
  | "engineering"
  | "sales"
  | "marketing"
  | "hr"
  | "finance";

export type EmployeeStatus =
  | "active"
  | "inactive";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: EmployeeDepartment;
  position: string;
  status: EmployeeStatus;
}


export interface UpdateEmployeeInput {
    status?: EmployeeStatus;
}



export interface CreateEmployeeInput {
  name: string;
  email: string;
  position: string;
  department: EmployeeDepartment;
  role: EmployeeRole;
}
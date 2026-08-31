-- CreateEnum
CREATE TYPE "EmployeeDepartment" AS ENUM ('engineering', 'sales', 'marketing', 'hr', 'finance');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('admin', 'manager', 'employee');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL DEFAULT 'employee',
    "department" "EmployeeDepartment" NOT NULL,
    "position" TEXT NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

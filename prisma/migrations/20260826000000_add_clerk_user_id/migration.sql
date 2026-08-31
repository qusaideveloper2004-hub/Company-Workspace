-- AlterTable
ALTER TABLE "Employee" ADD COLUMN "clerkUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_clerkUserId_key" ON "Employee"("clerkUserId");

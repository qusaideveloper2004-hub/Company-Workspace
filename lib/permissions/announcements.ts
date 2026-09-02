import type { EmployeeRole } from "@/lib/generated/prisma/client";

export function canCreateAnnouncement(role: EmployeeRole) {
  return role === "admin" || role === "manager";
}

export function canUpdateAnnouncement(role: EmployeeRole) {
  return role === "admin" || role === "manager";
}

export function canDeleteAnnouncement(role: EmployeeRole) {
  return role === "admin";
}

import { prisma } from "@/lib/prisma";
import type {
  CompanySettingsInput,
  UserPreferencesInput,
} from "@/lib/types/settings";

const defaultCompanySettings: CompanySettingsInput = {
  companyName: "Company Workspace",
  companyEmail: "contact@company.com",
  defaultTicketPriority: "medium",
  defaultTaskStatus: "todo",
};

export async function getCompanySettings() {
  return prisma.companySettings.upsert({
    where: { id: "company" },
    update: {},
    create: {
      id: "company",
      ...defaultCompanySettings,
    },
  });
}

export async function updateCompanySettings(
  input: CompanySettingsInput
) {
  return prisma.companySettings.upsert({
    where: { id: "company" },
    update: input,
    create: {
      id: "company",
      ...input,
    },
  });
}

export async function getUserPreferences(employeeId: string) {
  return prisma.userPreference.upsert({
    where: { employeeId },
    update: {},
    create: {
      employeeId,
    },
  });
}

export async function updateUserPreferences(
  employeeId: string,
  input: UserPreferencesInput
) {
  return prisma.userPreference.upsert({
    where: { employeeId },
    update: input,
    create: {
      employeeId,
      ...input,
    },
  });
}

import type {
  TaskStatus,
  Theme,
  TicketPriority,
} from "@/lib/generated/prisma/client";

export interface CompanySettingsInput {
  companyName: string;
  companyEmail: string;
  defaultTicketPriority: TicketPriority;
  defaultTaskStatus: TaskStatus;
}

export interface UserPreferencesInput {
  phoneNumber: string | null;
  theme: Theme;
  emailNotifications: boolean;
}

"use client";

import { useState } from "react";

import type {
  CompanySettings,
  UserPreference,
} from "@/lib/generated/prisma/client";
import type {
  CompanySettingsInput,
  UserPreferencesInput,
} from "@/lib/types/settings";

interface SettingsFormProps {
  companySettings: CompanySettings;
  initialPreferences: UserPreference | null;
  canManageCompany: boolean;
}

function toPreferencesInput(
  preferences: UserPreference | null
): UserPreferencesInput {
  return {
    phoneNumber: preferences?.phoneNumber ?? null,
    theme: preferences?.theme ?? "light",
    emailNotifications: preferences?.emailNotifications ?? true,
  };
}

export default function SettingsForm({
  companySettings,
  initialPreferences,
  canManageCompany,
}: SettingsFormProps) {
  const [company, setCompany] = useState<CompanySettingsInput>({
    companyName: companySettings.companyName,
    companyEmail: companySettings.companyEmail,
    defaultTicketPriority: companySettings.defaultTicketPriority,
    defaultTaskStatus: companySettings.defaultTaskStatus,
  });
  const [preferences, setPreferences] = useState<UserPreferencesInput>(
    toPreferencesInput(initialPreferences)
  );

  async function handleCompanySave() {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "company", data: company }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to update company settings.");
      return;
    }

    alert("Company settings updated.");
  }

  async function handlePreferencesSave() {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "preferences",
        data: preferences,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error ?? "Failed to update preferences.");
      return;
    }

    alert("Preferences updated.");
  }

  return (
    <div className="space-y-6">
      {canManageCompany && (
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Company Settings
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="companyName" className="text-sm text-muted">
                Company Name
              </label>
              <input
                id="companyName"
                value={company.companyName}
                onChange={(event) =>
                  setCompany({
                    ...company,
                    companyName: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="companyEmail" className="text-sm text-muted">
                Company Email
              </label>
              <input
                id="companyEmail"
                type="email"
                value={company.companyEmail}
                onChange={(event) =>
                  setCompany({
                    ...company,
                    companyEmail: event.target.value,
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="ticketPriority" className="text-sm text-muted">
                Default Ticket Priority
              </label>
              <select
                id="ticketPriority"
                value={company.defaultTicketPriority}
                onChange={(event) =>
                  setCompany({
                    ...company,
                    defaultTicketPriority:
                      event.target.value as CompanySettingsInput["defaultTicketPriority"],
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="taskStatus" className="text-sm text-muted">
                Default Task Status
              </label>
              <select
                id="taskStatus"
                value={company.defaultTaskStatus}
                onChange={(event) =>
                  setCompany({
                    ...company,
                    defaultTaskStatus:
                      event.target.value as CompanySettingsInput["defaultTaskStatus"],
                  })
                }
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCompanySave}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Save Company Settings
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-foreground">
          My Preferences
        </h2>

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="phoneNumber" className="text-sm text-muted">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              value={preferences.phoneNumber ?? ""}
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  phoneNumber: event.target.value || null,
                })
              }
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="theme" className="text-sm text-muted">
              Theme
            </label>
            <select
              id="theme"
              value={preferences.theme}
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  theme: event.target.value as UserPreferencesInput["theme"],
                })
              }
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="emailNotifications"
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(event) =>
                setPreferences({
                  ...preferences,
                  emailNotifications: event.target.checked,
                })
              }
            />
            <label htmlFor="emailNotifications" className="text-sm text-muted">
              Email notifications
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePreferencesSave}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Save My Preferences
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import SettingsForm from "@/components/settings/SettingsForm";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import {
  getCompanySettings,
  getUserPreferences,
} from "@/lib/modules/settings/data";

export default async function SettingsPage() {
  const currentEmployee = await requireActiveEmployee();

  const [companySettings, initialPreferences] = await Promise.all([
    getCompanySettings(),
    getUserPreferences(currentEmployee.id),
  ]);

  return (
    <div className="p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted">
          Manage your workspace preferences
        </p>
      </div>

      <div className="mt-6">
        <SettingsForm
          companySettings={companySettings}
          initialPreferences={initialPreferences}
          canManageCompany={currentEmployee.role === "admin"}
        />
      </div>
    </div>
  );
}

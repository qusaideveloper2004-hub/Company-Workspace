import SettingsForm from "@/components/settings/SettingsForm";
import { getAllEmployees } from "@/lib/modules/employees/data";
import {
  getCompanySettings,
  getUserPreferences,
} from "@/lib/modules/settings/data";

export default async function SettingsPage() {
  const [companySettings, employees] = await Promise.all([
    getCompanySettings(),
    getAllEmployees(),
  ]);

  const selectedEmployee = employees[0];
  const initialPreferences = selectedEmployee
    ? await getUserPreferences(selectedEmployee.id)
    : null;

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
          employees={employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            email: employee.email,
          }))}
          initialPreferences={initialPreferences}
        />
      </div>
    </div>
  );
}

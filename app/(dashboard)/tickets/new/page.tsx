import TicketForm from "@/components/tickets/TicketForm";
import { requireActiveEmployee } from "@/lib/require-active-employee";
import { getCompanySettings } from "@/lib/modules/settings/data";

export default async function NewTicketPage() {
  await requireActiveEmployee();

  const companySettings = await getCompanySettings();

  return (
    <TicketForm
      defaultPriority={companySettings.defaultTicketPriority}
    />
  );
}

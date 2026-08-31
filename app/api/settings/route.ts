import { NextRequest, NextResponse } from "next/server";

import {
  getCompanySettings,
  getUserPreferences,
  updateCompanySettings,
  updateUserPreferences,
} from "@/lib/modules/settings/data";
import type {
  CompanySettingsInput,
  UserPreferencesInput,
} from "@/lib/types/settings";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const company = await getCompanySettings();

  if (!employeeId) {
    return NextResponse.json({ company });
  }

  const preferences = await getUserPreferences(employeeId);

  return NextResponse.json({ company, preferences });
}

export async function PUT(request: NextRequest) {
  const body:
    | { type: "company"; data: CompanySettingsInput }
    | { type: "preferences"; employeeId: string; data: UserPreferencesInput } =
    await request.json();

  if (body.type === "company") {
    const settings = await updateCompanySettings(body.data);
    return NextResponse.json(settings);
  }

  if (body.type === "preferences" && body.employeeId) {
    const preferences = await updateUserPreferences(
      body.employeeId,
      body.data
    );
    return NextResponse.json(preferences);
  }

  return NextResponse.json(
    { error: "Invalid settings request." },
    { status: 400 }
  );
}

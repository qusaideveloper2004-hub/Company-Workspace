import { NextRequest, NextResponse } from "next/server";

import { getCurrentEmployee } from "@/lib/current-employee";
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

async function getActiveCurrentEmployee() {
  const currentEmployee = await getCurrentEmployee();

  if (!currentEmployee) {
    return {
      error: NextResponse.json(
        { error: "Your account is not linked to an employee record." },
        { status: 403 }
      ),
    };
  }

  if (currentEmployee.status !== "active") {
    return {
      error: NextResponse.json(
        { error: "Your employee account is inactive." },
        { status: 403 }
      ),
    };
  }

  return { currentEmployee };
}

export async function GET() {
  const result = await getActiveCurrentEmployee();

  if ("error" in result) {
    return result.error;
  }

  const [company, preferences] = await Promise.all([
    getCompanySettings(),
    getUserPreferences(result.currentEmployee.id),
  ]);

  return NextResponse.json({ company, preferences });
}

export async function PUT(request: NextRequest) {
  const result = await getActiveCurrentEmployee();

  if ("error" in result) {
    return result.error;
  }

  const body:
    | { type: "company"; data: CompanySettingsInput }
    | { type: "preferences"; data: UserPreferencesInput } =
    await request.json();

  if (body.type === "company") {
    if (result.currentEmployee.role !== "admin") {
      return NextResponse.json(
        { error: "Only administrators can update company settings." },
        { status: 403 }
      );
    }

    const settings = await updateCompanySettings(body.data);
    return NextResponse.json(settings);
  }

  if (body.type === "preferences") {
    const preferences = await updateUserPreferences(
      result.currentEmployee.id,
      body.data
    );

    return NextResponse.json(preferences);
  }

  return NextResponse.json(
    { error: "Invalid settings request." },
    { status: 400 }
  );
}

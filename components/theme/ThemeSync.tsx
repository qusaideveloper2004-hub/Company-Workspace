"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

import type { Theme } from "@/lib/generated/prisma/client";

interface ThemeSyncProps {
  theme: Theme;
}

export default function ThemeSync({ theme }: ThemeSyncProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return null;
}

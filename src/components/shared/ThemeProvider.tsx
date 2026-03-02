/* ============================================================
   ThemeProvider — Applies theme to <html> data-theme attribute.
   Default: light. Only switches to dark when user explicitly toggles.
   Persisted in localStorage via Zustand.
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  // Sync data-theme attribute whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

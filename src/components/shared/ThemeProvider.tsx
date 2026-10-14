"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

// Light by default; only an explicit toggle changes the theme.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return <>{children}</>;
}

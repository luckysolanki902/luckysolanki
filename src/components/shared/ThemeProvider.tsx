/* ============================================================
   ThemeProvider — Applies theme to <html> data-theme attribute.
   Default: system preference (prefers-color-scheme).
   Persisted in localStorage via Zustand.
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, userOverride } = useThemeStore();

  // On mount: if user has never explicitly picked a theme, resolve from system
  useEffect(() => {
    const store = useThemeStore.getState();
    if (!store.userOverride) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      // Set without marking as user override so it stays dynamic
      useThemeStore.setState({ theme: systemTheme, userOverride: false });
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync data-theme attribute whenever theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Follow system changes when no user override
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!useThemeStore.getState().userOverride) {
        useThemeStore.setState({
          theme: e.matches ? "dark" : "light",
          userOverride: false,
        });
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <>{children}</>;
}

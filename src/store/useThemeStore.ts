/* ============================================================
   THEME STORE — Zustand + localStorage persistence
   Applied via data-theme attribute on <html>. All color
   transitions are pure CSS (300ms). Zero re-renders.
   Default: system preference (prefers-color-scheme).
   ============================================================ */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

interface ThemeStore {
  theme: Theme;
  /** true = user explicitly picked a theme; false = follow system */
  userOverride: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  resetToSystem: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light", // safe SSR default — ThemeProvider corrects on mount
      userOverride: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
          userOverride: true,
        })),
      setTheme: (theme: Theme) => set({ theme, userOverride: true }),
      resetToSystem: () =>
        set({ theme: getSystemTheme(), userOverride: false }),
    }),
    {
      name: "portfolio-theme",
      storage: createJSONStorage(() => localStorage),
      // Only persist the theme when the user has explicitly chosen one
      partialize: (state) =>
        state.userOverride ? { theme: state.theme, userOverride: true } : {},
    }
  )
);

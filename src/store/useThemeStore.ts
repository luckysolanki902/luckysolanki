/* ============================================================
   THEME STORE, Zustand + localStorage persistence
   Applied via data-theme attribute on <html>. All color
   transitions are pure CSS (300ms). Zero re-renders.
   Default: light. Explicit light/dark choices are remembered.
   ============================================================ */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  /** true = user explicitly picked a theme; false = use the light default */
  userOverride: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light", // Same default on the server and client
      userOverride: false,
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
          userOverride: true,
        })),
      setTheme: (theme: Theme) => set({ theme, userOverride: true }),
    }),
    {
      name: "portfolio-theme",
      storage: createJSONStorage(() => localStorage),
      merge: (persisted, current) => {
        const saved = persisted as Partial<ThemeStore> | undefined;
        const explicit = saved?.userOverride === true &&
          (saved.theme === "light" || saved.theme === "dark");
        return {
          ...current,
          theme: explicit ? saved.theme! : "light",
          userOverride: explicit,
        };
      },
      // Only persist the theme when the user has explicitly chosen one
      partialize: (state) =>
        state.userOverride ? { theme: state.theme, userOverride: true } : {},
    }
  )
);

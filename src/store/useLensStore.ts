/* ============================================================
   LENS STORE — the "three lenses" of one world.

   A single physical MODE SWITCH on the chassis reframes the
   entire device for one of three audiences. This is the global
   source of truth for that selection.

   - hire       → fulltime / companies   (depth, systems, testing)
   - commission → freelance / clients     (shipped-solo, outcomes)
   - back       → founders / investors    (traction, revenue)

   Persisted to localStorage so a returning visitor keeps their
   frame. Applied as a data-lens attribute on <html> so pure-CSS
   accents can react with zero re-renders (mirrors useThemeStore).
   ============================================================ */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Lens = "hire" | "commission" | "back";

/** Ordered — the physical switch throws left → center → right. */
export const LENS_ORDER: Lens[] = ["hire", "commission", "back"];

export interface LensMeta {
  id: Lens;
  /** Engraved label on the chassis switch. */
  label: string;
  /** One-word audience descriptor. */
  audience: string;
  /** The amber readout line shown when this lens is live. */
  readout: string;
  /** Primary CTA verb for this lens. */
  cta: string;
  /** Where the CTA points. */
  ctaHref: string;
}

export const LENSES: Record<Lens, LensMeta> = {
  hire: {
    id: "hire",
    label: "HIRE",
    audience: "For engineering teams",
    readout: "OPEN TO FULL-TIME",
    cta: "See the résumé",
    ctaHref: "/resume.pdf",
  },
  commission: {
    id: "commission",
    label: "COMMISSION",
    audience: "For founders & clients",
    readout: "TAKING PROJECTS",
    cta: "Start a project",
    ctaHref: "#contact",
  },
  back: {
    id: "back",
    label: "BACK",
    audience: "For investors & partners",
    readout: "BUILDING COMPANIES",
    cta: "See the traction",
    ctaHref: "#contact",
  },
};

interface LensStore {
  lens: Lens;
  /** true once the visitor has physically thrown the switch. */
  userSet: boolean;
  setLens: (lens: Lens) => void;
  /** Advance to the next position (wraps) — used by keyboard + jog. */
  cycleLens: (dir?: 1 | -1) => void;
}

export const useLensStore = create<LensStore>()(
  persist(
    (set) => ({
      lens: "hire", // sensible SSR default; the most common visitor
      userSet: false,
      setLens: (lens) => set({ lens, userSet: true }),
      cycleLens: (dir = 1) =>
        set((state) => {
          const i = LENS_ORDER.indexOf(state.lens);
          const next =
            LENS_ORDER[(i + dir + LENS_ORDER.length) % LENS_ORDER.length];
          return { lens: next, userSet: true };
        }),
    }),
    {
      name: "portfolio-lens",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        state.userSet ? { lens: state.lens, userSet: true } : {},
    }
  )
);

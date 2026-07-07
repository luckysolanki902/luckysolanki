/* ============================================================
   Ribbons — three silk bookmarks hanging from the top of the
   book. Each is a "lens": the story re-narrates for that reader
   and the sky changes pastel mood. The chosen ribbon is pulled
   down; the others rest short. Full keyboard support.
   ============================================================ */

"use client";

import { motion } from "framer-motion";
import {
  useLensStore,
  LENS_ORDER,
  LENSES,
  type Lens,
} from "@/store/useLensStore";
import { springSoft } from "@/lib/motion";
import styles from "./Ribbons.module.css";

// Friendlier storybook labels than the raw enum.
const RIBBON_LABEL: Record<Lens, string> = {
  hire: "To Hire",
  commission: "To Commission",
  back: "To Back",
};

const RIBBON_TINT: Record<Lens, string> = {
  hire: "var(--periwinkle)",
  commission: "var(--lilac)",
  back: "var(--rose)",
};

export function Ribbons() {
  const lens = useLensStore((s) => s.lens);
  const setLens = useLensStore((s) => s.setLens);

  return (
    <div
      className={styles.rack}
      role="radiogroup"
      aria-label="Who's reading? Choose a ribbon to re-tell the story."
    >
      {LENS_ORDER.map((id) => {
        const active = id === lens;
        return (
          <motion.button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            className={`${styles.ribbon} ${active ? styles.active : ""}`}
            style={{ ["--tint" as string]: RIBBON_TINT[id] }}
            onClick={() => setLens(id)}
            animate={{ y: active ? 22 : 0 }}
            whileHover={{ y: active ? 22 : 8 }}
            transition={springSoft}
            title={LENSES[id].audience}
          >
            <span className={styles.label}>{RIBBON_LABEL[id]}</span>
            <span className={styles.tail} aria-hidden />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ============================================================
   Book — the ambient shell around every page.

   Provides the world: drifting clouds in a pastel sky, the
   lens ribbons, the Buddy companion, and a floating "book" of
   paper that holds whatever the current route renders. The home
   route fills it with the page-turning Storybook; other routes
   (Field Notes) render their own paper pages inside the same sky.

   Also the single owner of <html data-lens> after first paint.
   ============================================================ */

"use client";

import { useEffect } from "react";
import { useLensStore } from "@/store/useLensStore";
import { Buddy } from "@/components/Buddy/Buddy";
import { Clouds } from "./Clouds";
import { Ribbons } from "./Ribbons";
import styles from "./Book.module.css";

export function Book({ children }: { children: React.ReactNode }) {
  const lens = useLensStore((s) => s.lens);

  useEffect(() => {
    document.documentElement.setAttribute("data-lens", lens);
  }, [lens]);

  return (
    <>
      <Clouds />

      <div className={styles.stage}>
        <div className={styles.book}>
          <Ribbons />
          <div className={styles.pages}>{children}</div>
        </div>
      </div>

      <Buddy />
    </>
  );
}

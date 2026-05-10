/* ============================================================
   Tools — "What I Build With"
   Plain text grid. No icons. No logos. No progress bars.
   3 columns desktop / 2 tablet / 1 mobile.
   "Also:" line for overflow.
   ============================================================ */

"use client";

import { tools } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionLabel } from "@/components/shared/SectionLabel";
import styles from "./Tools.module.css";

const columns = [
  { heading: "Frontend", items: tools.frontend },
  { heading: "Backend", items: tools.backend },
  { heading: "AI / Agents", items: tools.ai },
  { heading: "Infrastructure", items: tools.infrastructure },
];

export function Tools() {
  return (
    <section id={SECTION_IDS.tools} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="Stack" />

        <FadeIn>
          <h2 className={styles.heading}>Core stack</h2>
        </FadeIn>

        <div className={styles.grid}>
          {columns.map((col, i) => (
            <FadeIn key={col.heading} delay={0.05 + i * 0.08}>
              <div className={styles.column}>
                <h3 className={styles.columnHeading}>{col.heading}</h3>
                {col.items.map((item) => (
                  <p key={item} className={styles.columnItem}>
                    {item}
                  </p>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <p className={styles.also}>Other tools: {tools.also}</p>
        </FadeIn>
      </div>
    </section>
  );
}

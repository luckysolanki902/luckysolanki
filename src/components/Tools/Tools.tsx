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
import { HoverText } from "@/components/shared/HoverText";
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
          <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
            Core stack
          </HoverText>
        </FadeIn>

        <div className={styles.grid}>
          {columns.map((col, i) => (
            <FadeIn key={col.heading} delay={0.05 + i * 0.08}>
              <div className={styles.column}>
                <HoverText as="h3" variant="label" className={styles.columnHeading} font="500 13px Inter">
                  {col.heading}
                </HoverText>
                {col.items.map((item) => (
                  <HoverText key={item} as="p" variant="detail" className={styles.columnItem} font="400 14px Inter">
                    {item}
                  </HoverText>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <HoverText as="p" variant="paragraph" className={styles.also} font="400 13px Inter">
            {`Other tools: ${tools.also}`}
          </HoverText>
        </FadeIn>
      </div>
    </section>
  );
}

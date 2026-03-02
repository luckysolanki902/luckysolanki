/* ============================================================
   SectionLabel — "ABOUT", "WORK", "TOOLS", "CONTACT"
   Animation #7: "The Slide" — slide in from left
   Inter 500, 12px, uppercase, --tracking-wide, --text-tertiary
   ============================================================ */

"use client";

import { FadeIn } from "./FadeIn";
import styles from "./SectionLabel.module.css";

interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <FadeIn direction="left" duration={0.4}>
      <span className={styles.label}>{label}</span>
    </FadeIn>
  );
}

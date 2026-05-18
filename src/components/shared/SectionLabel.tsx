/* ============================================================
   SectionLabel — "ABOUT", "WORK", "TOOLS", "CONTACT"
   Animation #7: "The Slide" — slide in from left
   Inter 500, 12px, uppercase, --tracking-wide, --text-tertiary
   ============================================================ */

"use client";

import { HoverText } from "./HoverText";
import styles from "./SectionLabel.module.css";

interface SectionLabelProps {
  label: string;
}

export function SectionLabel({ label }: SectionLabelProps) {
  return (
    <HoverText as="span" variant="label" className={styles.label} font="500 12px Inter">
      {label}
    </HoverText>
  );
}

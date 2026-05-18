/* ============================================================
   HoverBlock — Hover animation wrapper for mixed JSX content.
   Used when children can't be split into chars/words
   (e.g. paragraphs with <strong>, <a>, or other inline elements).
   Animation: the whole block subtly lifts and brightens — a
   "reading lamp" effect distinct from all text-split variants.
   ============================================================ */

"use client";

import { ReactNode } from "react";
import styles from "./HoverBlock.module.css";

interface HoverBlockProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "p" | "li" | "span";
}

export function HoverBlock({
  children,
  className,
  style,
  as: Tag = "div",
}: HoverBlockProps) {
  return (
    <Tag className={`${styles.block} ${className ?? ""}`} style={style}>
      {children}
    </Tag>
  );
}

/* ============================================================
   HoverText — Pretext.js-powered hover animation
   7 unique variants, each with its own soothing motion.
   Uses @chenglou/pretext for Unicode-correct text segmentation.
   ============================================================ */

"use client";

import { useEffect, useState, useRef } from "react";
import { prepareWithSegments } from "@chenglou/pretext";
import styles from "./HoverText.module.css";

type AsTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "li" | "a";
export type HoverTextVariant =
  | "heading"       // char cascade wave up    (-5px spring)
  | "paragraph"     // word color shimmer      (secondary→primary→inherit)
  | "cta"           // char letter-spacing breathe (expand→contract cascade)
  | "chip"          // word quick pop up       (-3px fast spring)
  | "card-heading"  // char blur-snap          (blur 3px→clear cascade)
  | "label"         // char flicker            (opacity 1→0.2→1 cascade)
  | "detail";       // word drift down         (+2px gentle cascade)

const DEFAULT_FONTS: Record<HoverTextVariant, string> = {
  "heading":      "600 32px Quicksand",
  "paragraph":    "400 14px Inter",
  "cta":          "500 14px Inter",
  "chip":         "500 12px Inter",
  "card-heading": "600 18px Quicksand",
  "label":        "500 12px Inter",
  "detail":       "400 14px Inter",
};

// Which variants animate at the character level (vs word level)
const CHAR_LEVEL = new Set<HoverTextVariant>(["heading", "cta", "card-heading", "label"]);

// Which word-level variants need display:inline-block for transforms
const NEEDS_INLINE_BLOCK = new Set<HoverTextVariant>(["chip", "detail"]);

interface HoverTextProps {
  children: string;
  as?: AsTag;
  variant?: HoverTextVariant;
  className?: string;
  font?: string;
  style?: React.CSSProperties;
}

export function HoverText({
  children,
  as: Tag = "span",
  variant = "paragraph",
  className,
  font,
  style,
}: HoverTextProps) {
  const [segments, setSegments] = useState<string[] | null>(null);
  const [active, setActive] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveFont = font ?? DEFAULT_FONTS[variant];

  useEffect(() => {
    try {
      const prepared = prepareWithSegments(children.trim(), effectiveFont);
      setSegments(prepared.segments);
    } catch {
      // Canvas / Intl not ready — stay in plain-text mode
    }
  }, [children, effectiveFont]);

  const handleEnter = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    setActive(true);
  };

  const handleLeave = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setActive(false), 120);
  };

  // SSR / pre-hydration fallback — no layout shift
  if (!segments) {
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  /* ── CHARACTER-LEVEL variants ─────────────────────────── */
  if (CHAR_LEVEL.has(variant)) {
    let charIdx = 0;

    const activeClass =
      variant === "heading"      ? styles.charWave   :
      variant === "cta"          ? styles.ctaBreath  :
      variant === "card-heading" ? styles.blurSnap   :
      variant === "label"        ? styles.labelFlick : "";

    // Group chars by word so line breaks only occur at spaces, not mid-word
    const wordNodes: React.ReactNode[] = [];
    let currentWordChars: React.ReactNode[] = [];
    let wordKey = 0;

    const flushWord = () => {
      if (currentWordChars.length > 0) {
        wordNodes.push(
          <span key={`w-${wordKey++}`} className={styles.charWord}>
            {currentWordChars}
          </span>
        );
        currentWordChars = [];
      }
    };

    segments.forEach((seg, si) =>
      [...seg].forEach((char, ci) => {
        const isSpace = char === " " || char === "\u00A0" || char === "\t";
        if (isSpace) {
          flushWord();
          wordNodes.push(
            <span key={`${si}-${ci}`} aria-hidden="true" className={styles.gap}>
              {char}
            </span>
          );
        } else {
          const i = charIdx++;
          currentWordChars.push(
            <span
              key={`${si}-${ci}`}
              aria-hidden="true"
              className={`${styles.char}${active && activeClass ? ` ${activeClass}` : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {char}
            </span>
          );
        }
      })
    );
    flushWord();

    const renderedChars = wordNodes;

    return (
      <Tag
        className={className}
        style={style}
        aria-label={children}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {renderedChars}
      </Tag>
    );
  }

  /* ── WORD-LEVEL variants ──────────────────────────────── */
  const wordSegments = segments.filter((s) => s.trim() !== "");
  let wordIdx = 0;

  const activeClass =
    variant === "paragraph" ? styles.wordGlow    :
    variant === "chip"      ? styles.chipPop     :
    variant === "detail"    ? styles.detailDrift : "";

  const baseClass = NEEDS_INLINE_BLOCK.has(variant) ? styles.wordBlock : styles.word;

  const renderedWords = segments.map((seg, si) => {
    const isSpace = seg.trim() === "";
    if (isSpace) {
      return (
        <span key={si} className={styles.gap}>
          {seg}
        </span>
      );
    }
    const i = wordIdx++;
    return (
      <span
        key={si}
        className={`${baseClass}${active && activeClass ? ` ${activeClass}` : ""}`}
        style={{ "--i": i, "--total": wordSegments.length } as React.CSSProperties}
      >
        {seg}
      </span>
    );
  });

  return (
    <Tag
      className={className}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {renderedWords}
    </Tag>
  );
}

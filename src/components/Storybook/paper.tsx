/* ============================================================
   paper.tsx — the physics + shapes of a pop-up spread.

   A <PopUpScene> lays flat when a page isn't turned to, then
   folds UP from the gutter when the spread becomes active —
   each <Piece> springing upright with a little stagger, the way
   a real paper pop-up unfolds. Reduced-motion → pieces just fade.
   ============================================================ */

"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

const container: Variants = {
  flat: {},
  up: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

/** A single paper piece that folds up from its base edge. */
export function Piece({
  children,
  className,
  style,
  lean = 0,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** small resting tilt in degrees for a hand-cut feel */
  lean?: number;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = reduce
    ? { flat: { opacity: 0 }, up: { opacity: 1 } }
    : {
        flat: { rotateX: 82, y: 26, opacity: 0 },
        up: {
          rotateX: lean,
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 220, damping: 18, mass: 0.9 },
        },
      };

  return (
    <motion.div
      variants={variants}
      className={className}
      style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a diorama; drives the fold-up when `active`. */
export function PopUpScene({
  active,
  children,
  className,
  style,
}: {
  active: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      initial="flat"
      animate={active ? "up" : "flat"}
      variants={container}
      style={{ perspective: 900, transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </motion.div>
  );
}

/* -----------------------------------------------------------
   Little paper shapes — soft, rounded, hand-cut.
   All take a fill so scenes can paint them any pastel.
   ----------------------------------------------------------- */

export function Hill({ fill, w = 400, h = 160 }: { fill: string; w?: number; h?: number }) {
  return (
    <svg viewBox="0 0 400 160" width={w} height={h} aria-hidden>
      <path
        d="M0 160 Q100 20 200 70 T400 60 L400 160 Z"
        fill={fill}
      />
    </svg>
  );
}

export function Sun({ fill = "#f8e6a6", size = 90 }: { fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <circle cx="50" cy="50" r="34" fill={fill} />
      <circle cx="50" cy="50" r="44" fill="none" stroke={fill} strokeOpacity="0.4" strokeWidth="3" />
    </svg>
  );
}

export function Star({ fill = "#fff", size = 16 }: { fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"
        fill={fill}
      />
    </svg>
  );
}

export function Tree({ fill = "#b6e5cd", size = 90 }: { fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 80 100" width={size} height={size * 1.25} aria-hidden>
      <rect x="35" y="60" width="10" height="34" rx="4" fill="#d8b48a" />
      <circle cx="40" cy="40" r="30" fill={fill} />
      <circle cx="24" cy="52" r="20" fill={fill} />
      <circle cx="56" cy="52" r="20" fill={fill} />
    </svg>
  );
}

export function Cloudlet({ fill = "#fff", size = 90 }: { fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 120 60" width={size} height={size * 0.5} aria-hidden>
      <ellipse cx="40" cy="40" rx="30" ry="18" fill={fill} />
      <ellipse cx="70" cy="34" rx="26" ry="22" fill={fill} />
      <ellipse cx="90" cy="42" rx="22" ry="15" fill={fill} />
    </svg>
  );
}

/** A soft-cornered paper building block with a pitched roof. */
export function House({
  wall,
  roof,
  w = 120,
  h = 130,
}: {
  wall: string;
  roof: string;
  w?: number;
  h?: number;
}) {
  return (
    <svg viewBox="0 0 120 130" width={w} height={h} aria-hidden>
      <rect x="18" y="55" width="84" height="70" rx="8" fill={wall} />
      <path d="M8 60 L60 18 L112 60 Z" fill={roof} />
      <rect x="50" y="88" width="20" height="37" rx="5" fill="#fff" fillOpacity="0.65" />
      <rect x="28" y="70" width="16" height="16" rx="4" fill="#fff" fillOpacity="0.6" />
      <rect x="76" y="70" width="16" height="16" rx="4" fill="#fff" fillOpacity="0.6" />
    </svg>
  );
}

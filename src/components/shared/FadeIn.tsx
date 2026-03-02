/* ============================================================
   FadeIn — Reusable scroll-reveal wrapper (Framer Motion)
   Animation #1: "The Soft Rise"
   opacity 0→1, translateY 20px→0, 500ms, --ease-reveal
   Fires once. Stagger 80ms between siblings.
   ============================================================ */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "left" | "none";
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
  once = true,
}: FadeInProps) {
  const directionMap = {
    up: { y: 20, x: 0 },
    left: { y: 0, x: -10 },
    none: { y: 0, x: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: offset.y,
        x: offset.x,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
      }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // --ease-reveal
      }}
    >
      {children}
    </motion.div>
  );
}

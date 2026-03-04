/* ============================================================
   FadeIn — Reusable scroll-reveal wrapper (CSS + IntersectionObserver)
   Animation #1: "The Soft Rise"
   opacity 0→1, translateY 20px→0, 500ms, --ease-reveal
   Bot-safe: opacity:0 is applied only via JS class on <html>,
   so crawlers without JS see fully visible content.
   ============================================================ */

"use client";

import { useEffect, useRef, ReactNode } from "react";
import styles from "./FadeIn.module.css";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  /** @deprecated - duration is now controlled by CSS */
  duration?: number;
  direction?: "up" | "left" | "none";
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) el.style.transitionDelay = `${delay}s`;
          el.classList.add(styles.visible);
          if (once) observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={[
        styles.fadeIn,
        direction === "left" ? styles.left : "",
        direction === "none" ? styles.none : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

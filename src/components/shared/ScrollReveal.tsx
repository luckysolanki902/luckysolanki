/* ============================================================
   ScrollReveal — Hidden message at the very end of the page.
   Only appears when the visitor scrolls to absolute bottom.
   Rewards the most curious visitors.
   ============================================================ */

"use client";

import { useState, useEffect } from "react";
import styles from "./ScrollReveal.module.css";

export function ScrollReveal() {
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasShown) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // Trigger when within 20px of the absolute bottom
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setVisible(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  if (!visible) return null;

  return (
    <div className={`${styles.reveal} scrollReveal`} aria-live="polite">
      <p className={styles.text}>
        You scrolled to the very end. Most people don&apos;t.
      </p>
      <p className={styles.subtext}>
        If you&apos;re still here, we should probably talk.
      </p>
      <a href="mailto:luckysolanki902@gmail.com" className={styles.link}>
        Say hello →
      </a>
    </div>
  );
}

/* ============================================================
   ScrollReveal — the hidden message at the very bottom of the
   page. Each letter is split with @chenglou/pretext so it can
   react to the weather collecting beneath it:

   • Dark mode → as the water rises over a letter it floats up to
     the surface and bobs on the waterline.
   • Light mode → as the leaf heap rises over a letter it sinks
     and fades, getting buried under the leaves.

   Driven by a rAF loop reading weatherState (no React re-renders).
   ============================================================ */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { prepareWithSegments } from "@chenglou/pretext";
import { weatherState } from "@/lib/weatherState";
import styles from "./ScrollReveal.module.css";

const LINES = [
  { text: "You scrolled to the very end. Most people don’t.", cls: "text", font: "600 18px Quicksand" },
  { text: "If you’re still here, we should probably talk.", cls: "subtext", font: "400 14px Inter" },
] as const;
const LINK_TEXT = "Say hello →";
const LINK_FONT = "500 14px Inter";

function segment(text: string, font: string): string[] {
  try {
    return prepareWithSegments(text, font).segments;
  } catch {
    return [...text];
  }
}

export function ScrollReveal() {
  const [visible, setVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const baseRef = useRef<{ cx: number; cy: number }[]>([]);
  const curRef = useRef<{ y: number; rot: number; op: number }[]>([]);

  /* ---- reveal when scrolled to the very bottom ---- */
  useEffect(() => {
    const handleScroll = () => {
      if (hasShown) return;
      const sh = document.documentElement.scrollHeight;
      if (window.scrollY + window.innerHeight >= sh - 20) {
        setVisible(true);
        setHasShown(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShown]);

  /* ---- collect letter refs in render order ---- */
  const register = useCallback((el: HTMLSpanElement | null, i: number) => {
    if (el) lettersRef.current[i] = el;
  }, []);

  /* ---- measure base positions + run the animation loop ---- */
  useEffect(() => {
    if (!visible) return;
    let raf = 0;

    const measure = () => {
      const c = containerRef.current;
      if (!c) return;
      const cRect = c.getBoundingClientRect();
      const els = lettersRef.current;
      baseRef.current = [];
      curRef.current = [];
      for (let i = 0; i < els.length; i++) {
        const el = els[i];
        if (!el) continue;
        el.style.transform = "";
        el.style.opacity = "";
        const r = el.getBoundingClientRect();
        baseRef.current[i] = {
          cx: r.left - cRect.left + r.width / 2,
          cy: r.top - cRect.top + r.height / 2,
        };
        curRef.current[i] = { y: 0, rot: 0, op: 1 };
      }
    };

    // measure after layout settles
    const m1 = requestAnimationFrame(() => requestAnimationFrame(measure));
    window.addEventListener("resize", measure);

    const tick = (now: number) => {
      const c = containerRef.current;
      if (c) {
        const cRect = c.getBoundingClientRect();
        const fillY = weatherState.fillY;
        const storm = weatherState.storm;
        const els = lettersRef.current;
        const base = baseRef.current;
        const cur = curRef.current;

        for (let i = 0; i < els.length; i++) {
          const el = els[i];
          const b = base[i];
          const s = cur[i];
          if (!el || !b || !s) continue;

          const vy = cRect.top + b.cy;
          const depth = fillY === Infinity ? -9999 : vy - fillY;

          let ty = 0;
          let rot = 0;
          let op = 1;

          if (depth > -2) {
            if (storm) {
              // float up to the surface and bob along the waterline
              const lift = Math.min(depth + 2, 64);
              const bob = Math.sin(now / 520 + b.cx * 0.06) * 3.2;
              ty = -lift + bob;
              rot = Math.sin(now / 760 + b.cx * 0.05) * 6;
              op = 1;
            } else {
              // sink and fade beneath the leaf heap
              ty = Math.min(depth * 0.45, 12);
              rot = Math.sin(b.cx * 0.7) * 9;
              op = Math.max(0.04, 1 - depth / 26);
            }
          }

          s.y += (ty - s.y) * 0.14;
          s.rot += (rot - s.rot) * 0.14;
          s.op += (op - s.op) * 0.14;
          el.style.transform = `translateY(${s.y.toFixed(2)}px) rotate(${s.rot.toFixed(2)}deg)`;
          el.style.opacity = s.op.toFixed(3);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(m1);
      window.removeEventListener("resize", measure);
    };
  }, [visible]);

  if (!visible) return null;

  // Running letter index across all three lines (plain local — recomputed
  // deterministically every render, so ref slots stay stable).
  let letterIndex = 0;

  const renderLine = (text: string, font: string) =>
    segment(text, font).map((seg, si) => {
      if (seg.trim() === "") {
        return (
          <span key={`s-${si}`} className={styles.gap}>
            {seg}
          </span>
        );
      }
      const i = letterIndex++;
      return (
        <span
          key={`l-${si}`}
          ref={(el) => register(el, i)}
          className={styles.letter}
          aria-hidden="true"
        >
          {seg}
        </span>
      );
    });

  return (
    <div ref={containerRef} className={`${styles.reveal} scrollReveal`} aria-live="polite">
      <p className={styles.text} aria-label={LINES[0].text}>
        {renderLine(LINES[0].text, LINES[0].font)}
      </p>
      <p className={styles.subtext} aria-label={LINES[1].text}>
        {renderLine(LINES[1].text, LINES[1].font)}
      </p>
      <a
        href="mailto:luckysolanki902@gmail.com"
        className={styles.link}
        aria-label={LINK_TEXT}
      >
        {renderLine(LINK_TEXT, LINK_FONT)}
      </a>
    </div>
  );
}

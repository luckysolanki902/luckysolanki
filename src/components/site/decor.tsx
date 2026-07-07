/* ============================================================
   decor.tsx — the playful bits. Bunting flags, drifting clouds,
   and little hand-drawn doodles. All decorative (aria-hidden).
   ============================================================ */

import type { CSSProperties } from "react";
import styles from "./Decor.module.css";

/* ---------- Bunting: a string of pastel pennant flags ---------- */
const FLAG_COLORS = [
  "var(--c-blush)",
  "var(--c-butter)",
  "var(--c-mint)",
  "var(--c-peri)",
  "var(--c-lilac)",
  "var(--c-sky)",
  "var(--c-rose)",
];

export function Bunting({ count = 14 }: { count?: number }) {
  return (
    <div className={styles.bunting} aria-hidden>
      <span className={styles.rope} />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={styles.flag}
          style={{ ["--f" as string]: FLAG_COLORS[i % FLAG_COLORS.length] }}
        />
      ))}
    </div>
  );
}

/* ---------- Clouds: soft, slow, decorative ---------- */
const CLOUDS = [
  { top: "12%", scale: 1, dur: 90, delay: 0, op: 0.85 },
  { top: "26%", scale: 0.6, dur: 120, delay: -40, op: 0.6 },
  { top: "8%", scale: 0.8, dur: 150, delay: -100, op: 0.7 },
  { top: "40%", scale: 1.3, dur: 170, delay: -70, op: 0.5 },
];

export function Clouds() {
  return (
    <div className={styles.clouds} aria-hidden>
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className={styles.cloud}
          style={
            {
              top: c.top,
              opacity: c.op,
              ["--s" as string]: c.scale,
              ["--dur" as string]: `${c.dur}s`,
              ["--delay" as string]: `${c.delay}s`,
            } as CSSProperties
          }
        >
          <svg viewBox="0 0 200 80" width="200" height="80">
            <ellipse cx="60" cy="55" rx="48" ry="25" fill="#fff" />
            <ellipse cx="105" cy="44" rx="42" ry="34" fill="#fff" />
            <ellipse cx="145" cy="56" rx="38" ry="22" fill="#fff" />
          </svg>
        </span>
      ))}
    </div>
  );
}

/* ---------- Little doodles ---------- */

export function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      aria-hidden
      fill="none"
    >
      <path
        d="M2 7 Q 25 1, 50 6 T 100 6 T 150 6 T 198 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Star({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" width="20" height="20" aria-hidden fill="currentColor">
      <path d="M12 2c.4 3.8 1.8 5.2 5.6 5.6-3.8.4-5.2 1.8-5.6 5.6-.4-3.8-1.8-5.2-5.6-5.6C10.2 7.2 11.6 5.8 12 2z" />
    </svg>
  );
}

export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M12 0l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" opacity="0.9" />
    </svg>
  );
}

export function Heart({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor">
      <path d="M12 21s-7.5-4.9-10-9.3C.6 9 1.8 5.6 5 5.1 7 4.8 9 6 12 9c3-3 5-4.2 7-3.9 3.2.5 4.4 3.9 3 6.6C19.5 16.1 12 21 12 21z" />
    </svg>
  );
}

export function Wave({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden fill="none">
      <path
        d="M0 12 Q 30 2, 60 12 T 120 12 T 180 12 T 240 12 T 300 12 T 360 12 T 420 12 T 480 12 T 540 12 T 600 12 T 660 12 T 720 12 T 780 12 T 840 12 T 900 12 T 960 12 T 1020 12 T 1080 12 T 1140 12 T 1200 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowDoodle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 40" width="60" height="40" aria-hidden fill="none">
      <path
        d="M4 8 C 20 4, 44 8, 52 26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M44 22 L53 27 L48 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

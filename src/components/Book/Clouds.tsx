/* ============================================================
   Clouds — soft cotton clouds drifting across the sky behind
   the book. Pure CSS drift, pastel, parallax-slow. Decorative
   only (aria-hidden); disabled under reduced-motion.
   ============================================================ */

import styles from "./Clouds.module.css";

type Cloud = {
  top: string;
  scale: number;
  duration: number; // seconds for a full drift
  delay: number;
  opacity: number;
  tint: string;
};

const CLOUDS: Cloud[] = [
  { top: "8%", scale: 1.1, duration: 90, delay: 0, opacity: 0.9, tint: "#ffffff" },
  { top: "18%", scale: 0.7, duration: 120, delay: -30, opacity: 0.75, tint: "#fdf1f6" },
  { top: "30%", scale: 1.4, duration: 150, delay: -80, opacity: 0.85, tint: "#ffffff" },
  { top: "12%", scale: 0.55, duration: 70, delay: -50, opacity: 0.6, tint: "#eef3ff" },
  { top: "44%", scale: 1.0, duration: 170, delay: -120, opacity: 0.7, tint: "#fdf6ff" },
  { top: "6%", scale: 0.85, duration: 110, delay: -95, opacity: 0.8, tint: "#ffffff" },
];

function Puff({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 220 90" width="220" height="90" aria-hidden fill={tint}>
      <ellipse cx="70" cy="60" rx="55" ry="30" />
      <ellipse cx="120" cy="48" rx="48" ry="38" />
      <ellipse cx="160" cy="62" rx="42" ry="26" />
      <ellipse cx="105" cy="66" rx="70" ry="22" />
    </svg>
  );
}

export function Clouds() {
  return (
    <div className={styles.sky} aria-hidden>
      {CLOUDS.map((c, i) => (
        <span
          key={i}
          className={styles.cloud}
          style={
            {
              top: c.top,
              opacity: c.opacity,
              "--scale": c.scale,
              "--dur": `${c.duration}s`,
              "--delay": `${c.delay}s`,
            } as React.CSSProperties
          }
        >
          <Puff tint={c.tint} />
        </span>
      ))}
    </div>
  );
}

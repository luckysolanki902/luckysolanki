/* ============================================================
   Weather — Atmospheric, theme + scroll reactive weather layer.

   Dark mode  → thunderstorm: slanted rain + lightning. Rain
                water collects in a rising puddle at the bottom
                of the PAGE that keeps filling the longer you
                stay (resets on reload / nav / theme switch).
   Light mode → a warm sky that journeys sunrise → sunset with
                scroll, and realistic autumn leaves tumbling
                down that gather into a growing pile at the
                bottom of the page.

   One full-screen canvas (pointer-events: none) painted above
   content but below Nav/Buddy. Theme changes crossfade smoothly
   and reset the accumulation. Scroll progress is eased so the
   sky/leaf transitions feel continuous.
   Respects prefers-reduced-motion (renders nothing).
   ============================================================ */

"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { weatherState } from "@/lib/weatherState";
import styles from "./Weather.module.css";

/* ---- Particle types --------------------------------------- */
interface Drop {
  x: number;
  y: number;
  len: number;
  vy: number;
  thickness: number;
  alpha: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  swaySpeed: number;
  spin: number;
  angle: number;
  flip: number; // current x-scale (3D flutter)
  flipSpeed: number;
  ci: number; // colour index
}

/* Static leaves that make up the pile at the page bottom */
interface PileLeaf {
  fx: number; // 0..1 across width
  fy: number; // 0..1 depth within current pile height
  size: number;
  angle: number;
  ci: number;
}

interface Ripple {
  x: number;
  age: number; // 0..1
  speed: number;
  width: number;
}

/* ---- Colour helpers --------------------------------------- */
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, k: number): RGB => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];
const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;

/* Autumn leaf palette — [face, shade] pairs for a soft gradient */
const LEAF_COLORS: [RGB, RGB][] = [
  [[201, 67, 43], [140, 36, 26]], // deep red
  [[230, 126, 34], [168, 76, 18]], // orange
  [[211, 84, 0], [138, 50, 4]], // pumpkin
  [[201, 148, 31], [150, 100, 16]], // amber gold
  [[160, 82, 45], [104, 50, 28]], // sienna
  [[205, 133, 63], [140, 84, 38]], // peru
  [[224, 168, 64], [168, 116, 34]], // honey
];

/* Day-cycle sky keyframes (by scroll progress 0 → 0.5 → 1) */
interface Sky {
  top: RGB;
  bottom: RGB;
}
const DAWN: Sky = { top: [255, 196, 176], bottom: [255, 234, 218] };
const NOON: Sky = { top: [176, 208, 238], bottom: [240, 246, 252] };
const DUSK: Sky = { top: [255, 150, 96], bottom: [255, 210, 156] };

function skyAt(p: number): Sky {
  if (p < 0.5) {
    const k = p / 0.5;
    return { top: mix(DAWN.top, NOON.top, k), bottom: mix(DAWN.bottom, NOON.bottom, k) };
  }
  const k = (p - 0.5) / 0.5;
  return { top: mix(NOON.top, DUSK.top, k), bottom: mix(NOON.bottom, DUSK.bottom, k) };
}

const FILL_MS = 70000; // time to fully fill the puddle / leaf pile

export function Weather() {
  const theme = useThemeStore((s) => s.theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetRef = useRef(theme === "dark" ? 1 : 0);
  const resetAccumRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const bottomGapRef = useRef(0); // px of page below the viewport bottom

  useEffect(() => {
    targetRef.current = theme === "dark" ? 1 : 0;
    resetAccumRef.current = true; // theme switch empties the puddle / pile
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas = el;
    const ctx = context;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let drops: Drop[] = [];
    let leaves: Leaf[] = [];
    let pileLeaves: PileLeaf[] = [];
    let pileProfile: number[] = []; // uneven top of the pile across width
    let ripples: Ripple[] = [];

    let t = targetRef.current; // eased theme value (0 day → 1 storm)
    let p = 0; // eased scroll progress
    let gap = 0; // eased px below viewport bottom
    let accum = 0; // 0..1 fill level of puddle / pile
    let maxAccum = 120;

    let flash = 0;
    let nextStrike = 1500 + Math.random() * 4000;
    let strikeQueue = 0;

    /* ---- factories ---- */
    function makeDrop(initial: boolean): Drop {
      return {
        x: Math.random() * (width + 200) - 100,
        y: initial ? Math.random() * height : -20 - Math.random() * height * 0.3,
        len: 12 + Math.random() * 22,
        vy: 9 + Math.random() * 9,
        thickness: 0.6 + Math.random() * 1.1,
        alpha: 0.12 + Math.random() * 0.28,
      };
    }

    function makeLeaf(initial: boolean): Leaf {
      return {
        x: Math.random() * (width + 120) - 60,
        y: initial ? Math.random() * height : -30 - Math.random() * height * 0.3,
        size: 7 + Math.random() * 9,
        vy: 0.8 + Math.random() * 1.4,
        sway: 18 + Math.random() * 40,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.004 + Math.random() * 0.009,
        spin: (Math.random() - 0.5) * 0.03,
        angle: Math.random() * Math.PI * 2,
        flip: 1,
        flipSpeed: 0.015 + Math.random() * 0.03,
        ci: (Math.random() * LEAF_COLORS.length) | 0,
      };
    }

    function buildPile() {
      const count = Math.min(180, Math.round(width / 7));
      pileLeaves = Array.from({ length: count }, () => ({
        fx: Math.random(),
        fy: Math.random(),
        size: 7 + Math.random() * 8,
        angle: Math.random() * Math.PI * 2,
        ci: (Math.random() * LEAF_COLORS.length) | 0,
      }));
      // Smooth, slightly uneven top edge for the pile
      const n = 64;
      const phA = Math.random() * 6.28;
      const phB = Math.random() * 6.28;
      const phC = Math.random() * 6.28;
      pileProfile = Array.from({ length: n }, (_, i) => {
        const x = i / n;
        const v =
          0.72 +
          0.16 * Math.sin(x * Math.PI * 3 + phA) +
          0.08 * Math.sin(x * Math.PI * 7 + phB) +
          0.05 * Math.sin(x * Math.PI * 13 + phC);
        return Math.max(0.45, Math.min(1, v));
      });
    }

    const profileAt = (fx: number) => {
      const n = pileProfile.length;
      if (!n) return 1;
      return pileProfile[Math.min(n - 1, Math.max(0, (fx * n) | 0))];
    };

    /* ---- leaf shape (almond leaf + midrib + stem) ---- */
    function drawLeaf(size: number, face: RGB, shade: RGB, alpha: number) {
      const h = size;
      const w = size * 0.6;
      const grad = ctx.createLinearGradient(0, -h, 0, h);
      grad.addColorStop(0, rgba(face, alpha));
      grad.addColorStop(1, rgba(shade, alpha));
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.quadraticCurveTo(w, -h * 0.1, 0, h);
      ctx.quadraticCurveTo(-w, -h * 0.1, 0, -h);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      // veins
      ctx.strokeStyle = rgba(shade, alpha * 0.7);
      ctx.lineWidth = Math.max(0.5, size * 0.06);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.82);
      ctx.lineTo(0, h);
      ctx.moveTo(0, -h * 0.2);
      ctx.lineTo(w * 0.55, -h * 0.45);
      ctx.moveTo(0, -h * 0.2);
      ctx.lineTo(-w * 0.55, -h * 0.45);
      ctx.moveTo(0, h * 0.25);
      ctx.lineTo(w * 0.5, h * 0.05);
      ctx.moveTo(0, h * 0.25);
      ctx.lineTo(-w * 0.5, h * 0.05);
      ctx.stroke();
      // stem
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h + size * 0.3);
      ctx.stroke();
    }

    function readScroll() {
      const sh = document.documentElement.scrollHeight;
      const denom = sh - window.innerHeight;
      scrollProgressRef.current =
        denom > 0 ? Math.min(1, Math.max(0, window.scrollY / denom)) : 0;
      bottomGapRef.current = Math.max(0, sh - window.scrollY - window.innerHeight);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      drops = Array.from(
        { length: Math.min(420, Math.round(area / 4200)) },
        () => makeDrop(true)
      );
      leaves = Array.from(
        { length: Math.min(70, Math.round(area / 26000)) },
        () => makeLeaf(true)
      );
      maxAccum = Math.min(150, height * 0.16);
      buildPile();
      readScroll();
    }

    resize();
    readScroll();
    p = scrollProgressRef.current;
    gap = bottomGapRef.current;
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readScroll, { passive: true });

    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      const dt = Math.min(now - last, 50);
      last = now;
      const dtScale = dt / 16.67;

      // Ease theme + scroll
      t += (targetRef.current - t) * Math.min(1, dt / 650);
      p += (scrollProgressRef.current - p) * Math.min(1, dt / 320);
      gap += (bottomGapRef.current - gap) * Math.min(1, dt / 260);

      // Accumulation (resets on theme switch); fills over time on the page.
      if (resetAccumRef.current) {
        accum = 0;
        ripples = [];
        buildPile();
        resetAccumRef.current = false;
      }
      accum = Math.min(1, accum + dt / FILL_MS);

      const stormOpacity = t;
      const dayOpacity = 1 - t;
      const pileBottomY = height + gap; // page bottom in viewport space
      const accumH = accum * maxAccum;

      // Publish the water surface so the Buddy can float on it.
      const surfaceVisibleNow = pileBottomY - accumH < height + 40;
      weatherState.storm = stormOpacity > 0.5;
      weatherState.surfaceY =
        stormOpacity > 0.5 && accumH > 0.5 && surfaceVisibleNow
          ? pileBottomY - accumH
          : Infinity;

      ctx.clearRect(0, 0, width, height);

      /* ===================== DAY (light) ===================== */
      if (dayOpacity > 0.01) {
        const sky = skyAt(p);
        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, rgba(sky.top, 0.34 * dayOpacity));
        g.addColorStop(0.55, rgba(sky.bottom, 0.13 * dayOpacity));
        g.addColorStop(1, rgba(sky.bottom, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        // Falling leaves
        for (const lf of leaves) {
          lf.phase += lf.swaySpeed * dt;
          lf.angle += lf.spin * dtScale;
          lf.flip = Math.cos(lf.phase * 1.6); // -1..1 → 3D tumble
          lf.y += lf.vy * dtScale;
          lf.x += (Math.cos(lf.phase) * lf.sway * 0.02 + 0.4 + p * 0.8) * dtScale;
          if (lf.y - lf.size > height || lf.x - lf.size > width + 40) {
            Object.assign(lf, makeLeaf(false));
            lf.x = Math.random() * (width + 120) - 120;
            lf.y = -30 - Math.random() * height * 0.2;
          }
          const [face, shade] = LEAF_COLORS[lf.ci];
          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.angle);
          ctx.scale(Math.max(0.18, Math.abs(lf.flip)), 1);
          drawLeaf(lf.size, face, shade, 0.92 * dayOpacity);
          ctx.restore();
        }
      }

      /* ===================== STORM (dark) ==================== */
      if (stormOpacity > 0.01) {
        const depth = 0.35 + 0.65 * p;
        const g = ctx.createLinearGradient(0, 0, 0, height);
        g.addColorStop(0, rgba([26, 32, 52], 0.55 * stormOpacity * depth));
        g.addColorStop(0.45, rgba([20, 24, 38], 0.2 * stormOpacity));
        g.addColorStop(1, rgba([18, 20, 30], 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        const strikeGap = 4800 - 2600 * p;
        nextStrike -= dt;
        if (nextStrike <= 0 && strikeQueue === 0) {
          strikeQueue = 1 + (Math.random() < 0.5 ? 1 : 0);
          nextStrike = strikeGap + Math.random() * strikeGap;
        }
        if (strikeQueue > 0 && flash < 0.05) {
          flash = 0.55 + Math.random() * 0.45;
          strikeQueue -= 1;
        }
      }

      // Lightning flash decay
      if (flash > 0) {
        flash -= 0.06 * dtScale;
        if (flash < 0) flash = 0;
        const f = flash * stormOpacity;
        const lg = ctx.createLinearGradient(0, 0, 0, height);
        lg.addColorStop(0, rgba([200, 214, 245], 0.6 * f));
        lg.addColorStop(0.6, rgba([170, 186, 225], 0.12 * f));
        lg.addColorStop(1, rgba([170, 186, 225], 0));
        ctx.fillStyle = lg;
        ctx.fillRect(0, 0, width, height);
      }

      // Rain
      if (stormOpacity > 0.01) {
        const WIND = 1.8;
        ctx.lineCap = "round";
        for (const d of drops) {
          d.y += d.vy * dtScale;
          d.x += WIND * dtScale;
          if (d.y - d.len > height || d.x > width + 100) {
            Object.assign(d, makeDrop(false));
          }
          const a = d.alpha * stormOpacity * (0.7 + flash * 0.6);
          ctx.strokeStyle = rgba([190, 205, 230], a);
          ctx.lineWidth = d.thickness;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - (WIND / d.vy) * d.len, d.y - d.len);
          ctx.stroke();
        }
      }

      /* ============ ACCUMULATION (page bottom) ============== */
      const surfaceVisible = pileBottomY - accumH < height + 40;

      // Water puddle (storm)
      if (stormOpacity > 0.02 && accumH > 0.5 && surfaceVisible) {
        const surfaceY = pileBottomY - accumH;
        const tsec = now / 1000;
        const wave = (x: number) =>
          Math.sin(x * 0.012 + tsec * 1.6) * 3 +
          Math.sin(x * 0.03 + tsec * 2.3) * 1.6;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, surfaceY + wave(0));
        for (let x = 12; x < width; x += 12) ctx.lineTo(x, surfaceY + wave(x));
        ctx.lineTo(width, surfaceY + wave(width)); // reach the right edge exactly
        ctx.lineTo(width, pileBottomY + 4);
        ctx.lineTo(0, pileBottomY + 4);
        ctx.closePath();
        const wg = ctx.createLinearGradient(0, surfaceY, 0, pileBottomY);
        wg.addColorStop(0, rgba([120, 150, 195], 0.5 * stormOpacity));
        wg.addColorStop(1, rgba([34, 52, 92], 0.62 * stormOpacity));
        ctx.fillStyle = wg;
        ctx.fill();
        // surface highlight
        ctx.strokeStyle = rgba([200, 220, 250], 0.35 * stormOpacity);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, surfaceY + wave(0));
        for (let x = 12; x < width; x += 12) ctx.lineTo(x, surfaceY + wave(x));
        ctx.lineTo(width, surfaceY + wave(width));
        ctx.stroke();
        ctx.restore();

        // Rain dimples the surface with ripples
        if (Math.random() < 0.5) {
          ripples.push({
            x: Math.random() * width,
            age: 0,
            speed: 0.5 + Math.random() * 0.6,
            width: 14 + Math.random() * 26,
          });
        }
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.age += (dt / 1000) * rp.speed;
          if (rp.age >= 1) {
            ripples.splice(i, 1);
            continue;
          }
          const ry = surfaceY + wave(rp.x);
          const rw = rp.width * rp.age;
          ctx.strokeStyle = rgba([210, 226, 250], (1 - rp.age) * 0.4 * stormOpacity);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(rp.x, ry, rw, rw * 0.28, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Leaf pile (day)
      if (dayOpacity > 0.02 && accumH > 0.5 && surfaceVisible) {
        // Base mass following the uneven top profile
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, pileBottomY + 4);
        const n = pileProfile.length;
        for (let i = 0; i <= n; i++) {
          const fx = i / n;
          const topY = pileBottomY - accumH * profileAt(fx);
          ctx.lineTo(fx * width, topY);
        }
        ctx.lineTo(width, pileBottomY + 4);
        ctx.closePath();
        const pg = ctx.createLinearGradient(0, pileBottomY - accumH, 0, pileBottomY);
        pg.addColorStop(0, rgba([170, 96, 38], 0.85 * dayOpacity));
        pg.addColorStop(1, rgba([120, 64, 28], 0.92 * dayOpacity));
        ctx.fillStyle = pg;
        ctx.fill();
        ctx.restore();

        // Scattered leaves for texture, riding the pile height
        for (const pl of pileLeaves) {
          const colH = accumH * profileAt(pl.fx);
          const y = pileBottomY - pl.fy * colH;
          const [face, shade] = LEAF_COLORS[pl.ci];
          ctx.save();
          ctx.translate(pl.fx * width, y);
          ctx.rotate(pl.angle);
          ctx.scale(1, 0.8); // settled / flattened
          drawLeaf(pl.size, face, shade, 0.95 * dayOpacity);
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", readScroll);
      weatherState.surfaceY = Infinity;
      weatherState.storm = false;
    };
  }, []);

  return (
    <div className={styles.weather} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

/* ============================================================
   Weather — theme + scroll reactive atmosphere (pure canvas).

   Dark mode  → thunderstorm: slanted rain, lightning, and water
                that collects at the bottom of the PAGE, filling
                the longer you stay (resets on reload / nav / theme
                switch). Rain dimples the surface with ripples.
   Light mode → warm sky journeying sunrise → sunset with scroll,
                and autumn leaves that tumble down and gather into
                a soft pile at the page bottom. When the buddy plays
                with the heap it bursts a few leaves into the air.

   One full-screen canvas (pointer-events: none) painted above
   content but below Nav/Buddy. Theme changes crossfade smoothly
   and reset the accumulation. The water surface is published to
   weatherState so the Buddy can float on it.
   Respects prefers-reduced-motion (renders nothing).
   ============================================================ */

"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { weatherState } from "@/lib/weatherState";
import styles from "./Weather.module.css";

/* ---- types ---- */
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
  flip: number;
  ci: number;
}
/** Static leaf making up the pile at the page bottom */
interface PileLeaf {
  fx: number;
  fy: number;
  size: number;
  angle: number;
  ci: number;
}
/** A leaf kicked loose from the heap (buddy playing) — tiny ballistic toss */
interface KickedLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  ci: number;
  life: number;
}
interface Ripple {
  x: number;
  age: number;
  speed: number;
  width: number;
}

/* ---- colour helpers ---- */
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, k: number): RGB => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];
const rgba = (c: RGB, a: number) =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;

const LEAF_COLORS: [RGB, RGB][] = [
  [[201, 67, 43], [140, 36, 26]],
  [[230, 126, 34], [168, 76, 18]],
  [[211, 84, 0], [138, 50, 4]],
  [[201, 148, 31], [150, 100, 16]],
  [[160, 82, 45], [104, 50, 28]],
  [[205, 133, 63], [140, 84, 38]],
  [[224, 168, 64], [168, 116, 34]],
];

interface Sky { top: RGB; bottom: RGB; }
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
  const bottomGapRef = useRef(0);

  useEffect(() => {
    targetRef.current = theme === "dark" ? 1 : 0;
    resetAccumRef.current = true;
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
    let pileProfile: number[] = [];
    let ripples: Ripple[] = [];
    let kicked: KickedLeaf[] = [];

    let t = targetRef.current;
    let p = 0;
    let gap = 0;
    let accum = 0;
    let maxAccum = 120;

    let flash = 0;
    let nextStrike = 1500 + Math.random() * 4000;
    let strikeQueue = 0;

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
        ci: (Math.random() * LEAF_COLORS.length) | 0,
      };
    }

    function buildPile() {
      // Dense leaves packed into the top band of the heap so it reads as a
      // mound of individual leaves rather than a flat brown blob. `band` is
      // 0 at the crest → 1 deeper down; deeper leaves are drawn first & darker.
      const count = Math.min(340, Math.round(width / 6));
      pileLeaves = Array.from({ length: count }, () => ({
        fx: Math.random(),
        fy: Math.random(), // reused as `band`
        size: 9 + Math.random() * 9,
        angle: (Math.random() - 0.5) * 1.6,
        ci: (Math.random() * LEAF_COLORS.length) | 0,
      }));
      // draw deepest first for correct overlap
      pileLeaves.sort((a, b) => b.fy - a.fy);

      const n = 80;
      const phA = Math.random() * 6.28;
      const phB = Math.random() * 6.28;
      const phC = Math.random() * 6.28;
      pileProfile = Array.from({ length: n }, (_, i) => {
        const x = i / n;
        const v =
          0.78 +
          0.14 * Math.sin(x * Math.PI * 2.5 + phA) +
          0.07 * Math.sin(x * Math.PI * 6 + phB) +
          0.04 * Math.sin(x * Math.PI * 11 + phC);
        return Math.max(0.5, Math.min(1, v));
      });
    }

    const profileAt = (fx: number) => {
      const n = pileProfile.length;
      if (!n) return 1;
      return pileProfile[Math.min(n - 1, Math.max(0, (fx * n) | 0))];
    };

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
      ctx.strokeStyle = rgba(shade, alpha * 0.7);
      ctx.lineWidth = Math.max(0.5, size * 0.06);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.82);
      ctx.lineTo(0, h);
      ctx.moveTo(0, -h * 0.2);
      ctx.lineTo(w * 0.55, -h * 0.45);
      ctx.moveTo(0, -h * 0.2);
      ctx.lineTo(-w * 0.55, -h * 0.45);
      ctx.stroke();
    }

    /* ---- shared disturb hook: buddy plays with the heap → leaves burst ---- */
    weatherState.disturb = (x: number, _y: number, power: number) => {
      if (weatherState.storm) return; // only the leaf pile reacts
      const n = 5 + ((Math.random() * 4) | 0);
      const baseY = (typeof window !== "undefined" ? window.innerHeight : height) + 0;
      for (let i = 0; i < n; i++) {
        kicked.push({
          x: x + (Math.random() - 0.5) * 30,
          y: baseY - 6 - Math.random() * 12,
          vx: (Math.random() - 0.5) * 3.4 * power,
          vy: -(2.2 + Math.random() * 2.6) * power,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.3,
          size: 7 + Math.random() * 6,
          ci: (Math.random() * LEAF_COLORS.length) | 0,
          life: 1,
        });
      }
    };

    function readScroll() {
      const sh = document.documentElement.scrollHeight;
      const denom = sh - window.innerHeight;
      scrollProgressRef.current = denom > 0 ? Math.min(1, Math.max(0, window.scrollY / denom)) : 0;
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
      drops = Array.from({ length: Math.min(420, Math.round(area / 4200)) }, () => makeDrop(true));
      leaves = Array.from({ length: Math.min(70, Math.round(area / 26000)) }, () => makeLeaf(true));
      maxAccum = Math.min(150, height * 0.16);
      buildPile();
      readScroll();
    }

    resize();
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

      t += (targetRef.current - t) * Math.min(1, dt / 650);
      p += (scrollProgressRef.current - p) * Math.min(1, dt / 320);
      gap += (bottomGapRef.current - gap) * Math.min(1, dt / 260);

      if (resetAccumRef.current) {
        accum = 0;
        ripples = [];
        kicked = [];
        buildPile();
        resetAccumRef.current = false;
      }
      accum = Math.min(1, accum + dt / FILL_MS);

      const stormOpacity = t;
      const dayOpacity = 1 - t;
      const pileBottomY = height + gap;
      const accumH = accum * maxAccum;
      const surfaceVisible = pileBottomY - accumH < height + 40;

      weatherState.storm = stormOpacity > 0.5;
      weatherState.surfaceY =
        stormOpacity > 0.5 && accumH > 0.5 && surfaceVisible ? pileBottomY - accumH : Infinity;
      // Fill top for the footer letters — water (dark) or leaf heap (light).
      weatherState.fillY =
        accumH > 0.5 && surfaceVisible && (stormOpacity > 0.5 || dayOpacity > 0.5)
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

        for (const lf of leaves) {
          lf.phase += lf.swaySpeed * dt;
          lf.angle += lf.spin * dtScale;
          lf.flip = Math.cos(lf.phase * 1.6);
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

      /* ---- rain ---- */
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
      // Water puddle (storm)
      if (stormOpacity > 0.02 && accumH > 0.5 && surfaceVisible) {
        const surfaceY = pileBottomY - accumH;
        const tsec = now / 1000;
        const wave = (x: number) =>
          Math.sin(x * 0.012 + tsec * 1.6) * 3 + Math.sin(x * 0.03 + tsec * 2.3) * 1.6;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, surfaceY + wave(0));
        for (let x = 12; x < width; x += 12) ctx.lineTo(x, surfaceY + wave(x));
        ctx.lineTo(width, surfaceY + wave(width));
        ctx.lineTo(width, pileBottomY + 4);
        ctx.lineTo(0, pileBottomY + 4);
        ctx.closePath();
        const wg = ctx.createLinearGradient(0, surfaceY, 0, pileBottomY);
        wg.addColorStop(0, rgba([120, 150, 195], 0.5 * stormOpacity));
        wg.addColorStop(1, rgba([34, 52, 92], 0.62 * stormOpacity));
        ctx.fillStyle = wg;
        ctx.fill();
        ctx.strokeStyle = rgba([200, 220, 250], 0.35 * stormOpacity);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, surfaceY + wave(0));
        for (let x = 12; x < width; x += 12) ctx.lineTo(x, surfaceY + wave(x));
        ctx.lineTo(width, surfaceY + wave(width));
        ctx.stroke();
        ctx.restore();

        // rain dimples the surface
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

      // Leaf pile (day) — a shadowed mass crowned with a dense leafy crest.
      if (dayOpacity > 0.02 && accumH > 0.5 && surfaceVisible) {
        const n = pileProfile.length;
        const topAt = (fx: number) => pileBottomY - accumH * profileAt(fx);

        // 1) deep mass: warm, shadowed body so no page shows through the gaps
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, pileBottomY + 4);
        for (let i = 0; i <= n; i++) ctx.lineTo((i / n) * width, topAt(i / n) + 4);
        ctx.lineTo(width, pileBottomY + 4);
        ctx.closePath();
        const pg = ctx.createLinearGradient(0, pileBottomY - accumH, 0, pileBottomY);
        pg.addColorStop(0, rgba([150, 82, 34], 0.9 * dayOpacity));
        pg.addColorStop(0.5, rgba([116, 60, 26], 0.95 * dayOpacity));
        pg.addColorStop(1, rgba([74, 40, 18], 0.97 * dayOpacity));
        ctx.fillStyle = pg;
        ctx.fill();
        ctx.restore();

        // 2) leafy crest: individual leaves packed into the top band, deeper
        //    ones darker so the mound has real depth
        const band = Math.min(accumH, 40);
        for (const pl of pileLeaves) {
          const t0 = topAt(pl.fx);
          const y = t0 + pl.fy * band; // 0 at crest → down into the band
          const shadeMix = 0.55 + 0.45 * (1 - pl.fy); // crest brighter
          const [face0, shade0] = LEAF_COLORS[pl.ci];
          const face: RGB = [face0[0] * shadeMix, face0[1] * shadeMix, face0[2] * shadeMix];
          const shade: RGB = [shade0[0] * shadeMix, shade0[1] * shadeMix, shade0[2] * shadeMix];
          ctx.save();
          ctx.translate(pl.fx * width, y);
          ctx.rotate(pl.angle);
          ctx.scale(1.15, 0.85); // foreshortened, lying flat
          drawLeaf(pl.size, face, shade, 0.97 * dayOpacity);
          ctx.restore();
        }
      }

      /* ---- kicked leaves (buddy playing with the heap) ---- */
      if (kicked.length) {
        for (let i = kicked.length - 1; i >= 0; i--) {
          const k = kicked[i];
          k.vy += 0.22 * dtScale; // gravity
          k.vx *= 0.99;
          k.x += k.vx * dtScale;
          k.y += k.vy * dtScale;
          k.angle += k.spin * dtScale;
          k.life -= 0.006 * dtScale;
          if (k.life <= 0 || k.y - k.size > height + 10) {
            kicked.splice(i, 1);
            continue;
          }
          const [face, shade] = LEAF_COLORS[k.ci];
          ctx.save();
          ctx.translate(k.x, k.y);
          ctx.rotate(k.angle);
          drawLeaf(k.size, face, shade, 0.95 * dayOpacity);
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
      weatherState.fillY = Infinity;
      weatherState.storm = false;
      weatherState.disturb = () => {};
    };
  }, []);

  return (
    <div className={styles.weather} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

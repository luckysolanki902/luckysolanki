/* Theme atmosphere: slow snowfall in winter twilight; autumn leaves in
   light mode. Snow settles into a low, still bank at the page bottom.
   The canvas never intercepts input and respects reduced motion. */

"use client";

import { useEffect, useRef } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { weatherState } from "@/lib/weatherState";
import styles from "./Weather.module.css";

/* ---- types ---- */
interface Snowflake {
  x: number;
  y: number;
  radius: number;
  phase: number;
  drift: number;
  angle: number;
  spin: number;
  near: boolean;
  sprite: number;
  vy: number;
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

const FILL_MS = 70000; // time to fully fill the snowbank / leaf pile

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
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const el = canvasRef.current;
    if (!el) return;
    const context = el.getContext("2d");
    if (!context) return;
    const canvas = el;
    const ctx = context;

    // Snow falls in irregular aggregates, not luminous circles or icon stars.
    // Cache several silhouettes so individual flakes have different outlines.
    function snowSprite(index: number, blurred: boolean) {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 80;
      const brush = sprite.getContext("2d")!;
      brush.translate(40, 40);
      brush.filter = blurred ? "blur(3px)" : "blur(0.8px)";
      // Overlapping rounded ice aggregates produce an asymmetric, fluffy edge.
      // Avoid radial polygons: their pointed silhouettes read as little stars.
      for (let grain = 0; grain < 7; grain++) {
        const x = Math.sin(grain * 2.39 + index * 1.7) * 10;
        const y = Math.cos(grain * 1.83 + index * 0.9) * 8;
        const radius = 8 + (Math.sin(grain * 3.1 + index) + 1) * 3;
        const frost = brush.createRadialGradient(x, y, 0, x, y, radius);
        frost.addColorStop(0, "rgba(249, 252, 255, .9)");
        frost.addColorStop(0.65, "rgba(241, 247, 253, .85)");
        frost.addColorStop(1, "rgba(234, 243, 252, 0)");
        brush.fillStyle = frost;
        brush.beginPath();
        brush.ellipse(x, y, radius, radius * 0.78, grain * 0.7, 0, Math.PI * 2);
        brush.fill();
      }
      return sprite;
    }
    const snowSprites = Array.from({ length: 8 }, (_, i) => snowSprite(i, false));
    const softSprites = Array.from({ length: 8 }, (_, i) => snowSprite(i, true));

    let width = 0;
    let height = 0;
    let dpr = 1;

    let snowflakes: Snowflake[] = [];
    let leaves: Leaf[] = [];
    let pileLeaves: PileLeaf[] = [];
    let pileProfile: number[] = [];
    let kicked: KickedLeaf[] = [];

    let t = targetRef.current;
    let p = 0;
    let gap = 0;
    let accum = 0;
    let maxAccum = 120;

    function makeSnowflake(initial: boolean): Snowflake {
      const depth = Math.random();
      const near = depth > 0.85;
      return {
        x: Math.random() * (width + 80) - 40,
        y: initial ? Math.random() * height : -10 - Math.random() * 60,
        radius: near ? 7 + Math.random() * 4 : depth < 0.2 ? 1.8 + Math.random() : 3.5 + Math.random() * 3,
        vy: 0.55 + depth * 1.1,
        phase: Math.random() * Math.PI * 2,
        drift: 0.4 + Math.random() * 0.8,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.018,
        near,
        sprite: Math.floor(Math.random() * snowSprites.length),
        alpha: near ? 0.35 + Math.random() * 0.2 : 0.5 + depth * 0.35,
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
      if (targetRef.current > 0.5) return; // only the leaf pile reacts
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
      snowflakes = Array.from({ length: Math.min(130, Math.max(35, Math.round(area / 9000))) }, () => makeSnowflake(true));
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
        kicked = [];
        buildPile();
        resetAccumRef.current = false;
      }
      accum = Math.min(1, accum + dt / FILL_MS);

      const snowOpacity = t;
      const dayOpacity = 1 - t;
      const pileBottomY = height + gap;
      const accumH = accum * (maxAccum * dayOpacity + Math.min(38, height * 0.05) * snowOpacity);
      const surfaceVisible = pileBottomY - accumH < height + 40;

      // Snow is solid ground: no storm umbrella or floating-water behavior.
      weatherState.storm = false;
      weatherState.surfaceY = Infinity;
      weatherState.fillY = accumH > 0.5 && surfaceVisible ? pileBottomY - accumH : Infinity;

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

      /* ---- Layered snowfall: irregular clumps tumble and drift at different depths. ---- */
      if (snowOpacity > 0.01) {
        const wind = Math.sin(now * 0.00013) * 0.45 + Math.sin(now * 0.00031) * 0.18;
        for (const flake of snowflakes) {
          flake.phase += dt * 0.0007;
          flake.angle += flake.spin * dtScale;
          flake.y += flake.vy * dtScale;
          flake.x += (wind + Math.sin(flake.phase) * flake.drift) * dtScale;
          if (flake.y - flake.radius > height || flake.x > width + 40 || flake.x < -40) {
            Object.assign(flake, makeSnowflake(false));
          }
          const edge = Math.min(1, Math.abs(flake.x / width - 0.5) * 2);
          const alpha = flake.alpha * snowOpacity * (0.65 + edge * 0.35);
          ctx.save();
          ctx.translate(flake.x, flake.y);
          ctx.rotate(flake.angle);
          // Each aggregate gently rolls, keeping its irregular silhouette visible.
          ctx.scale(0.7 + Math.abs(Math.cos(flake.phase)) * 0.3, 1);
          ctx.globalAlpha = alpha;
          const sprite = (flake.near ? softSprites : snowSprites)[flake.sprite];
          const size = flake.radius * 3;
          ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
      }

      /* ---- A low, still snowbank with broad, soft contours. ---- */
      if (snowOpacity > 0.02 && accumH > 0.5 && surfaceVisible) {
        const surfaceY = pileBottomY - accumH;
        const crest = (x: number) => surfaceY + accumH * (
          0.12 + Math.sin(x / width * Math.PI * 3 + 0.5) * 0.08
          + Math.sin(x / width * Math.PI * 5) * 0.04
        );
        ctx.beginPath();
        ctx.moveTo(0, crest(0));
        for (let x = 8; x < width; x += 8) ctx.lineTo(x, crest(x));
        ctx.lineTo(width, crest(width));
        ctx.lineTo(width, pileBottomY + 4);
        ctx.lineTo(0, pileBottomY + 4);
        ctx.closePath();
        const snow = ctx.createLinearGradient(0, surfaceY, 0, pileBottomY);
        snow.addColorStop(0, rgba([222, 231, 244], 0.92 * snowOpacity));
        snow.addColorStop(1, rgba([162, 181, 206], 0.96 * snowOpacity));
        ctx.fillStyle = snow;
        ctx.fill();
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

    function syncMotion() {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, width, height);
      weatherState.fillY = Infinity;
      weatherState.surfaceY = Infinity;
      weatherState.storm = false;
      if (!motionPreference.matches) {
        last = performance.now();
        resetAccumRef.current = true;
        raf = requestAnimationFrame(frame);
      }
    }

    syncMotion();
    motionPreference.addEventListener("change", syncMotion);

    return () => {
      motionPreference.removeEventListener("change", syncMotion);
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

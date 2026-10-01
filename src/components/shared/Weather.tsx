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
  shape: number;
}
/** Static leaf making up the pile at the page bottom */
interface PileLeaf {
  fx: number;
  fy: number;
  size: number;
  angle: number;
  ci: number;
  shape: number;
}
/** A leaf kicked loose from the heap (buddy playing), tiny ballistic toss */
interface KickedLeaf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  size: number;
  ci: number;
  shape: number;
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

const FILL_MS = 70000; // time to fully fill the snowbank / leaf pile

export function Weather() {
  const theme = useThemeStore((s) => s.theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
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
    const pileCanvas = document.createElement("canvas");
    const pileBrush = pileCanvas.getContext("2d")!;
    const pileHeight = 110;
    let kicked: KickedLeaf[] = [];

    let t = targetRef.current;
    let atmosphere = 1;
    let p = 0;
    let gap = 0;
    let accum = 0;
    let maxAccum = 60;
    let previousSky = "";

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
        size: 10 + Math.random() * 10,
        vy: 0.35 + Math.random() * 0.55,
        sway: 12 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.00035 + Math.random() * 0.00045,
        spin: (Math.random() - 0.5) * 0.006,
        angle: Math.random() * Math.PI * 2,
        flip: 1,
        ci: (Math.random() * LEAF_COLORS.length) | 0,
        shape: Math.floor(Math.random() * 3),
      };
    }

    // Bake botanical silhouettes once. The animation only composites cached images.
    function leafSprite(ci: number, shape: number) {
      const sprite = document.createElement("canvas");
      sprite.width = sprite.height = 128;
      const brush = sprite.getContext("2d")!;
      brush.translate(64, 60);
      const [face, shade] = LEAF_COLORS[ci];
      const outline = new Path2D();
      if (shape === 0) {
        // Five asymmetric lobes and notched margins give maple leaves their silhouette.
        const points = [[0,-46],[9,-25],[17,-30],[16,-11],[35,-24],[30,-8],[43,-3],[24,9],[28,18],[9,21],[2,35],[-7,24],[-27,23],[-22,11],[-42,2],[-28,-7],[-34,-23],[-15,-13],[-17,-31],[-7,-25]];
        outline.moveTo(points[0][0], points[0][1]);
        points.slice(1).forEach(([x,y]) => outline.lineTo(x,y));
      } else if (shape === 1) {
        outline.moveTo(0,-44);
        outline.bezierCurveTo(19,-45,9,-29,17,-28);
        outline.bezierCurveTo(38,-28,24,-12,28,-8);
        outline.bezierCurveTo(45,0,21,13,20,18);
        outline.bezierCurveTo(26,28,8,29,0,37);
        outline.bezierCurveTo(-9,27,-26,30,-20,17);
        outline.bezierCurveTo(-39,13,-33,-3,-25,-9);
        outline.bezierCurveTo(-36,-22,-14,-29,-13,-29);
        outline.bezierCurveTo(-23,-40,-6,-44,0,-44);
      } else {
        outline.moveTo(0,-45);
        outline.bezierCurveTo(11,-27,36,-15,27,7);
        outline.bezierCurveTo(22,23,8,28,0,36);
        outline.bezierCurveTo(-19,27,-34,7,-25,-14);
        outline.bezierCurveTo(-20,-28,-8,-34,0,-45);
      }
      outline.closePath();
      const pigment = brush.createLinearGradient(-30,-25,35,30);
      pigment.addColorStop(0,rgba(mix(face,[248,211,128],.3),1));
      pigment.addColorStop(.46,rgba(face,1));
      pigment.addColorStop(.51,rgba(mix(face,shade,.2),1));
      pigment.addColorStop(1,rgba(shade,1));
      brush.fillStyle = pigment;
      brush.fill(outline);
      brush.strokeStyle = rgba(shade,.3);
      brush.lineWidth = .7;
      brush.stroke(outline);
      brush.save();
      brush.clip(outline);
      brush.strokeStyle = rgba([252,219,155],.48);
      brush.lineWidth = 1;
      brush.beginPath();
      brush.moveTo(0,37); brush.quadraticCurveTo(-3,0,0,-43);
      for (let y = -20; y <= 20; y += 13) {
        brush.moveTo(-1,y+8); brush.quadraticCurveTo(10,y,28,y-13);
        brush.moveTo(-1,y+8); brush.quadraticCurveTo(-12,y,-28,y-11);
      }
      brush.stroke();
      brush.restore();
      brush.strokeStyle = rgba(shade,.8);
      brush.lineWidth = 1.8;
      brush.beginPath(); brush.moveTo(0,30); brush.quadraticCurveTo(3,41,9,48); brush.stroke();
      return sprite;
    }
    const leafSprites = LEAF_COLORS.map((_,ci) => Array.from({length:3},(_,shape) => leafSprite(ci,shape)));
    function drawLeaf(size: number, ci: number, shape: number, alpha: number) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(leafSprites[ci][shape],-size*1.4,-size*1.4,size*2.8,size*2.8);
    }

    function buildPile() {
      const count = Math.min(230, Math.round(width / 5));
      pileLeaves = Array.from({ length: count }, () => ({
        fx: Math.random(), fy: Math.random(),
        size: 13 + Math.random() * 11,
        angle: Math.random() * Math.PI * 2,
        ci: (Math.random() * LEAF_COLORS.length) | 0,
        shape: Math.floor(Math.random() * 3),
      }));
      // A low scatter through the middle with fuller drifts at the edges. No solid fill.
      pileLeaves.sort((a,b) => a.fy - b.fy);
      const resolution = Math.min(dpr,1.5);
      pileCanvas.width = Math.ceil(width * resolution);
      pileCanvas.height = Math.ceil(pileHeight * resolution);
      pileBrush.setTransform(resolution,0,0,resolution,0,0);
      for (const leaf of pileLeaves) {
        const edge = Math.pow(Math.abs(leaf.fx - .5) * 2,1.7);
        const depth = 14 + edge * 42 + Math.sin(leaf.fx * Math.PI * 5) * 5;
        pileBrush.save();
        pileBrush.translate(leaf.fx * width,pileHeight - depth * (1-leaf.fy) - 3);
        pileBrush.rotate(leaf.angle);
        pileBrush.scale(1,.58 + leaf.fy * .2);
        pileBrush.globalAlpha = .78 + leaf.fy * .2;
        pileBrush.shadowColor = "rgba(67,39,20,.2)";
        pileBrush.shadowBlur = 2;
        pileBrush.shadowOffsetY = 2;
        const size = leaf.size * 2.8;
        pileBrush.drawImage(leafSprites[leaf.ci][leaf.shape],-size/2,-size/2,size,size);
        pileBrush.restore();
      }
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
          shape: Math.floor(Math.random() * 3),
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
      leaves = Array.from({ length: Math.min(28, Math.max(8, Math.round(area / 52000))) }, () => makeLeaf(true));
      maxAccum = Math.min(64, height * 0.085);
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

      atmosphere += (weatherState.atmosphere - atmosphere) * Math.min(1, dt / 600);
      const snowOpacity = t;
      const dayOpacity = 1 - t;
      const pileBottomY = height + gap;
      const accumH = accum * (maxAccum * dayOpacity + Math.min(38, height * 0.05) * snowOpacity);
      const surfaceVisible = pileBottomY - accumH < height + 40;

      // Snow is solid ground: no storm umbrella or floating-water behavior.
      weatherState.storm = false;
      weatherState.surfaceY = Infinity;
      // Footer text follows the shallow centre of the leaf scatter, not the taller side drifts.
      const centreHeight = accum * 22 * dayOpacity + accumH * snowOpacity;
      weatherState.fillY = centreHeight > 0.5 && surfaceVisible ? pileBottomY - centreHeight : Infinity;

      ctx.clearRect(0, 0, width, height);

      /* ===================== DAY (light) ===================== */
      if (dayOpacity > 0.01) {
        const skyKey = p.toFixed(3);
        if (skyKey !== previousSky) {
          previousSky = skyKey;
          skyRef.current?.style.setProperty("--sunset", (p * .55).toFixed(3));
          skyRef.current?.style.setProperty("--sun-travel", `${(p * 48).toFixed(2)}vh`);
        }
        const breeze = Math.sin(now * .00013) * .22 + .18;
        for (const lf of leaves) {
          lf.phase += lf.swaySpeed * dt;
          lf.angle += lf.spin * dtScale;
          lf.flip = Math.cos(lf.phase * .7);
          lf.y += lf.vy * dtScale;
          lf.x += (Math.cos(lf.phase) * lf.sway * 0.018 + breeze) * dtScale;
          if (lf.y - lf.size > height || lf.x - lf.size > width + 40 || lf.x < -60) {
            Object.assign(lf, makeLeaf(false));
            lf.x = Math.random() * (width + 120) - 120;
            lf.y = -30 - Math.random() * height * 0.2;
          }
          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.angle + Math.sin(lf.phase) * .35);
          ctx.scale(Math.max(0.22, Math.abs(lf.flip)), .9 + Math.sin(lf.phase) * .1);
          const edge = Math.min(1, Math.abs(lf.x / width - .5) * 2);
          drawLeaf(lf.size, lf.ci, lf.shape, dayOpacity * (.26 + edge * .35) * (.35 + atmosphere * .65));
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
          const alpha = flake.alpha * snowOpacity * atmosphere * (0.65 + edge * 0.35);
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

      // Composite the cached scatter once, lifting it into view as leaves accumulate.
      if (dayOpacity > .02 && surfaceVisible) {
        ctx.save();
        ctx.globalAlpha = dayOpacity * Math.min(1, accum * 4);
        ctx.drawImage(pileCanvas,0,pileBottomY - pileHeight + (1-accum)*maxAccum,width,pileHeight);
        ctx.restore();
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
          ctx.save();
          ctx.translate(k.x, k.y);
          ctx.rotate(k.angle);
          drawLeaf(k.size, k.ci, k.shape, 0.85 * dayOpacity);
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
      if (!motionPreference.matches && !document.hidden) {
        last = performance.now();
        resetAccumRef.current = true;
        raf = requestAnimationFrame(frame);
      }
    }

    syncMotion();
    motionPreference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);

    return () => {
      motionPreference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
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
    <>
    <div ref={skyRef} className={styles.autumnSky} aria-hidden="true">
      <div className={styles.sunset} />
      <div className={styles.sun} />
      <div className={styles.haze} />
    </div>
    <div className={styles.weather} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
    </>
  );
}

/* ============================================================
   Buddy — Interactive pixel companion with idle activities.

   Pure-CSS pixel art blob (box-shadow grid).
   8 cols x 9 rows, 5px per pixel = 40x45px.

   Key fix: Interval-based scheduler that polls every 1.5s.
   Previous chain-based setTimeout died when stopActivity()
   cleared the timeout. Now it's unkillable.

   Activity props are pixel-art box-shadow grids matching
   the buddy's visual style — no generic CSS shapes.
   ============================================================ */

"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useBuddyStore, trackBehavior, getStrongestBehavior } from "@/lib/buddy-engine";
import { IntentDetector } from "@/lib/buddy-intent";
import {
  sectionEnterTriggers,
  idleTriggers,
  cursorLeftTriggers,
  cursorReturnTriggers,
  scrollFastTriggers,
  scrollTopTriggers,
  scrollBottomTriggers,
  scrollMilestoneTriggers,
  rapidScrollTriggers,
  getTimeGreeting,
  themeToggleTriggers,
  clickTriggers,
  buddyClickTriggers,
  visitCountTriggers,
  getSpecialTrigger,
  secretTrigger,
  copyTriggers,
  tabReturnTriggers,
  intentTriggers,
  hoverTriggers,
  buddyHideTriggers,
  buddySighTriggers,
  waterTriggers,
  navHoverTriggers,
  rareTriggers,
  behaviorMemoryTriggers,
  progressionTriggers,
  storyTriggers,
  type BuddyMood,
} from "@/lib/buddy-triggers";
import { useThemeStore } from "@/store/useThemeStore";
import { weatherState } from "@/lib/weatherState";
import { SECTION_IDS } from "@/lib/constants";
import styles from "./Buddy.module.css";

/* -----------------------------------------------------------
   PIXEL ART HELPERS
   ----------------------------------------------------------- */

/** Render a grid of characters into a box-shadow string */
function pixelProp(grid: string[], px: number, palette: Record<string, string>): string {
  const shadows: string[] = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const ch = grid[r][c];
      if (ch === "." || ch === " ") continue;
      const color = palette[ch];
      if (color) shadows.push(`${c * px}px ${r * px}px 0 ${color}`);
    }
  }
  return shadows.join(",");
}

const PP = 3; // prop pixel size
const FG = "var(--buddy-bubble-text)";

// Umbrella — canopy + ferrule + pole + curved handle (13×14 at 3px = 39×42px)
const PIXEL_UMBRELLA = pixelProp(
  [
    "......T......",
    "......C......",
    "....CCCCC....",
    "..CCCCCCCCC..",
    ".CCCCCCCCCCC.",
    "CCCCCCCCCCCCC",
    "D.D.D.D.D.D.D",
    "......P......",
    "......P......",
    "......P......",
    "......P......",
    ".....PP......",
    "....PP.......",
    "....P........",
  ],
  PP,
  { C: "#d9694a", D: "#a84a30", T: FG, P: FG }
);

/* -----------------------------------------------------------
   IDLE ACTIVITIES
   ----------------------------------------------------------- */
type IdleActivity =
  | "none"
  | "walk"
  | "lookAround"
  | "sleep"
  | "playLeaves" // light: shuffle through the leaf heap and scatter it
  | "swim"; // water: paddle around while floating

// Light mode (dry land). No props — the buddy just moves around and plays
// with the fallen leaves.
const LAND_POOL: IdleActivity[] = ["walk", "lookAround", "sleep", "playLeaves"];
// Dark mode, still dry (raining, sheltering under the umbrella).
const DARK_DRY_POOL: IdleActivity[] = ["walk", "lookAround", "sleep"];
// Dark mode, floating on the flood. Mostly just bobs; sometimes paddles.
const WATER_POOL: IdleActivity[] = ["swim"];

/* -----------------------------------------------------------
   BUDDY PIXEL ART — 8x9 blob, 5px per pixel
   ----------------------------------------------------------- */
function getPixelArt(mood: BuddyMood): string {
  const body = "var(--buddy-body)";
  const eye = "var(--buddy-eye)";
  const cheek = "var(--buddy-cheek)";
  const px = 5;

  const bodyPositions: [number, number][] = [
    [2, 0], [3, 0], [4, 0], [5, 0],
    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
    [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
    [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
    [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
    [1, 8], [2, 8], [5, 8], [6, 8],
  ];

  const eyePositions: [number, number][] = [];
  const cheekPositions: [number, number][] = [];
  const extraBody: [number, number][] = [];

  switch (mood) {
    case "idle":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
      break;
    case "blink":
    case "sleep":
      eyePositions.push([2, 4], [3, 4]);
      eyePositions.push([5, 4], [6, 4]);
      break;
    case "happy":
    case "love":
      eyePositions.push([2, 3], [3, 3]);
      eyePositions.push([5, 3], [6, 3]);
      cheekPositions.push([1, 5], [6, 5]);
      break;
    case "wink":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 4], [6, 4]);
      break;
    case "sad":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
      break;
    case "excited":
      eyePositions.push([2, 2], [3, 2], [2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 2], [6, 2], [5, 3], [6, 3], [5, 4], [6, 4]);
      break;
    case "think":
      eyePositions.push([3, 3], [3, 4]);
      eyePositions.push([6, 3], [6, 4]);
      break;
    case "shocked":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
      break;
    case "wave":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
      extraBody.push([7, 1]);
      break;
    case "peek":
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
      break;
    case "dizzy":
      // X X eyes — diagonal crosses
      eyePositions.push([2, 3], [3, 4]); // left eye: \
      eyePositions.push([3, 3], [2, 4]); // left eye: /
      eyePositions.push([5, 3], [6, 4]); // right eye: \
      eyePositions.push([6, 3], [5, 4]); // right eye: /
      break;
    default:
      eyePositions.push([2, 3], [3, 3], [2, 4], [3, 4]);
      eyePositions.push([5, 3], [6, 3], [5, 4], [6, 4]);
  }

  const eyeSet = new Set(eyePositions.map(([c, r]) => `${c},${r}`));
  const cheekSet = new Set(cheekPositions.map(([c, r]) => `${c},${r}`));
  const shadows: string[] = [];

  for (const [c, r] of bodyPositions) {
    const key = `${c},${r}`;
    if (eyeSet.has(key) || cheekSet.has(key)) continue;
    shadows.push(`${c * px}px ${r * px}px 0 ${body}`);
  }
  for (const [c, r] of eyePositions) {
    shadows.push(`${c * px}px ${r * px}px 0 ${eye}`);
  }
  for (const [c, r] of cheekPositions) {
    shadows.push(`${c * px}px ${r * px}px 0 ${cheek}`);
  }
  for (const [c, r] of extraBody) {
    shadows.push(`${c * px}px ${r * px}px 0 ${body}`);
  }

  return shadows.join(",");
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 4, scale: 0.97, transition: { duration: 0.12 } },
};

/* -----------------------------------------------------------
   HOVER TARGET SELECTORS
   ----------------------------------------------------------- */
const HOVER_SELECTORS: [string, string][] = [
  ['a[download], a[href*="resume"]', "resume"],
  ['a[href^="mailto:"]', "email"],
  ['a[href*="github.com"]', "github"],
  ['a[href*="linkedin.com"]', "linkedin"],
  ['a[href^="/stories/"]', "story"],
];

/* -----------------------------------------------------------
   COMPONENT
   ----------------------------------------------------------- */
export function Buddy() {
  const { mood, message, fire, dismiss, setMood, getVisitCount, incrementVisit } =
    useBuddyStore();
  const pathname = usePathname();
  const theme = useThemeStore((s) => s.theme);
  const prevThemeRef = useRef(theme);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollDirChanges = useRef(0);
  const lastScrollDir = useRef<"up" | "down">("down");
  const cursorLeftTriggered = useRef(false);
  const konamiBuffer = useRef<string[]>([]);
  const hasInitialized = useRef(false);
  const scrollMilestones = useRef(new Set<number>());
  const intentDetector = useRef(new IntentDetector());
  const currentSectionRef = useRef<string | null>(null);

  /* ---- Touch detection ---- */
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ---- Movement + activity state ---- */
  const [phase, setPhase] = useState<"offscreen" | "falling" | "landing" | "dizzy" | "settled">("offscreen");
  const [posX, setPosX] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [walking, setWalking] = useState(false);
  const [activity, setActivity] = useState<IdleActivity>("none");
  const [closingForAction, setClosingForAction] = useState(false);
  const [inWater, setInWater] = useState(false);
  const inWaterRef = useRef(false);
  const floatRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef(0);
  const phaseRef = useRef<"offscreen" | "falling" | "landing" | "dizzy" | "settled">("offscreen");
  const hidingRef = useRef(false);
  const activityRef = useRef<IdleActivity>("none");
  const lastActivityEnd = useRef(Date.now());
  const nextGap = useRef(2500 + Math.random() * 3500);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const walkTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastHoverFire = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prePosX = useRef(0);
  const lastPickedActivity = useRef<IdleActivity>("none");
  const startActivityRef = useRef<((act: IdleActivity) => void) | null>(null);

  // activityRef is maintained explicitly in start/run/finish/stopActivity so
  // it can stay "busy" during the umbrella-fold delay even while the rendered
  // `activity` state is briefly "none".

  const pixelShadow = useMemo(() => getPixelArt(mood), [mood]);

  /* ---- Entrance: fall from top → land → dizzy (X X eyes) → say hi ---- */
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Start falling after brief delay
    timers.push(setTimeout(() => { setPhase("falling"); phaseRef.current = "falling"; }, 100));
    // Land after fall animation completes (0.6s fall)
    timers.push(setTimeout(() => { setPhase("landing"); phaseRef.current = "landing"; }, 700));
    // Show dizzy eyes after squash recovery
    timers.push(setTimeout(() => {
      setPhase("dizzy");
      phaseRef.current = "dizzy";
      setMood("dizzy");
    }, 1000));
    // Recover and settle
    timers.push(setTimeout(() => {
      setMood("idle");
      setPhase("settled");
      phaseRef.current = "settled";
    }, 2200));
    return () => timers.forEach(clearTimeout);
  }, [setMood]);

  /* ---- Pick next activity from the right pool (no repeats) ----
     Light = dry land games. Dark = water sports once flooded,
     otherwise just quiet idling under the umbrella. */
  const pickActivity = useCallback((): IdleActivity => {
    const base =
      theme === "dark"
        ? inWaterRef.current
          ? WATER_POOL
          : DARK_DRY_POOL
        : LAND_POOL;
    let pool = base.filter((a) => a !== lastPickedActivity.current);
    if (pool.length === 0) pool = base;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    lastPickedActivity.current = pick;
    return pick;
  }, [theme]);

  /* ---- Stop any running activity ---- */
  const stopActivity = useCallback(() => {
    if (activityTimeout.current) clearTimeout(activityTimeout.current);
    if (walkTimeout.current) clearTimeout(walkTimeout.current);
    activityRef.current = "none"; // immediate sync
    setActivity("none");
    setWalking(false);
    if (useBuddyStore.getState().mood === "sleep") setMood("idle");
    lastActivityEnd.current = Date.now();
    nextGap.current = 2500 + Math.random() * 3500;
  }, [setMood]);

  /* ===========================================================
     IDLE ACTIVITY SCHEDULER — interval-based, unkillable.
     Polls every 1.5s. Checks if enough time has passed since
     last activity ended. The interval never dies, even if
     stopActivity() is called.
     =========================================================== */
  useEffect(() => {
    if (phase !== "settled") return;

    const finish = () => {
      const cur = activityRef.current;
      if (cur === "sleep" && useBuddyStore.getState().mood === "sleep") setMood("idle");
      activityRef.current = "none";
      setActivity("none");
      setWalking(false);
      lastActivityEnd.current = Date.now();
      nextGap.current = 3500 + Math.random() * 4000;
    };

    // The actual activity once the umbrella (if any) has been put away.
    const run = (act: IdleActivity) => {
      activityRef.current = act;
      setActivity(act);

      switch (act) {
        case "sleep":
          setMood("sleep");
          activityTimeout.current = setTimeout(finish, 6000 + Math.random() * 5000);
          break;

        case "lookAround":
          activityTimeout.current = setTimeout(finish, 3500);
          break;

        case "walk": {
          // Stroll out a bit and wander back.
          setWalking(true);
          const maxR = Math.min(260, window.innerWidth * 0.32);
          setPosX(Math.round(40 + Math.random() * maxR));
          setTimeout(() => { if (activityRef.current === "walk") setPosX(0); }, 2600);
          setTimeout(() => { if (activityRef.current === "walk") setWalking(false); }, 4200);
          activityTimeout.current = setTimeout(finish, 4600);
          break;
        }

        case "playLeaves": {
          // Shuffle into the leaf heap and kick it — the real scatter is
          // applied to the matter.js leaves through weatherState.disturb().
          setWalking(true);
          const kick = () => {
            const r = wrapperRef.current?.getBoundingClientRect();
            if (r) weatherState.disturb(r.left + r.width / 2, r.bottom - 6, 1);
          };
          [300, 850, 1400, 1950].forEach((d) =>
            setTimeout(() => { if (activityRef.current === "playLeaves") kick(); }, d)
          );
          setTimeout(() => { if (activityRef.current === "playLeaves") setWalking(false); }, 2300);
          activityTimeout.current = setTimeout(finish, 2800);
          break;
        }

        case "swim": {
          // Paddle out across the water and drift back (no props, just bob).
          setPosX(Math.min(window.innerWidth - 160, 300));
          setTimeout(() => { if (activityRef.current === "swim") setPosX(0); }, 4200);
          activityTimeout.current = setTimeout(finish, 7000);
          break;
        }

        default:
          activityTimeout.current = setTimeout(finish, 3500);
      }
    };

    // Begin an activity. In dark mode the buddy first folds the umbrella
    // away (≈420ms) before doing anything else.
    const start = (act: IdleActivity) => {
      const umbrellaOut =
        theme === "dark" && !inWaterRef.current && activityRef.current === "none";
      // Mark busy immediately so the poll/umbrella don't fight.
      activityRef.current = act;
      if (umbrellaOut) {
        setClosingForAction(true); // folds the umbrella away first
        activityTimeout.current = setTimeout(() => {
          setClosingForAction(false);
          run(act);
        }, 420);
      } else {
        run(act);
      }
    };

    // Expose start for the secret buddy() console command
    startActivityRef.current = start;

    // Poll every 1.5s — can't die
    const interval = setInterval(() => {
      if (activityRef.current !== "none") return;
      if (hidingRef.current) return;
      const elapsed = Date.now() - lastActivityEnd.current;
      if (elapsed < nextGap.current) return;
      // While floating, mostly just bob on the surface — only sometimes paddle.
      if (inWaterRef.current && Math.random() > 0.4) {
        lastActivityEnd.current = Date.now();
        nextGap.current = 3000 + Math.random() * 3000;
        return;
      }
      start(pickActivity());
    }, 1500);

    return () => {
      clearInterval(interval);
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
      // Reset so re-mount doesn't see stale "in-progress" activity
      activityRef.current = "none";
      setActivity("none");
      setWalking(false);
    };
  }, [phase, pickActivity, setMood, theme]);

  /* ---- Stop activity when message appears ---- */
  /* Activities and messages now COEXIST — buddy can talk while doing things.
     Only buddy-click and hiding stop activities (handled elsewhere). */

  /* ===========================================================
     FLOAT ON THE RISING WATER (dark mode)
     Reads the shared water surface every frame and lifts the
     buddy so it sits half-submerged at the surface. Crossing a
     threshold flips `inWater`, which switches the activity pool
     to water sports and folds the umbrella away.
     =========================================================== */
  useEffect(() => {
    if (phase !== "settled") return;
    const HALF = 20; // px of body kept under the surface
    const MAX_LIFT = 90;
    let raf = 0;

    const tick = () => {
      const el = wrapperRef.current;
      // Skip the layout read entirely on dry land (light mode / no flood).
      if (el && !hidingRef.current && (weatherState.storm || liftRef.current > 0)) {
        const rect = el.getBoundingClientRect();
        const naturalBottom = rect.bottom;
        const surface = weatherState.surfaceY;
        const target =
          weatherState.storm && surface < naturalBottom
            ? Math.min(MAX_LIFT, Math.max(0, naturalBottom - surface - HALF))
            : 0;
        liftRef.current += (target - liftRef.current) * 0.08;
        if (liftRef.current < 0.2) liftRef.current = 0;

        if (floatRef.current) {
          const bob = liftRef.current > 3 ? Math.sin(performance.now() / 620) * 3 : 0;
          const rot = liftRef.current > 3 ? Math.sin(performance.now() / 900) * 2 : 0;
          floatRef.current.style.transform =
            liftRef.current > 0.2
              ? `translateY(${-(liftRef.current + bob)}px) rotate(${rot}deg)`
              : "";
        }

        // Hysteresis so it doesn't flicker at the waterline
        if (!inWaterRef.current && liftRef.current > 10) {
          inWaterRef.current = true;
          setInWater(true);
          fire(waterTriggers); // "the page is flooding!"
        } else if (inWaterRef.current && liftRef.current < 3) {
          inWaterRef.current = false;
          setInWater(false);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, fire]);

  /* ---- Hide/peek: proximity (desktop only) ---- */
  useEffect(() => {
    if (phase !== "settled" || isTouch) return;
    const HIDE_DIST = 70;
    const UNHIDE_DIST = 160;

    const h = (e: MouseEvent) => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.7;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (!hidingRef.current && dist < HIDE_DIST) {
        hidingRef.current = true;
        setHiding(true);
        prePosX.current = posX;
        stopActivity();
        setWalking(true);
        setPosX(-20);
        fire(buddyHideTriggers);
        if (walkTimeout.current) clearTimeout(walkTimeout.current);
        walkTimeout.current = setTimeout(() => setWalking(false), 450);
        // Safety: auto-unhide if mouse leaves window or stops moving
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
          if (hidingRef.current) {
            hidingRef.current = false;
            setHiding(false);
            setWalking(true);
            setPosX(prePosX.current);
            walkTimeout.current = setTimeout(() => setWalking(false), 600);
          }
        }, 6000);
      } else if (hidingRef.current && dist > UNHIDE_DIST) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => {
          hidingRef.current = false;
          setHiding(false);
          setWalking(true);
          setPosX(prePosX.current);
          setTimeout(() => fire(buddySighTriggers), 500);
          walkTimeout.current = setTimeout(() => setWalking(false), 600);
        }, 600);
      }
    };

    document.addEventListener("mousemove", h, { passive: true });
    return () => {
      document.removeEventListener("mousemove", h);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [phase, posX, fire, isTouch, stopActivity]);

  /* ---- Init: fire greeting after entrance finishes ---- */
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    incrementVisit();
    const visits = getVisitCount();
    // Wait for fall + dizzy to finish before greeting (~2.4s)
    const t = setTimeout(() => {
      const special = getSpecialTrigger();
      if (special) { fire(special); return; }

      // Progression arc: visit-specific greetings
      if (visits >= 2) {
        const maxKey = Math.min(visits, 7) as keyof typeof progressionTriggers;
        const prog = progressionTriggers[maxKey];
        if (prog) {
          fire(prog);
          // After progression greeting, fire behavior memory on next tick
          setTimeout(() => {
            const strongest = getStrongestBehavior();
            if (strongest) {
              const memTrigs = behaviorMemoryTriggers[strongest];
              if (memTrigs) fire(memTrigs);
            }
          }, 5000);
          return;
        }
      }

      // First visit: time greeting
      fire(getTimeGreeting());
    }, 2600);
    return () => clearTimeout(t);
  }, [fire, getVisitCount, incrementVisit]);

  /* ---- Blink (idle + no activity) ---- */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const sched = () => {
      t = setTimeout(() => {
        const s = useBuddyStore.getState();
        if (s.mood === "idle" && !s.message && activityRef.current === "none") {
          setMood("blink");
          setTimeout(() => {
            if (useBuddyStore.getState().mood === "blink") setMood("idle");
          }, 150);
        }
        sched();
      }, 2500 + Math.random() * 3000);
    };
    sched();
    return () => clearTimeout(t);
  }, [setMood]);

  /* ---- Rare moments — fires with ~1% probability per idle cycle ---- */
  useEffect(() => {
    if (phase !== "settled") return;
    const iv = setInterval(() => {
      const s = useBuddyStore.getState();
      if (s.message) return;
      if (Math.random() > 0.01) return; // 1% chance per tick (every 8s = ~1.25% per minute)
      fire(rareTriggers);
    }, 8000);
    return () => clearInterval(iv);
  }, [phase, fire]);

  /* ---- Story page triggers ---- */
  useEffect(() => {
    const storyKey = pathname === "/stories/ai" ? "ai"
      : pathname === "/stories/journey" ? "journey"
      : null;
    if (!storyKey) return;
    const trigs = storyTriggers[storyKey];

    // Page enter — delay so it fires after the standard greeting
    const enterTimer = setTimeout(() => fire(trigs.enter), 3200);

    // Scroll milestone triggers (25 / 50 / 75 / end)
    const milestones = new Map([
      [25, trigs.scroll25],
      [50, trigs.scroll50],
      [75, trigs.scroll75],
      [95, trigs.end],
    ]);
    const fired = new Set<number>();
    const onScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      milestones.forEach((tList, threshold) => {
        if (pct >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          fire(tList);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(enterTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname, fire]);

  /* ---- Section observers ---- */
  useEffect(() => {
    const ids = Object.values(SECTION_IDS);
    const observers: IntersectionObserver[] = [];
    const triggered = new Set<string>();
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const ob = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            currentSectionRef.current = id;
            if (id === "contact") trackBehavior("contact");
            if (!triggered.has(id) && phaseRef.current === "settled") {
              triggered.add(id);
              const trigs = sectionEnterTriggers[id];
              if (trigs?.length) setTimeout(() => fire(trigs), 300);
            }
          }
        },
        { threshold: 0.3 }
      );
      ob.observe(el);
      observers.push(ob);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [fire]);

  /* ---- Hover detection on page elements (desktop only) ---- */
  useEffect(() => {
    if (isTouch) return;
    const h = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const now = Date.now();
      if (now - lastHoverFire.current < 12000) return;
      const pc = t.closest("article");
      if (pc?.querySelector('a[target="_blank"]')) {
        lastHoverFire.current = now; fire(hoverTriggers.project); return;
      }
      for (const [sel, key] of HOVER_SELECTORS) {
        if (t.closest(sel)) {
          lastHoverFire.current = now;
          const trigs = hoverTriggers[key];
          if (trigs) fire(trigs);
          return;
        }
      }
    };
    document.addEventListener("mouseover", h, { passive: true });
    return () => document.removeEventListener("mouseover", h);
  }, [fire, isTouch]);

  /* ---- Nav hover (desktop only) ---- */
  useEffect(() => {
    if (isTouch) return;
    let last = 0;
    const h = (e: MouseEvent) => {
      const nl = (e.target as HTMLElement).closest("nav a");
      if (!nl) return;
      const now = Date.now();
      if (now - last < 15000) return;
      last = now;
      const text = nl.textContent?.trim().toLowerCase() || "";
      const trigs = navHoverTriggers[text];
      if (trigs) fire(trigs);
    };
    document.addEventListener("mouseover", h, { passive: true });
    return () => document.removeEventListener("mouseover", h);
  }, [fire, isTouch]);

  /* ---- Idle text triggers ---- */
  useEffect(() => {
    let start = Date.now();
    let idx = 0;
    const reset = () => { start = Date.now(); };
    const iv = setInterval(() => {
      const el = (Date.now() - start) / 1000;
      if (idx < idleTriggers.length && el >= idleTriggers[idx].after) {
        fire(idleTriggers[idx].triggers);
        idx++;
      }
    }, 3000);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("keydown", reset, { passive: true });
    return () => {
      clearInterval(iv);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [fire]);

  /* ---- Cursor leave/return (desktop) ---- */
  useEffect(() => {
    if (isTouch) return;
    const leave = (e: MouseEvent) => {
      if (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        if (!cursorLeftTriggered.current) { cursorLeftTriggered.current = true; fire(cursorLeftTriggers); }
      }
    };
    const enter = () => {
      if (cursorLeftTriggered.current) { cursorLeftTriggered.current = false; fire(cursorReturnTriggers); }
    };
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => { document.removeEventListener("mouseleave", leave); document.removeEventListener("mouseenter", enter); };
  }, [fire, isTouch]);

  /* ---- Scroll ---- */
  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const now = Date.now();
        const dt = now - lastScrollTime.current;
        const dy = Math.abs(y - lastScrollY.current);
        intentDetector.current.addScroll(y, currentSectionRef.current);
        const intent = intentDetector.current.detect();
        if (intent && intentTriggers[intent]) fire(intentTriggers[intent]);
        if (dt > 0 && dy / dt > 5) fire(scrollFastTriggers);
        if (y < 50 && lastScrollY.current > 300) fire(scrollTopTriggers);
        if (y + window.innerHeight >= document.documentElement.scrollHeight - 100) fire(scrollBottomTriggers);
        const pct = (y / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        for (let i = 0; i < scrollMilestoneTriggers.length; i++) {
          const th = (i + 1) * 25;
          if (pct >= th && !scrollMilestones.current.has(th)) { scrollMilestones.current.add(th); fire(scrollMilestoneTriggers[i]); }
        }
        const dir = y > lastScrollY.current ? "down" : "up";
        if (dir !== lastScrollDir.current) {
          scrollDirChanges.current++;
          if (scrollDirChanges.current > 6) { fire(rapidScrollTriggers); scrollDirChanges.current = 0; }
        }
        lastScrollDir.current = dir;
        if (dt > 1000) scrollDirChanges.current = 0;
        lastScrollY.current = y;
        lastScrollTime.current = now;
        ticking = false;
      });
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, [fire]);

  /* ---- Theme ---- */
  useEffect(() => {
    if (prevThemeRef.current !== theme) { prevThemeRef.current = theme; const t = themeToggleTriggers[theme]; if (t) fire(t); }
  }, [theme, fire]);

  /* ---- Tab visibility ---- */
  useEffect(() => {
    const h = () => { if (document.visibilityState === "visible") fire(tabReturnTriggers); };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [fire]);

  /* ---- Copy ---- */
  useEffect(() => {
    const h = () => fire(copyTriggers);
    document.addEventListener("copy", h);
    return () => document.removeEventListener("copy", h);
  }, [fire]);

  /* ---- Konami ---- */
  useEffect(() => {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const h = (e: KeyboardEvent) => {
      konamiBuffer.current.push(e.key);
      if (konamiBuffer.current.length > seq.length) konamiBuffer.current.shift();
      if (konamiBuffer.current.join(",") === seq.join(",")) { fire(secretTrigger); konamiBuffer.current = []; }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [fire]);

  /* ---- Secret buddy(N) console command ---- */
  useEffect(() => {
    const CODES: Record<number, IdleActivity> = {
      1: "walk", 2: "lookAround", 3: "sleep", 4: "playLeaves", 5: "swim",
    };
    (window as unknown as Record<string, unknown>).buddy = (code?: number) => {
      if (code === undefined || code === 0) {
        console.table(Object.entries(CODES).map(([k, v]) => ({ code: k, animation: v })));
        return;
      }
      const act = CODES[code];
      if (!act) { console.log("Unknown code. Use buddy(0) for list."); return; }
      stopActivity();
      setTimeout(() => startActivityRef.current?.(act), 100);
      console.log(`▶ ${act}`);
    };
    return () => { delete (window as unknown as Record<string, unknown>).buddy; };
  }, [stopActivity]);

  /* ---- Global click ---- */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (link.hasAttribute("download") || href.includes("resume")) { trackBehavior("resume"); fire(clickTriggers.resume); return; }
      if (href.startsWith("mailto:")) { fire(clickTriggers.email); return; }
      if (href.includes("github.com")) { trackBehavior("github"); fire(clickTriggers.github); return; }
      if (href.includes("linkedin.com")) { trackBehavior("linkedin"); fire(clickTriggers.linkedin); return; }
      if (href.includes("spyll")) { trackBehavior("project"); fire(clickTriggers.projectSpyll); }
      else if (href.includes("maddycustom")) { trackBehavior("project"); fire(clickTriggers.projectMaddy); }
      else if (href.includes("blitzit")) { trackBehavior("project"); fire(clickTriggers.projectBlitzit); }
      else if (href.includes("avana")) { trackBehavior("project"); fire(clickTriggers.projectAvana); }
      else if (href.includes("dailicle")) { trackBehavior("project"); fire(clickTriggers.projectDailicle); }
    };
    document.addEventListener("click", h, { capture: true });
    return () => document.removeEventListener("click", h, { capture: true });
  }, [fire]);

  /* ---- Buddy click ---- */
  const handleBuddyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (hidingRef.current) return;
    stopActivity();
    if (isTouch && useBuddyStore.getState().message) { dismiss(); return; }
    fire(buddyClickTriggers);
  }, [fire, stopActivity, isTouch, dismiss]);

  /* ---- Mobile: tap outside to dismiss ---- */
  useEffect(() => {
    if (!isTouch) return;
    const h = (e: TouchEvent) => {
      if (!useBuddyStore.getState().message) return;
      const el = wrapperRef.current;
      if (el && !el.contains(e.target as Node)) dismiss();
    };
    document.addEventListener("touchstart", h, { passive: true });
    return () => document.removeEventListener("touchstart", h);
  }, [isTouch, dismiss]);

  /* ---- Derived classes ---- */
  const moodClass = styles[`mood${mood.charAt(0).toUpperCase()}${mood.slice(1)}` as keyof typeof styles] || "";
  const activityClassKey = activity !== "none"
    ? `act${activity.charAt(0).toUpperCase()}${activity.slice(1)}`
    : null;
  const activityClass = activityClassKey
    ? styles[activityClassKey as keyof typeof styles] || ""
    : "";

  const isFalling = phase === "falling";
  const isLanding = phase === "landing";
  const isDizzy = phase === "dizzy";
  const isOffscreen = phase === "offscreen";

  const wrapperStyle: React.CSSProperties = {
    right: `calc(var(--space-5) + ${posX}px)`,
    transition: walking
      ? "right 2s cubic-bezier(0.25, 0.1, 0.25, 1)"
      : "right 0.5s ease-out",
  };

  /* ---- Pixel prop inline style helper ---- */
  const propStyle = (shadow: string, pxSize: number): React.CSSProperties => ({
    width: pxSize, height: pxSize, boxShadow: shadow, position: "absolute" as const, top: 0, left: 0,
  });

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wrapper} ${hiding ? styles.hiding : ""}`}
      style={wrapperStyle}
      aria-live="polite"
    >
      {/* Chat bubble */}
      <AnimatePresence mode="wait">
        {message && !hiding && (
          <motion.div
            key={message}
            className={styles.bubble}
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
          >
            <p className={styles.bubbleText}>
              {message.split(/(\*[^*]+\*)/).map((part, i) =>
                part.startsWith("*") && part.endsWith("*")
                  ? <em key={i}>{part.slice(1, -1)}</em>
                  : part
              )}
            </p>
            <button
              className={styles.bubbleClose}
              onClick={(e) => { e.stopPropagation(); dismiss(); }}
              aria-label="Dismiss"
              type="button"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character + props — wrapped in a float layer that lifts on water */}
      <div ref={floatRef} className={styles.floatLayer}>
        <div className={`${moodClass} ${activityClass}`} style={{ position: "relative" }}>
          {/* Umbrella — dark-mode idle shelter only. Opens while idle, folds
              away before any activity and the moment the buddy floats into the
              water. Never appears in light mode. */}
          <AnimatePresence>
            {theme === "dark" &&
              !inWater &&
              !closingForAction &&
              activity === "none" &&
              phase === "settled" &&
              !hiding && (
                <motion.div
                  className={styles.umbrella}
                  aria-hidden
                  initial={{ opacity: 0, scaleX: 0.15, scaleY: 0.35, y: 6 }}
                  animate={{ opacity: 1, scaleX: 1, scaleY: 1, y: 0 }}
                  exit={{ opacity: 0, scaleX: 0.12, scaleY: 0.9, y: 2 }}
                  transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <div style={propStyle(PIXEL_UMBRELLA, PP)} />
                </motion.div>
              )}
          </AnimatePresence>

          <div
            className={`${styles.character} ${isOffscreen ? styles.offscreen : ""} ${walking ? styles.walking : ""} ${isFalling ? styles.falling : ""} ${isLanding ? styles.landing : ""} ${isDizzy ? styles.dizzyAnim : ""}`}
            onClick={handleBuddyClick}
            role="button"
            tabIndex={0}
            aria-label="Lucky's companion buddy"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!hidingRef.current) { stopActivity(); fire(buddyClickTriggers); } }
            }}
          >
            <div className={styles.pixelGrid} style={{ boxShadow: pixelShadow }} />
          </div>

          {/* ===== ACTIVITY ANIMATIONS (no props — only the umbrella) ===== */}

          {/* Sleep: zzz */}
          {activity === "sleep" && (
            <div className={styles.zzzContainer} aria-hidden>
              <span className={styles.zzz1}>z</span>
              <span className={styles.zzz2}>z</span>
              <span className={styles.zzz3}>z</span>
            </div>
          )}

          {/* walk / lookAround / playLeaves / swim — pure character animation */}
        </div>
      </div>
    </div>
  );
}

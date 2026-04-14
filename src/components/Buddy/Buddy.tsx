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
  navHoverTriggers,
  rareTriggers,
  behaviorMemoryTriggers,
  progressionTriggers,
  type BuddyMood,
} from "@/lib/buddy-triggers";
import { useThemeStore } from "@/store/useThemeStore";
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

// Crumpled paper ball (4×4)
const PIXEL_PAPER = pixelProp(
  [".XX.", "XXXX", "XXXX", ".XX."],
  PP,
  { X: FG }
);

// Paper airplane — folded paper plane pointing right (8×7 at 3px = 24×21px)
const PIXEL_AIRPLANE = pixelProp(
  [
    ".......X",
    "....XXXX",
    "..XXXXFX",
    "XXXXXFFX",
    "..XXXXFX",
    "...XXXXX",
    "....XXX.",
  ],
  PP,
  { X: FG, F: "var(--buddy-bubble-bg)" }
);

// Cup with straw (5×8 at 3px = 15×24px)
const PIXEL_CUP = pixelProp(
  [
    "....S",
    "....S",
    "GGGGS",
    "GWWWG",
    "GWWWG",
    "GWWWG",
    "GWWWG",
    ".GGG.",
  ],
  PP,
  { G: FG, W: "#5b9bd5", S: "#e87060" }
);

// Tall ladder (3×22 at 3px = 9×66px — extra height is free, buddy leaves mid-ladder)
const PIXEL_LADDER = pixelProp(
  [
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X", "XXX", "X.X",
    "X.X",
  ],
  3,
  { X: FG }
);

// Juggle balls (2×2 each)
const PIXEL_BALL_R = pixelProp(["XX", "XX"], PP, { X: "#e87060" });
const PIXEL_BALL_B = pixelProp(["XX", "XX"], PP, { X: "#60a8e8" });
const PIXEL_BALL_G = pixelProp(["XX", "XX"], PP, { X: "#70d860" });

// Skateboard (8×3 at 3px = 24×9px)
const PIXEL_SKATEBOARD = pixelProp(
  [
    ".XXXXXX.",
    "XXXXXXXX",
    ".O....O.",
  ],
  PP,
  { X: FG, O: "#e87060" }
);

/* -----------------------------------------------------------
   IDLE ACTIVITIES
   ----------------------------------------------------------- */
type IdleActivity =
  | "none"
  | "sleep"
  | "walk"
  | "paperToss"
  | "airplane"
  | "drink"
  | "ladder"
  | "lookAround"
  | "juggle"
  | "sitDown"
  | "skateboard";

const ACTIVITY_POOL: IdleActivity[] = [
  "sleep", "walk", "paperToss", "airplane",
  "drink", "ladder", "lookAround", "juggle", "sitDown",
];

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
  const [elevated, setElevated] = useState(false);
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

  // Keep activityRef synced
  useEffect(() => { activityRef.current = activity; }, [activity]);

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

  /* ---- Pick next activity (no repeats) ---- */
  const pickActivity = useCallback((): IdleActivity => {
    const pool = ACTIVITY_POOL.filter((a) => a !== lastPickedActivity.current);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    lastPickedActivity.current = pick;
    return pick;
  }, []);

  /* ---- Stop any running activity ---- */
  const stopActivity = useCallback(() => {
    if (activityTimeout.current) clearTimeout(activityTimeout.current);
    if (walkTimeout.current) clearTimeout(walkTimeout.current);
    activityRef.current = "none"; // immediate sync
    setActivity("none");
    setElevated(false);
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
      if (cur === "drink") {
        setMood("happy");
        setTimeout(() => {
          if (useBuddyStore.getState().mood === "happy") setMood("idle");
        }, 500);
      }
      activityRef.current = "none";
      setActivity("none");
      setWalking(false);
      setElevated(false);
      lastActivityEnd.current = Date.now();
      nextGap.current = 2500 + Math.random() * 3500;
    };

    const start = (act: IdleActivity) => {
      activityRef.current = act;
      setActivity(act);

      switch (act) {
        case "sleep":
          setMood("sleep");
          activityTimeout.current = setTimeout(finish, 5000 + Math.random() * 5000);
          break;

        case "walk": {
          setWalking(true);
          const maxR = Math.min(220, window.innerWidth * 0.3);
          setPosX(Math.round(Math.random() * maxR));
          activityTimeout.current = setTimeout(finish, 2000 + Math.random() * 1500);
          break;
        }

        case "paperToss":
          activityTimeout.current = setTimeout(finish, 2500);
          break;

        case "airplane":
          activityTimeout.current = setTimeout(finish, 4200);
          break;

        case "drink":
          activityTimeout.current = setTimeout(finish, 3000);
          break;

        case "ladder": {
          // CSS-driven climb: .actLadder animates translateY on the wrapper div
          // Buddy bobs while climbing (walkBob), then walks at height, climbs down
          setTimeout(() => { if (activityRef.current === "ladder") setWalking(true); }, 400);
          setTimeout(() => {
            if (activityRef.current === "ladder") {
              setPosX(Math.round(Math.random() * Math.min(60, window.innerWidth * 0.08)));
            }
          }, 2200);
          setTimeout(() => { if (activityRef.current === "ladder") setPosX(0); }, 3800);
          setTimeout(() => { if (activityRef.current === "ladder") setWalking(false); }, 5000);
          activityTimeout.current = setTimeout(finish, 5500);
          break;
        }

        case "lookAround":
          activityTimeout.current = setTimeout(finish, 3000);
          break;

        case "juggle":
          activityTimeout.current = setTimeout(finish, 3500);
          break;

        case "sitDown":
          activityTimeout.current = setTimeout(finish, 4000);
          break;

        case "skateboard": {
          // Rare: skate across to the other side and back
          setWalking(true);
          const skateTarget = Math.min(window.innerWidth - 100, 600);
          setPosX(skateTarget);
          // Pause at the other side, then come back
          setTimeout(() => { if (activityRef.current === "skateboard") setPosX(0); }, 3500);
          setTimeout(() => { if (activityRef.current === "skateboard") setWalking(false); }, 5200);
          activityTimeout.current = setTimeout(finish, 5800);
          break;
        }

        default:
          activityTimeout.current = setTimeout(finish, 3000);
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
      // ~5% chance of rare skateboard instead of normal activity
      const picked = Math.random() < 0.05 ? "skateboard" as IdleActivity : pickActivity();
      start(picked);
    }, 1500);

    return () => {
      clearInterval(interval);
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
      // Reset so re-mount doesn't see stale "in-progress" activity
      activityRef.current = "none";
      setActivity("none");
      setWalking(false);
      setElevated(false);
    };
  }, [phase, pickActivity, setMood]);

  /* ---- Stop activity when message appears ---- */
  /* Activities and messages now COEXIST — buddy can talk while doing things.
     Only buddy-click and hiding stop activities (handled elsewhere). */

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
      1: "airplane", 2: "skateboard", 3: "ladder", 4: "paperToss",
      5: "juggle", 6: "drink", 7: "sleep", 8: "walk",
      9: "lookAround", 10: "sitDown",
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
      className={`${styles.wrapper} ${hiding ? styles.hiding : ""} ${elevated ? styles.elevated : ""}`}
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

      {/* Character + props */}
      <div className={`${moodClass} ${activityClass}`} style={{ position: "relative" }}>
        {/* Ladder climber wrapper — isolates climb translateY from the ladder prop */}
        <div className={activity === "ladder" ? styles.ladderClimber : undefined}>
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
        </div>

        {/* ===== ACTIVITY PROPS (pixel art) ===== */}

        {/* Sleep: zzz */}
        {activity === "sleep" && (
          <div className={styles.zzzContainer} aria-hidden>
            <span className={styles.zzz1}>z</span>
            <span className={styles.zzz2}>z</span>
            <span className={styles.zzz3}>z</span>
          </div>
        )}

        {/* Paper toss: pixel paper ball with gravity arc */}
        {activity === "paperToss" && (
          <div className={styles.paper} aria-hidden>
            <div style={propStyle(PIXEL_PAPER, PP)} />
          </div>
        )}

        {/* Airplane: pixel dart that flies left */}
        {activity === "airplane" && (
          <div className={styles.airplane} aria-hidden>
            <div style={propStyle(PIXEL_AIRPLANE, PP)} />
          </div>
        )}

        {/* Airplane hand: buddy holds plane before throwing */}
        {activity === "airplane" && (
          <div className={styles.airplaneHand} aria-hidden />
        )}

        {/* Drink: pixel cup with straw */}
        {activity === "drink" && (
          <div className={styles.cup} aria-hidden>
            <div style={propStyle(PIXEL_CUP, PP)} />
          </div>
        )}

        {/* Ladder: outside climber wrapper so it stays rooted in place */}
        {activity === "ladder" && (
          <div className={styles.ladder} aria-hidden>
            <div style={propStyle(PIXEL_LADDER, 3)} />
          </div>
        )}

        {/* Juggle: three pixel balls (rendered BEFORE character via z-index) */}
        {activity === "juggle" && (
          <div className={styles.juggleBalls} aria-hidden>
            <div className={styles.ball1}><div style={propStyle(PIXEL_BALL_R, PP)} /></div>
            <div className={styles.ball2}><div style={propStyle(PIXEL_BALL_B, PP)} /></div>
            <div className={styles.ball3}><div style={propStyle(PIXEL_BALL_G, PP)} /></div>
          </div>
        )}

        {/* Sit down: pixel cushion shadow */}
        {activity === "sitDown" && (
          <div className={styles.sitCushion} aria-hidden />
        )}

        {/* Skateboard: pixel board under buddy */}
        {activity === "skateboard" && (
          <div className={styles.skateboard} aria-hidden>
            <div style={propStyle(PIXEL_SKATEBOARD, PP)} />
          </div>
        )}

        {/* Look around: no prop, just character animation */}
      </div>
    </div>
  );
}

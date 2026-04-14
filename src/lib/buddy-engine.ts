/* ============================================================
   BUDDY ENGINE — Decision engine with global coordination,
   priority gating, message queue, and weighted randomness.

   Architecture:
   - Global cooldown (8s) prevents trigger spam
   - Priority gate: low-priority can't interrupt high
   - Queue (max 3): preserves important triggers
   - Silence rule (25%): randomly skips low-priority
   - Weighted pick: priority-as-weight + recent-avoidance
   - Per-trigger cooldowns + once-only tracking
   ============================================================ */

import { create } from "zustand";
import type { BuddyMood, BuddyTrigger } from "./buddy-triggers";

/* -----------------------------------------------------------
   CONSTANTS
   ----------------------------------------------------------- */
const GLOBAL_COOLDOWN = 8000;
const SILENCE_PROBABILITY = 0.25;
const SILENCE_THRESHOLD = 5;
const MAX_RECENT = 15;
const QUEUE_MAX = 3;

/* -----------------------------------------------------------
   WEIGHTED PICK — filters cooldowns/once, avoids recent
   ----------------------------------------------------------- */
function pickWeighted(
  triggers: BuddyTrigger[],
  recentIds: string[],
  firedOnce: Set<string>,
  cooldowns: Map<string, number>
): BuddyTrigger | null {
  if (triggers.length === 0) return null;

  const now = Date.now();

  // Remove ineligible: once-fired or on cooldown
  let pool = triggers.filter((t) => {
    if (t.once && firedOnce.has(t.id)) return false;
    const cd = cooldowns.get(t.id) || 0;
    if (now < cd) return false;
    return true;
  });
  if (pool.length === 0) return null;

  // Prefer non-recent
  const recentSet = new Set(recentIds);
  let candidates = pool.filter((t) => !recentSet.has(t.id));
  if (candidates.length === 0) candidates = pool;

  if (candidates.length === 1) return candidates[0];

  const total = candidates.reduce((sum, t) => sum + t.priority, 0);
  let rand = Math.random() * total;
  for (const t of candidates) {
    if ((rand -= t.priority) <= 0) return t;
  }
  return candidates[candidates.length - 1];
}

/* -----------------------------------------------------------
   STATE
   ----------------------------------------------------------- */
interface BuddyState {
  mood: BuddyMood;
  message: string | null;
  isVisible: boolean;
  firedOnce: Set<string>;
  cooldowns: Map<string, number>;
  queue: BuddyTrigger[];
  recentIds: string[];
  lastGlobalFire: number;
  currentPriority: number;
  messageCount: number;
}

interface BuddyActions {
  fire: (input: BuddyTrigger | BuddyTrigger[]) => void;
  dismiss: () => void;
  setMood: (mood: BuddyMood) => void;
  getVisitCount: () => number;
  incrementVisit: () => void;
}

let dismissTimer: ReturnType<typeof setTimeout> | null = null;

export const useBuddyStore = create<BuddyState & BuddyActions>((set, get) => {
  /* ---- Internal: display a trigger immediately ---- */
  const displayTrigger = (trigger: BuddyTrigger) => {
    const state = get();
    const now = Date.now();
    if (dismissTimer) clearTimeout(dismissTimer);

    const newFired = new Set(state.firedOnce);
    if (trigger.once) newFired.add(trigger.id);

    const newCooldowns = new Map(state.cooldowns);
    if (trigger.cooldown > 0) {
      newCooldowns.set(trigger.id, now + trigger.cooldown * 1000);
    }

    set({
      mood: trigger.mood,
      message: trigger.message,
      firedOnce: newFired,
      cooldowns: newCooldowns,
      recentIds: [...state.recentIds, trigger.id].slice(-MAX_RECENT),
      lastGlobalFire: now,
      currentPriority: trigger.priority,
      messageCount: state.messageCount + 1,
    });

    // Auto-dismiss: ~60ms/char, 2.5-6s
    const duration = Math.min(Math.max(trigger.message.length * 60, 2500), 6000);
    dismissTimer = setTimeout(() => {
      const current = get();
      if (current.queue.length > 0) {
        const sorted = [...current.queue].sort((a, b) => b.priority - a.priority);
        const [next, ...rest] = sorted;
        set({ queue: rest });
        // Brief pause before showing queued message
        setTimeout(() => displayTrigger(next), 400);
      } else {
        set({ message: null, mood: "idle" });
      }
    }, duration);
  };

  return {
    mood: "idle",
    message: null,
    isVisible: true,
    firedOnce: new Set(),
    cooldowns: new Map(),
    queue: [],
    recentIds: [],
    lastGlobalFire: 0,
    currentPriority: 0,
    messageCount: 0,

    fire: (input: BuddyTrigger | BuddyTrigger[]) => {
      const state = get();
      const now = Date.now();

      // Resolve trigger
      let trigger: BuddyTrigger | null;
      if (Array.isArray(input)) {
        trigger = pickWeighted(input, state.recentIds, state.firedOnce, state.cooldowns);
      } else {
        trigger = input;
        // Per-trigger checks for single triggers
        if (trigger.once && state.firedOnce.has(trigger.id)) return;
        const cd = state.cooldowns.get(trigger.id) || 0;
        if (now < cd) return;
      }
      if (!trigger) return;

      // Silence gate: randomly skip low-priority
      if (trigger.priority < SILENCE_THRESHOLD && Math.random() < SILENCE_PROBABILITY) return;

      // If a message is currently showing
      if (state.message) {
        // Global cooldown: reject if on cooldown and equal/lower priority
        if (now - state.lastGlobalFire < GLOBAL_COOLDOWN && trigger.priority <= state.currentPriority) return;

        if (trigger.priority > state.currentPriority) {
          // High priority interrupts
          displayTrigger(trigger);
        } else if (state.queue.length < QUEUE_MAX) {
          // Queue it
          set({ queue: [...state.queue, trigger] });
        }
        return;
      }

      // No message showing — global cooldown blocks low-priority
      if (now - state.lastGlobalFire < GLOBAL_COOLDOWN && trigger.priority < SILENCE_THRESHOLD) return;

      displayTrigger(trigger);
    },

    dismiss: () => {
      if (dismissTimer) clearTimeout(dismissTimer);
      const state = get();
      if (state.queue.length > 0) {
        const sorted = [...state.queue].sort((a, b) => b.priority - a.priority);
        const [next, ...rest] = sorted;
        set({ queue: rest, message: null, mood: "idle" });
        setTimeout(() => displayTrigger(next), 400);
      } else {
        set({ message: null, mood: "idle" });
      }
    },

    setMood: (mood: BuddyMood) => set({ mood }),

    getVisitCount: () => {
      if (typeof window === "undefined") return 1;
      try {
        return parseInt(localStorage.getItem("buddy-visits") || "0", 10);
      } catch {
        return 0;
      }
    },

    incrementVisit: () => {
      if (typeof window === "undefined") return;
      try {
        const c = parseInt(localStorage.getItem("buddy-visits") || "0", 10);
        localStorage.setItem("buddy-visits", String(c + 1));
      } catch {
        // silent
      }
    },
  };
});

/* -----------------------------------------------------------
   BEHAVIOR MEMORY HELPERS
   Tracks what the user interacted with per session.
   On next visit, Buddy can reference past behavior.
   ----------------------------------------------------------- */
const MEMORY_KEY = "buddy-behavior";

export type BehaviorEvent = "github" | "resume" | "project" | "contact" | "linkedin";

function readMemory(): Partial<Record<BehaviorEvent, number>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(MEMORY_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeMemory(data: Partial<Record<BehaviorEvent, number>>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(data));
  } catch {
    // silent
  }
}

/** Call whenever user interacts with a tracked element */
export function trackBehavior(event: BehaviorEvent) {
  const mem = readMemory();
  mem[event] = (mem[event] ?? 0) + 1;
  writeMemory(mem);
}

/** Returns the most-visited behavior from previous sessions, if count ≥ 2 */
export function getStrongestBehavior(): BehaviorEvent | null {
  const mem = readMemory();
  let best: BehaviorEvent | null = null;
  let bestCount = 1; // must have happened more than once
  for (const [key, count] of Object.entries(mem) as [BehaviorEvent, number][]) {
    if (count > bestCount) { best = key; bestCount = count; }
  }
  return best;
}

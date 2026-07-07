/* ============================================================
   MOTION PRIMITIVES — the physics of the device.

   Everything on this device has mass. Controls don't ease
   politely; they throw, snap, and settle. These presets keep
   that feel consistent (and heavy) across every component.

   All are framer-motion `transition` objects.
   ============================================================ */

import type { Transition } from "framer-motion";

/** A heavy control settling home — the mode switch, big buttons. */
export const springHeavy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 30,
  mass: 1.1,
};

/** A crisp detent — jog steps, LED flicks. Fast, minimal overshoot. */
export const springSnap: Transition = {
  type: "spring",
  stiffness: 900,
  damping: 42,
  mass: 0.6,
};

/** A soft panel/screen transition — content re-skinning on lens change. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 34,
  mass: 1,
};

/** A momentary press-down. */
export const pressTween: Transition = {
  type: "tween",
  duration: 0.09,
  ease: [0.4, 0, 0.2, 1],
};

/** True if the visitor prefers reduced motion (client-only). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

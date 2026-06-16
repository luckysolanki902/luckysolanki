/* ============================================================
   weatherState — tiny mutable bridge between the Weather canvas
   and the Buddy. Updated every animation frame by Weather; read
   in a rAF loop by Buddy so the buddy can float on the rising
   water without forcing React re-renders.
   ============================================================ */

export const weatherState = {
  /** Water surface Y in viewport pixels. Infinity when no water is in view. */
  surfaceY: Infinity,
  /** True while the thunderstorm (dark) weather is active. */
  storm: false,
};

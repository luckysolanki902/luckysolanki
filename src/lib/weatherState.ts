/* ============================================================
   weatherState — tiny mutable bridge between the Weather canvas
   and the Buddy. Updated every animation frame by Weather; read
   in a rAF loop by Buddy so the buddy can float on the rising
   water without forcing React re-renders.
   ============================================================ */

export const weatherState = {
  /** Water surface Y in viewport pixels. Infinity when no water is in view. */
  surfaceY: Infinity,
  /**
   * Top Y (viewport px) of whatever is collecting at the page bottom — the
   * water in dark mode or the leaf heap in light mode. Infinity when not in
   * view. Footer letters use this to float (water) or get buried (leaves).
   */
  fillY: Infinity,
  /** True while the thunderstorm (dark) weather is active. */
  storm: false,
  /**
   * Disturb the simulation at a viewport point — splashes water (dark) or
   * scatters the leaf heap (light). Registered by the Weather component;
   * no-op until then. The Buddy calls this to play with leaves / make a splash.
   */
  disturb: (_x: number, _y: number, _power: number): void => {},
};

/* ============================================================
   weatherState, tiny mutable bridge between the Weather canvas
   and companion/footer effects, without forcing React re-renders.
   Winter snow is solid: legacy water/umbrella signals stay inactive.
   ============================================================ */

export const weatherState = {
  /** Reading sections quiet the decorative snowfall. */
  atmosphere: 1,
  /** Water surface Y in viewport pixels. Infinity when no water is in view. */
  surfaceY: Infinity,
  /**
   * Top Y (viewport px) of whatever is collecting at the page bottom, the
   * snowbank in dark mode or the leaf heap in light mode. Infinity when not in
   * view. Footer letters use this to float (water) or get buried (leaves).
   */
  fillY: Infinity,
  /** Legacy storm signal; false for both snow and autumn weather. */
  storm: false,
  /**
   * Disturb the leaf heap at a viewport point in light mode. Registered by the Weather component;
   * no-op until then and during snowfall.
   */
  disturb: (() => {}) as (x: number, y: number, power: number) => void,
};

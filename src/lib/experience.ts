/** Completed years since December 2022, using UTC to keep the anniversary consistent. */
export function getExperienceYears(now = new Date()): number {
  return Math.max(0, now.getUTCFullYear() - 2022 - (now.getUTCMonth() < 11 ? 1 : 0));
}

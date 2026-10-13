export type Period = "dawn" | "day" | "sunset" | "night";
export type Destination = "work" | "projects" | "about" | "contact" | "skills";
export const WORLD = {
  width: 1920,
  height: 1080,
  floor: 873,
  minX: 100,
  maxX: 1820,
  speed: 310,
  gravity: 1900,
  jumpSpeed: 820,
};
export const destinations: Record<
  Destination,
  { x: number; y: number; label: string }
> = {
  work: { x: 1450, y: 590, label: "My work experience" },
  skills: { x: 1130, y: 690, label: "My skills" },
  projects: { x: 850, y: 740, label: "Other projects" },
  about: { x: 320, y: 600, label: "About me" },
  contact: { x: 1790, y: 713, label: "Say hello" },
};
export function periodAtHour(hour: number): Period {
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
}
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
export function stepToward(x: number, target: number, deltaSeconds: number) {
  const step = WORLD.speed * clamp(deltaSeconds, 0, 0.05);
  return clamp(
    x + Math.sign(target - x) * Math.min(Math.abs(target - x), step),
    WORLD.minX,
    WORLD.maxX,
  );
}
export function cameraOffset(
  playerX: number,
  scale: number,
  viewportWidth: number,
) {
  const worldWidth = WORLD.width * scale;
  if (worldWidth <= viewportWidth) return (viewportWidth - worldWidth) / 2;
  return clamp(
    viewportWidth * 0.5 - playerX * scale,
    viewportWidth - worldWidth,
    0,
  );
}
export function destinationFromHash(hash: string): Destination | null {
  const value = hash.replace(/^#/, "").split("/")[0];
  return Object.hasOwn(destinations, value) ? (value as Destination) : null;
}

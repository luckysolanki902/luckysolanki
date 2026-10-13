import { test, expect } from "@playwright/test";
import {
  cameraOffset,
  destinationFromHash,
  periodAtHour,
  stepToward,
  WORLD,
} from "../../src/components/GamePortfolio/world";
import {
  atlasPosition,
  newCharacter,
  releaseJump,
  requestJump,
  spriteFrame,
  stepCharacter,
  SPRITES,
  WALK_FRAME_DISTANCE,
} from "../../src/components/GamePortfolio/character";

test("time boundaries and movement stay deterministic", () => {
  expect([0, 4, 5, 8, 9, 16, 17, 19, 20, 23].map(periodAtHour)).toEqual([
    "night",
    "night",
    "dawn",
    "dawn",
    "day",
    "day",
    "sunset",
    "sunset",
    "night",
    "night",
  ]);
  expect(stepToward(100, 105, 1)).toBe(105);
  expect(stepToward(101, -1000, 1)).toBe(WORLD.minX);
  expect(stepToward(1818, 3000, 1)).toBe(WORLD.maxX);
  expect(cameraOffset(1800, 1, 390)).toBe(390 - WORLD.width);
  expect(destinationFromHash("#contact")).toBe("contact");
  expect(destinationFromHash("#toString")).toBeNull();
});

test("39 atlas frames have bounded, deterministic cell positions", () => {
  expect(SPRITES.count).toBe(39);
  expect(SPRITES.columns * SPRITES.rows).toBeGreaterThanOrEqual(SPRITES.count);
  expect(atlasPosition(0)).toBe("0% 0%");
  expect(atlasPosition(7)).toBe("100% 0%");
  expect(atlasPosition(8)).toBe("0% 25%");
  expect(atlasPosition(38)).toBe("85.71428571428571% 100%");
  const m = newCharacter();
  for (const kind of [
    "idle",
    "walk",
    "takeoff",
    "rise",
    "apex",
    "fall",
    "land",
    "turn",
  ] as const) {
    m.animation = kind;
    for (let i = 0; i < 15; i++) {
      m.animationTime = i * 0.04;
      const frame = spriteFrame(m);
      expect(frame).toBeGreaterThanOrEqual(0);
      expect(frame).toBeLessThan(SPRITES.count);
    }
  }
});

test("moving jump, instant air steering, landing recovery, and jump buffering", () => {
  const m = newCharacter(650);
  for (let i = 0; i < 36; i++) stepCharacter(m, 1, 1 / 120);
  expect(m.vx).toBeGreaterThan(200);
  expect(m.animation).toBe("walk");
  const beforeJump = m.x;

  requestJump(m);
  stepCharacter(m, 1, 1 / 120);
  expect(m.grounded).toBe(false);
  expect(m.vy).toBeGreaterThan(0);
  expect(m.z).toBeGreaterThan(0);
  expect(m.animation).toBe("takeoff");
  expect(m.x).toBeGreaterThan(beforeJump);

  for (let i = 0; i < 24; i++) stepCharacter(m, 1, 1 / 120);
  const beforeReverse = m.x;
  releaseJump(m);
  for (let i = 0; i < 38; i++) stepCharacter(m, -1, 1 / 120);
  expect(m.facing).toBe(-1);
  expect(m.vx).toBeLessThan(-200);
  for (let i = 0; i < 12; i++) stepCharacter(m, -1, 1 / 120);
  expect(m.x).toBeLessThan(beforeReverse);
  for (let i = 0; i < 160; i++) stepCharacter(m, 0, 1 / 120);
  expect(m.grounded).toBe(true);
  expect(m.z).toBe(0);
  expect(m.vy).toBe(0);

  const buffered = newCharacter();
  buffered.grounded = false;
  buffered.z = 5;
  buffered.vy = -540;
  requestJump(buffered);
  for (let i = 0; i < 4 && !buffered.grounded; i++)
    stepCharacter(buffered, 1, 1 / 120);
  expect(buffered.grounded).toBe(true);
  stepCharacter(buffered, 1, 1 / 120);
  expect(buffered.grounded).toBe(false);
  expect(buffered.vy).toBeGreaterThan(0);
});

test("walk cadence is relaxed without slowing ground movement", () => {
  const m = newCharacter(300);
  for (let i = 0; i < 30; i++) stepCharacter(m, 1, 1 / 120);
  const start = m.x;
  for (let i = 0; i < 120; i++) stepCharacter(m, 1, 1 / 120);
  expect(m.x - start).toBeCloseTo(WORLD.speed, 1);
  expect(WORLD.speed / (WALK_FRAME_DISTANCE * 12)).toBeLessThan(1.1);
});
test("field notes and article routes share the game journal", async ({
  page,
}) => {
  await page.goto("/blog");
  await expect(
    page.getByRole("heading", { name: "Field notes." }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /01 Engineering Building the backend/ })
    .click();
  await expect(
    page.getByRole("link", { name: "← Back to the room" }),
  ).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("cold loading never reveals an unpositioned character", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/game/**", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const actor = page.getByLabel("Lucky’s playable character");
  await expect(page.locator("#playable-room")).toHaveAttribute("data-ready", "false");
  await expect(actor).toBeHidden();
  await page.keyboard.press("Space");
  release();
  await expect(page.locator("#playable-room")).toHaveAttribute("data-ready", "true");
  await expect(actor).toBeVisible();
  await expect(actor).toHaveAttribute("data-animation", "idle");
  await expect(actor).toHaveCSS("transform", "matrix(1, 0, 0, 1, 1024, 611)");
});

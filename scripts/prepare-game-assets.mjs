import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Mechanical asset preparation: preserve artwork, compress backgrounds and
// separate alpha-connected sprites into consistently anchored animation cells.
const root = path.resolve("public/game");
await mkdir(`${root}/sprites`, { recursive: true });
const source = process.env.GAME_IMAGE_SOURCE;
const rooms = {
  day: "exec-08e5fb6d-261d-44c0-87f8-c8bd6b67c447.png",
  night: "exec-febba58d-f1e3-4b6b-9203-0f13931e4504.png",
  sunset: "exec-fd746b0b-26aa-4855-a455-b7a6dcce8a73.png",
  dawn: "exec-1716d554-ef54-4740-b28c-5adb99cb90fb.png",
};
if (source)
  for (const [name, file] of Object.entries(rooms)) {
    await sharp(path.join(source, file))
      .resize(1920, 1080, { fit: "fill" })
      .webp({ quality: 88 })
      .toFile(`${root}/room-${name}.webp`);
  }
const { data, info } = await sharp(`${root}/source/boy-sheet.png`)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height } = info;
const visited = new Uint8Array(width * height);
const components = [];
for (let i = 0; i < visited.length; i++) {
  if (visited[i] || data[i * 4 + 3] < 80) continue;
  const queue = [i];
  visited[i] = 1;
  let left = width,
    top = height,
    right = 0,
    bottom = 0;
  for (let j = 0; j < queue.length; j++) {
    const p = queue[j],
      x = p % width,
      y = Math.floor(p / width);
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
    for (const n of [
      x > 0 ? p - 1 : -1,
      x < width - 1 ? p + 1 : -1,
      p - width,
      p + width,
    ]) {
      if (
        n >= 0 &&
        n < visited.length &&
        !visited[n] &&
        data[n * 4 + 3] >= 80
      ) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }
  if (queue.length > 4000)
    components.push({
      left,
      top,
      width: right - left + 1,
      height: bottom - top + 1,
      pixels: queue.length,
    });
}
if (components.length !== 12)
  throw new Error(
    `Expected 12 sprites, found ${components.length}; inspect alpha sheet before proceeding.`,
  );
components.sort(
  (a, b) =>
    Math.round(a.top / (height / 3)) - Math.round(b.top / (height / 3)) ||
    a.left - b.left,
);
const scale = 250 / Math.max(...components.slice(0, 8).map((c) => c.height));
for (const [index, c] of components.entries()) {
  const w = Math.round(c.width * scale),
    h = Math.round(c.height * scale);
  const sprite = await sharp(`${root}/source/boy-sheet.png`)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .resize(w, h, { kernel: "nearest" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: 192, height: 272, channels: 4, background: "#00000000" },
  })
    .composite([
      { input: sprite, left: Math.round((192 - w) / 2), top: 262 - h },
    ])
    .png()
    .toFile(`${root}/sprites/boy-${index}.png`);
}
await writeFile(
  `${root}/sprites/manifest.json`,
  JSON.stringify(
    {
      width: 192,
      height: 272,
      baseline: 262,
      idle: [0, 1, 2, 3],
      walk: [4, 5, 6, 7],
      crouch: 8,
      rise: 9,
      fall: 10,
      interact: 11,
      sourceBounds: components,
    },
    null,
    2,
  ),
);
console.log(
  "Prepared four room backgrounds and 12 anchored transparent animation frames.",
);

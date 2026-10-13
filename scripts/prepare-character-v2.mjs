import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";

// Crop and register original imagegen drawings. No synthetic tween drawings,
// stretching, composited limbs, or cross-faded silhouettes are generated here.
const root = "public/game";
const cell = { width: 192, height: 272, baseline: 262 };
await mkdir(`${root}/sprites/v2`, { recursive: true });

async function components(file, rows, expected) {
  const {
    data,
    info: { width, height },
  } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const seen = new Uint8Array(width * height),
    result = [];
  for (let p = 0; p < seen.length; p++) {
    if (seen[p] || data[p * 4 + 3] < 80) continue;
    const queue = [p];
    seen[p] = 1;
    let left = width,
      top = height,
      right = 0,
      bottom = 0;
    for (let n = 0; n < queue.length; n++) {
      const index = queue[n],
        x = index % width,
        y = Math.floor(index / width);
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      for (const next of [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        index - width,
        index + width,
      ]) {
        if (
          next >= 0 &&
          next < seen.length &&
          !seen[next] &&
          data[next * 4 + 3] >= 80
        ) {
          seen[next] = 1;
          queue.push(next);
        }
      }
    }
    if (queue.length > 3000)
      result.push({
        left,
        top,
        width: right - left + 1,
        height: bottom - top + 1,
      });
  }
  if (result.length !== expected)
    throw new Error(
      `${file}: ${result.length} components, expected ${expected}`,
    );
  result.sort(
    (a, b) =>
      Math.floor(((a.top + a.height / 2) / height) * rows) -
        Math.floor(((b.top + b.height / 2) / height) * rows) || a.left - b.left,
  );
  return result;
}

const sources = {
  idle: { file: `${root}/source/v2/idle-interact.png`, rows: 3, count: 11 },
  walk: { file: `${root}/source/v2/walk.png`, rows: 3, count: 12 },
  jump: { file: `${root}/source/v2/jump.png`, rows: 4, count: 16 },
};
for (const source of Object.values(sources))
  source.bounds = await components(source.file, source.rows, source.count);
// Each sheet uses one scale, based on an upright pose. Preserve knee bends.
sources.idle.scale = 250 / sources.idle.bounds[0].height;
sources.walk.scale =
  250 / Math.max(...sources.walk.bounds.map((b) => b.height));
sources.jump.scale = 250 / sources.jump.bounds[15].height;

const entries = [
  ...Array.from({ length: 5 }, (_, i) => ["idle", i, "idle"]),
  ...Array.from({ length: 12 }, (_, i) => ["walk", i, "walk"]),
  ...Array.from({ length: 16 }, (_, i) => [
    "jump",
    i,
    i < 2
      ? "takeoff"
      : i < 6
        ? "rise"
        : i < 8
          ? "apex"
          : i < 12
            ? "fall"
            : "land",
  ]),
  ...Array.from({ length: 3 }, (_, i) => ["idle", i + 5, "turn"]),
  ...Array.from({ length: 3 }, (_, i) => ["idle", i + 8, "interact"]),
];
const cells = [];
for (const [index, [key, pose, state]] of entries.entries()) {
  const source = sources[key],
    bounds = source.bounds[pose];
  const width = Math.round(bounds.width * source.scale),
    height = Math.round(bounds.height * source.scale);
  const cropped = await sharp(source.file)
    .extract(bounds)
    .resize(width, height, { kernel: "nearest" })
    .ensureAlpha().raw().toBuffer();
  // Generated transparent sheets contain low-alpha colour in empty pixels.
  // Sprite cells need binary coverage: an opaque painted pixel or empty space.
  // This also prevents premultiplied-alpha fringes when the atlas is sampled.
  for (let p = 0; p < cropped.length; p += 4) {
    if (cropped[p + 3] < 128) cropped.fill(0, p, p + 4);
    else cropped[p + 3] = 255;
  }
  const drawing = await sharp(cropped, { raw: { width, height, channels: 4 } }).png().toBuffer();
  // Airborne poses share a head anchor; tucked knees then rise naturally rather
  // than forcing the head downward to keep nonexistent foot contact aligned.
  const airborne = ["rise", "apex", "fall"].includes(state);
  const top = airborne ? 12 : cell.baseline - height;
  if (width > cell.width || top < 0 || top + height > cell.height)
    throw new Error(
      `Frame ${index} does not fit: ${width}x${height}, top ${top}`,
    );
  const buffer = await sharp({
    create: {
      ...cell,
      width: cell.width,
      height: cell.height,
      channels: 4,
      background: "#00000000",
    },
  })
    .composite([
      { input: drawing, left: Math.round((cell.width - width) / 2), top },
    ])
    .png()
    .toBuffer();
  await writeFile(
    `${root}/sprites/v2/${String(index).padStart(2, "0")}.png`,
    buffer,
  );
  cells.push({
    input: buffer,
    left: (index % 8) * cell.width,
    top: Math.floor(index / 8) * cell.height,
  });
}
await sharp({
  create: {
    width: cell.width * 8,
    height: cell.height * 5,
    channels: 4,
    background: "#00000000",
  },
})
  .composite(cells)
  .png()
  .toFile(`${root}/sprites/boy-v2.png`);
await writeFile(
  `${root}/sprites/v2/manifest.json`,
  JSON.stringify(
    {
      ...cell,
      columns: 8,
      rows: 5,
      count: entries.length,
      frames: entries.map(([source, pose, state], frame) => ({
        frame,
        source,
        pose,
        state,
      })),
      sources,
    },
    null,
    2,
  ),
);
console.log(
  `Packed ${entries.length} original drawings into a single 8×5 lossless atlas.`,
);

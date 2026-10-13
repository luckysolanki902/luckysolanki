# Ship it — asset provenance and production prompts

Generated with the built-in image_gen tool, October 9, 2026. Local originals are
in source/. Reference identity: public/game/sprites/v2/00.png. Production
registration and transparent-gutter extraction: scripts/prepare-arcade-assets.mjs.
No original files were overwritten. Audio is original local synthesis from
scripts/prepare-arcade-audio.py, not ElevenLabs recordings.

## Coding sheet prompt specification
Production 2D pixel-art sprite sheet; exact reference boy with black hair, teal
shirt, charcoal trousers and white-soled black sneakers. 4 columns × 3 rows,
transparent background, identical scale, generous margins, right-facing seated
boy on a low wheeled stool, silver laptop on thighs. Eight coding frames (typing,
blink, breathing, concentrated lean), then four firing frames (anticipation,
keypress, cyan screen/code spark, recovery). Stable contact point, no text,
gridlines, scene or crop. Crisp limited-palette pixel art.

## Prop sheet prompt specification
Original cozy platformer props, not copied Nintendo sprites. Transparent 4×4
sheet, straight-on side-scroller perspective, green/teal/terracotta/gold palette.
Row 1: brick, cracked brick, laptop bonus cube, spent cube.
Row 2: green pipe, separate lip, closed plant bud, open yellow flower.
Row 3: left-lean plant, right-lean plant, retracting plant, brick fragments.
Row 4: silver laptop, mint-accent headphones, amber star token chip, mint sparkle.
No labels, backgrounds or shadows; all sprites fully separated.

## Reaction sheet prompt specification
Exact same reference boy and clothes. Transparent 4×3 regular sheet. Four
seated startled/recoil/tipping/falling poses, four dazed-sitting/hand-to-head/
kneeling/standing recovery poses, four seated calm/look-up/fist-celebration/
return-to-coding poses. Keep the laptop, body and stool fully in bounds, original
pixel art with consistent scale; non-graphic comedic defeat, no particles or text.

## Registration
192×192 cells, center x=96, floor y=184. Coding and seated reaction poses share
145px registered height before posture changes. Adaptive transparent gutters
avoid cutting across leaning poses. Plant frames include a matching rim in the
source; runtime overlays those on the pipe shaft. Effects use native particles
in addition to the generated sparkle/debris artwork.

## Recurring manager (2026-10-09)
Generated with the built-in image-generation tool. Original: `source/manager.png`; runtime atlas: `manager.png`, 4 × 2 cells of 128 px, prepared by `scripts/prepare-manager.mjs`. Frames: idle, wind-up, throw, follow-through, blink, hit, defeated, retreat.

Prompt:
> Create a production pixel-art sprite sheet on transparent background, 4 columns by 2 rows, eight evenly spaced square cells. Same tiny cute funny office manager enemy in every cell: round mint-green little goblin, oversized round glasses, mustard shirt and tiny purple tie, carrying a cream clipboard. Charming original 16-bit game sprite, crisp pixels, dark outline, 3/4 facing left. Fixed size and feet baseline, generous transparent gutters, no text, no labels, no scenery. Row1 frames 1-4: idle slight bounce, wind up holding paper, throwing task paper with extended arm, follow-through. Row2 frames 5-8: idle blink, startled hit with glasses askew, squashed dazed, cheerful retreat. Full body visible in every cell. Each figure occupies about 65 percent of cell, consistent identity and scale. This is a small enemy for a coding arcade, legible at 56px.

# The room

A playable, touch-first 2D portfolio for Lucky Solanki. Built into the existing Next.js application, with no game engine or external runtime service.

## Run

```sh
npm ci
npm run dev
npm run test:game
npm run build
```

## Behaviour

- Tap/click the floor to walk. Tap an object to walk to it and reveal a section.
- Desktop: arrow keys or A/D walk, Up / W jumps, Down / S enters the pipe, E approaches the nearest object, Escape returns to the room.
- Touch navigation stays visible on phones; desktop/tablet navigation is in the header. Direct links and reduced motion do not require traversal.
- The desk reveals a paper notebook: concise work entries, projects, and links to field notes.
- The bookshelf reveals an open book; the envelope reveals a letter. Existing detailed work stories and résumé links remain available.
- Local-time lighting: dawn 05:00–08:59, day 09:00–16:59, sunset 17:00–19:59, night 20:00–04:59. This is a designed day cycle, not a location-based sunrise calculation. The room follows local time automatically; the manual settings panel was removed.
- Reduced motion follows the OS. It skips walks/camera transitions and ambient particles. Interaction sounds start enabled, activate after a browser gesture, and persist in localStorage. The original Web Audio tone remains until ElevenLabs downloads are available; see audio-generation.md.
- Deep links: `/#work`, `/#projects`, `/#about`, `/#contact`. The site retains a no-JavaScript fallback with work, résumé and contact links.

## Asset design

Production art was created first with the built-in imagegen tool. The approved room was the reference; generated images contain no baked-in interface or avatar. Real HTML controls and the transparent animated character sit above the room.

| Asset | Purpose |
| --- | --- |
| `public/game/room-dawn.webp` | Soft peach/periwinkle morning window, gentle room light |
| `public/game/room-day.webp` | Blue sky, bright window and warm daylight |
| `public/game/room-sunset.webp` | Peach/lavender sky, low amber sunlight |
| `public/game/room-night.webp` | Moon, stars, illuminated city windows, indoor lamps |
| `public/game/source/boy-sheet.png` | Original transparent twelve-frame character sheet |
| `public/game/sprites/boy-0.png` … `boy-11.png` | Individually cropped, consistently anchored frames |
| `public/game/sprites/manifest.json` | Animation mapping and extraction bounds |

The room files are approximately 160–220 KB each. The monitor uses the existing approved `board-clean.webp` product screenshot. No private task data from the user’s screenshots was copied into the page.

`scripts/prepare-game-assets.mjs` mechanically extracts connected alpha components, normalizes their scale, and aligns their feet. It does not repaint the generated images. With no environment variable it rebuilds the sprites from the retained source. `GAME_IMAGE_SOURCE` can point to the original generation directory to recompress room art as well; generation filenames are recorded in the script.

### Generation briefs

- Room: retain the approved orthographic pixel-art room, remove all UI and characters, leave the upper-left wall clear. Low bookshelf left, tall window centre, two-monitor desk right, envelope on side table. Warm daytime light, consistent geometry.
- Time variants: edit only lighting and the window view. Preserve camera and furniture positions. Dawn uses pale periwinkle/peach; sunset uses peach/lavender and low amber light; night uses navy sky, moon, stars, city lights and warm lamps.
- Boy: black tousled hair, dark teal shirt, charcoal trousers, black/white sneakers. Four idle frames, four walk poses, crouch, rise, fall and reaching interaction. Side-view, genuine transparency, consistent proportions.

These assets were generated, not traced from Swordigo. The character is an original stylized avatar, not a photographic likeness.

## Implementation

- `GamePortfolio.tsx`: navigation state machine, animation loop, preferences, accessible HTML sections.
- `world.ts`: scene coordinates, time boundaries, motion and camera helpers.
- `character.ts`: fixed-step physics and distance-driven sprite animation.
- `GamePortfolio.module.css`: room layers, responsive UI, physical book/letter treatments, reduced motion.
- `tests/game/portfolio.spec.ts`: navigation, motion, time boundaries, preferences, deep links, clipboard and phone/tablet coverage.

The old global buddy and weather overlays are no longer mounted. This work changes the local site; it does not deploy it.

## Character revision and notebook pages

The active character atlas is `public/game/sprites/boy-v2.png`: 39 original drawings, packed into 192×272 cells in an 8×5 grid. `scripts/prepare-character-v2.mjs` rebuilds it from three retained source sheets in `public/game/source/v2`. Transparent fringes are thresholded before nearest-neighbour scaling; the atlas is lossless PNG and frame backgrounds never transition or crossfade.

Walking covers 300 world pixels per complete 12-frame cycle (~0.97 seconds at 310 px/s). Physics runs at 120 Hz. Animation follows travelled distance, with a separate immediate jump input, air steering, early-release hops, buffered landing jumps, and landing recovery.

Work now uses two concise entries in a desk notebook. Projects occupy the adjacent notebook tab. `/blog` is a real field-notes index; `/work/*` and `/stories/*` share the paper journal frame, pixel typography, opening animation, and scroll progress. Reduced-motion preferences suppress decorative motion.

The room is now the entrance to a scrollable selected-work section. Navigation buttons open destinations immediately; walking remains available through scene objects. Initial rendering waits for decoded scene/sprite assets and positions the camera and character before revealing the world.

## Portfolio-first layout — October 9

The homepage now uses `Portfolio.tsx` and `Portfolio.module.css`: an ordinary
scrolling page with a compact optional room, selectable technology icons,
inline expandable experience, projects, notes and contact. Blitzit precedes
MaddyCustom in Work; neither appears in Projects. `GamePortfolio compact`
keeps the original sprite physics, local-time room and independent audio settings
but bypasses section overlays. Keyboard input is scoped to the focused room.
Room footer links scroll to page sections. Skills use evidence-based qualitative
labels, not invented percentage scores. Stack SVGs are local Simple Icons assets
sourced from the project's GitHub repository; no third-party icon requests occur
while browsing. The legacy fullscreen component path remains available in source
but is not used by the homepage. Tests now cover the scrolling page and retained
character/loading behavior.

## Ship it arcade

The full design and asset plan is in `/plan.md`. The room now has two breakable
bricks, a laptop bonus block, and a static always-open pipe. `RoomAdventure.tsx`
connects the room's existing character to these props. `TaskArcade` is a portal
with an isolated simulation in `engine.ts`, non-blocking control tips, touch controls,
score persistence and a visible exit. Tasks spawn in three lanes, become overdue
platforms on landing, and release small coins into Done after a separate parent-completion
hit. Coins fall to the same floor and award 25 points on contact. All rewards are fictional; there is no Blitzit API connection.

New sprites: `public/game/arcade/frames`, atlas `boy.png`, metadata `manifest.json`.
Generation specifications/provenance: `public/game/arcade/ART-NOTES.md`.
Preview/audition page: `/game/arcade/preview.html`.
BGM now defaults on and unlocks with the first pointer/keyboard gesture; explicit
saved preferences remain respected. Pausing or leaving the tab silences music.

The recurring manager has a separate generated eight-frame atlas and telegraphs mid-screen task throws. Three hits dismiss it for 100 points. Active lanes rotate in shuffled bags; Done remains clear. Room pipe collision is part of the fixed character physics, with keyboard entry restricted to its rim and pointer entry available directly.

## Arcade balance

A/D or arrows move; W/Up jumps, S/Down fast-falls, Space shoots. Touch uses the on-screen controls. Each task column holds at most seven cards including incoming tasks. Spawns favor emptier columns. Overdue cards beyond two per column raise shared backlog pressure; clearing a task removes five pressure points. At 100% the run ends. Consecutive clears in different columns within 12 seconds earn up to a 3× completion bonus.

The recurring manager has 6–9 hit points, a brief hit cooldown, and favors emptier columns for task throws. Its red deadline attack locks the player’s position with a 1.4-second warning and can be dodged, including in Done. Defeating the manager cancels its pending attack. Unsupported stacks retain their 0.8-second escape window.

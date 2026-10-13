# Room audio — ElevenLabs generation log

Generated in the user's ElevenLabs account on October 8–9, 2026. Music was generated with Music v2, sound cues with Sound Effects. The outputs have not been installed: Music MP3 export explicitly opens “Upgrade to download music — Downloading music requires a paid subscription.” No subscription was purchased. Sound Effects export did not return a file. Do not bypass download restrictions or label the existing browser tone as an ElevenLabs asset.

## Original music (two 60-second variations each)

- **Windowlight**: quiet room loop; 76 BPM, D major/add9, sparse felt piano, thumb piano, triangle bass, airy pad, D–A–E motif. No drums or vocals. [Variation 1](https://elevenlabs.io/app/music/project/BlhlnR8GEo89cAfLyeJA?selectedSongId=4BmReRLv1joufeyi3yOZ), [variation 2](https://elevenlabs.io/app/music/project/FWhhJlih6eZFC0BAM2Z3?selectedSongId=5J1WaIPZyBGd6tbUXtAw).
- **Little Systems, Big Adventure**: restrained handheld-RPG exploration loop; 112 BPM, original D–A–E motif, square lead, triangle bass, sampled plucks, tiny snare. Inspired by the era and instrumentation, no copied game melody. [Variation 1](https://elevenlabs.io/app/music/project/DDgLPs2l8RPoWBwleKJr?selectedSongId=r78dThbnSPtEe8CdFJRo), [variation 2](https://elevenlabs.io/app/music/project/yOjwdRPf8680puiqHHHM?selectedSongId=Cjv8fJFkaOLImp0qitZd).

## Sound cues (four variations each)

- [Discovery](https://elevenlabs.io/app/sound-effects/history?id=29ImvotjGtWQxhy029Ca): wooden thumb-piano pluck with two small warm glass notes, D–A–E, short felt-muted tail.
- [Footstep](https://elevenlabs.io/app/sound-effects/history?id=OQETaJ983OGGWmTzd7Hh): single soft sneaker contact on wood, muted heel and toe tick, dry and quiet.
- [Page turn](https://elevenlabs.io/app/sound-effects/history?id=2C4pTepyHRdLbjCqudCG): short dry paper flutter with a tiny wooden click.
- [Jump](https://elevenlabs.io/app/sound-effects/history?id=79Tz7dx1sumvSYXETPCl): rounded marimba pluck bending upward, short brushed-air lift.

## Integration still required after export

Audition variations; trim leading silence; gently normalize cue peaks; verify loop seams and crossfade music. Download locally into `public/game/audio`. Keep music off and SFX on by default. Use separate persisted booleans in `lucky-audio` (no expiry), respect browser audio activation, pause when hidden, resume only if opted in, crossfade room/exploration on navigation. Browser storage can be cleared by the user or browser; persistence cannot be guaranteed literally forever.

Current site retains its existing short Web Audio interaction tone, now on by default and persisted. The music preference is initialized to false; no nonfunctional music toggle is shown while exported tracks are unavailable.

## Functional local audio (October 9)

The portfolio now uses an original Web Audio composition in `audio.ts` while
ElevenLabs exports remain unavailable behind the paid download gate. These are
synthesized locally, not ElevenLabs recordings. The room has a sparse 76 BPM
motif; opening a section changes to a 112 BPM adventure variation. Discovery,
footstep, takeoff and landing effects are separate from music. Sound defaults on,
music defaults off, with independent `lucky-audio` localStorage preferences.
Playback unlocks on the first user gesture, pauses in hidden tabs and cleans up
on unmount. Storage persists until the visitor clears site data. The controls
are in the room footer on desktop and mobile.

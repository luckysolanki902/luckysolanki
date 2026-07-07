/* ============================================================
   SOUND ENGINE — synthesized mechanical feedback.

   Every "click," "detent," and "throw" is generated at runtime
   with the Web Audio API — zero audio assets, zero network cost.
   Opt-in and OFF by default (a chassis LED toggles it), so we
   never ambush a visitor with sound.

   Design: short, dry, physical transients. A detent is a filtered
   noise burst; a switch throw stacks two transients; a button is
   a soft square blip. Nothing musical — this is hardware.
   ============================================================ */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* -----------------------------------------------------------
   Enabled state (persisted) — drives the SOUND LED + gating.
   ----------------------------------------------------------- */
interface SoundStore {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (v: boolean) => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      enabled: false,
      toggle: () => set((s) => ({ enabled: !s.enabled })),
      setEnabled: (enabled) => set({ enabled }),
    }),
    { name: "portfolio-sound", storage: createJSONStorage(() => localStorage) }
  )
);

/* -----------------------------------------------------------
   Lazy AudioContext — created on first sound after user gesture
   (browsers block audio before interaction).
   ----------------------------------------------------------- */
let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function gate(): AudioContext | null {
  if (!useSoundStore.getState().enabled) return null;
  if (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    // Motion-averse users tend to be sensory-averse; stay silent.
    return null;
  }
  return ac();
}

/* -----------------------------------------------------------
   Primitives
   ----------------------------------------------------------- */

/** A dry filtered-noise transient — the core "tick" of a detent. */
function transient(
  c: AudioContext,
  {
    freq = 2200,
    q = 6,
    decay = 0.03,
    gain = 0.14,
    type = "bandpass" as BiquadFilterType,
    delay = 0,
  } = {}
) {
  const t = c.currentTime + delay;
  const bufferSize = Math.floor(c.sampleRate * (decay + 0.01));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;

  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);

  src.connect(filter).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + decay + 0.02);
}

/** A soft pitched blip — for button presses. */
function blip(
  c: AudioContext,
  { freq = 320, decay = 0.05, gain = 0.08, delay = 0 } = {}
) {
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + decay);
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + decay + 0.02);
}

/* -----------------------------------------------------------
   Public sounds
   ----------------------------------------------------------- */

/** A single crisp detent — jog steps, hovers, small ticks. */
export function playDetent() {
  const c = gate();
  if (c) transient(c, { freq: 2600, q: 8, decay: 0.022, gain: 0.1 });
}

/** A heavier two-part "chunk" — the mode switch throwing home. */
export function playSwitch() {
  const c = gate();
  if (!c) return;
  transient(c, { freq: 1400, q: 4, decay: 0.04, gain: 0.16 });
  transient(c, { freq: 900, q: 3, decay: 0.06, gain: 0.12, delay: 0.045 });
}

/** A button going down. */
export function playPress() {
  const c = gate();
  if (c) blip(c, { freq: 300, decay: 0.045, gain: 0.09 });
}

/** A button coming back up. */
export function playRelease() {
  const c = gate();
  if (c) blip(c, { freq: 460, decay: 0.03, gain: 0.06 });
}

/** A tiny toggle tick — LEDs, sound switch itself. */
export function playToggle() {
  const c = ac(); // bypass gate so the SOUND-on click is audible
  if (!c) return;
  transient(c, { freq: 3000, q: 10, decay: 0.02, gain: 0.09 });
}

/** The power-on swell — a short warming hum under the boot. */
export function playPowerOn() {
  const c = gate();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(70, t);
  osc.frequency.exponentialRampToValueAtTime(160, t + 0.5);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.05, t + 0.12);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.75);
}

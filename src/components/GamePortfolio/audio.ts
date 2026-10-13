/** Original, locally synthesized score. No network requests or sampled melodies. */
export type SoundEffect = "discover" | "step" | "jump" | "land";
export class RoomAudio {
  sound = true;
  music = true;
  arcade = false;
  paused = false;
  private buffers = new Map<string, AudioBuffer>();
  private loading = false;
  private voices = 0;
  exploring = false;
  private context: AudioContext | null = null;
  private musicBus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private next = 0;
  private beat = 0;
  private unlocked = false;
  private disposed = false;

  unlock = () => {
    if (this.disposed || (document.hidden || !document.hasFocus())) return;
    try {
      this.context ??= new AudioContext();
      if (!this.musicBus) {
        this.musicBus = this.context.createGain();
        this.musicBus.gain.value = 0;
        this.musicBus.connect(this.context.destination);
      }
      if (!this.loading) {
        this.loading = true;
        for (const name of ["brick","bonus","pickup","rustle","pipe","shoot","subtask","complete","overdue","jump","level","pause","restart","game-over"]) {
          void fetch(`/game/arcade/audio/${name}.wav`).then(r => r.arrayBuffer()).then(b => this.context?.decodeAudioData(b)).then(b => { if (b) this.buffers.set(name,b); }).catch(() => {});
        }
      }
      this.unlocked = true;
      void this.context.resume().then(() => this.sync()).catch(() => {});
    } catch { /* Audio is optional on unsupported browsers. */ }
  };

  private note(midi: number, at: number, duration: number, volume: number,
    type: OscillatorType, music = false, bend = 0) {
    const ctx = this.context;
    if (!ctx || ctx.state !== "running") return;
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, at);
    if (bend) oscillator.frequency.exponentialRampToValueAtTime(frequency * bend, at + duration);
    envelope.gain.setValueAtTime(0, at);
    envelope.gain.linearRampToValueAtTime(volume, at + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    oscillator.connect(envelope);
    envelope.connect(music ? this.musicBus! : ctx.destination);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.02);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }

  effect = (kind: SoundEffect = "discover") => {
    if (!this.sound || (document.hidden || !document.hasFocus()) || !this.context || this.context.state !== "running") return;
    const now = this.context.currentTime;
    if (kind === "step") this.note(37, now, 0.065, 0.018, "sine", false, 0.55);
    else if (kind === "land") this.note(43, now, 0.12, 0.026, "sine", false, 0.45);
    else if (kind === "jump") this.note(67, now, 0.16, 0.022, "triangle", false, 1.5);
    else [74, 81, 88].forEach((pitch, i) => this.note(pitch, now + i * 0.055, 0.24, 0.025, "sine"));
  };

  configure = (values: Partial<Pick<RoomAudio, "sound" | "music" | "arcade" | "paused">>) => {
    Object.assign(this, values);
    this.sync();
  };

  cue = (name: string) => {
    const ctx = this.context, buffer = this.buffers.get(name);
    if (!this.sound || (document.hidden || !document.hasFocus()) || !ctx || ctx.state !== "running") return;
    if (!buffer) { this.effect("discover"); return; }
    if (this.voices >= 10 && name !== "game-over") return;
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer; gain.gain.value = name === "shoot" ? 0.35 : 0.7;
    source.connect(gain); gain.connect(ctx.destination); source.start(); this.voices++;
    source.onended = () => { source.disconnect(); gain.disconnect(); this.voices--; };
  };

  sync = () => {
    const ctx = this.context;
    if (!ctx || !this.musicBus) return;
    const audible = this.music && !this.paused && !(document.hidden || !document.hasFocus()) && this.unlocked;
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setTargetAtTime(audible ? 0.65 : 0, ctx.currentTime, 0.12);
    if (!audible) {
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
      return;
    }
    if (this.timer) return;
    this.next = ctx.currentTime + 0.08;
    const schedule = () => {
      if (ctx.state !== "running") return;
      // A quiet D-add9 room motif becomes a quicker, original adventure variation.
      while (this.next < ctx.currentTime + 0.15) {
        const tick = this.beat % 32;
        const roots = [50, 47, 43, 45];
        const root = roots[Math.floor(tick / 8)];
        const melody = (this.exploring || this.arcade)
          ? [74, 78, 81, 85, 83, 81, 78, 76, 74, 81, 78, 86, 85, 81, 76, 78]
          : [74, 0, 81, 0, 76, 0, 0, 78, 0, 0, 81, 0, 78, 0, 76, 0];
        const pitch = melody[tick % 16];
        if (pitch) this.note(pitch, this.next, (this.exploring || this.arcade) ? 0.22 : 0.85, 0.026, "triangle", true);
        if (tick % 4 === 0) this.note(root, this.next, 1.15, 0.04, "sine", true);
        if (tick % 8 === 0) [root + 12, root + 19, root + 26].forEach(p => this.note(p, this.next, 1.8, 0.009, "sine", true));
        if ((this.exploring || this.arcade) && tick % 2 === 1) this.note(root + 24, this.next, 0.09, 0.008, "square", true);
        this.next += 60 / ((this.exploring || this.arcade) ? 112 : 76) / 2;
        this.beat++;
      }
    };
    schedule();
    this.timer = setInterval(schedule, 50);
  };

  visibility = () => {
    this.sync();
    if ((document.hidden || !document.hasFocus())) void this.context?.suspend().catch(() => {});
    else if (this.unlocked) void this.context?.resume().then(this.sync).catch(() => {});
  };

  dispose() {
    this.disposed = true;
    if (this.timer) clearInterval(this.timer);
    void this.context?.close().catch(() => {});
  }
}

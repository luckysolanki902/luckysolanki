/* ============================================================
   BUDDY INTENT — Behavior pattern detection layer.
   Turns raw scroll/timing signals into user-intent labels.

   Detects:
   - "focused-reading": slow scroll + same section 5s+
   - "recruiter-scan":  60%+ page traversed in <12s
   - "deep-dive":       30s+ in a single section
   - "comparing":       4+ rapid section changes in 20s
   ============================================================ */

export type BuddyIntent =
  | "focused-reading"
  | "recruiter-scan"
  | "deep-dive"
  | "comparing";

interface ScrollSample {
  t: number;
  y: number;
  section: string | null;
}

const WINDOW = 20000; // keep last 20s of samples

export class IntentDetector {
  private samples: ScrollSample[] = [];
  private sectionEntry = new Map<string, number>();
  private lastSection: string | null = null;
  private firedIntents = new Set<string>();
  private lastDetect = 0;
  private cooldown = 25000; // 25s between intent detections

  addScroll(y: number, section: string | null) {
    const now = Date.now();
    this.samples.push({ t: now, y, section });

    // Prune old
    const cutoff = now - WINDOW;
    this.samples = this.samples.filter((s) => s.t > cutoff);

    // Track section entry time
    if (section && section !== this.lastSection) {
      this.sectionEntry.set(section, now);
      this.lastSection = section;
    }
  }

  detect(): BuddyIntent | null {
    if (typeof document === "undefined") return null;
    const now = Date.now();
    if (now - this.lastDetect < this.cooldown) return null;
    if (this.samples.length < 4) return null;

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = last.t - first.t;
    const dy = Math.abs(last.y - first.y);
    const pageH = document.documentElement.scrollHeight - window.innerHeight;

    // ── Recruiter scan: >60% of page in <12s ──
    if (
      pageH > 0 &&
      dt > 2000 &&
      dt < 12000 &&
      dy / pageH > 0.6 &&
      !this.firedIntents.has("recruiter-scan")
    ) {
      this.firedIntents.add("recruiter-scan");
      this.lastDetect = now;
      return "recruiter-scan";
    }

    // ── Deep dive: 30s+ in same section ──
    if (this.lastSection) {
      const entry = this.sectionEntry.get(this.lastSection);
      const key = `deep-${this.lastSection}`;
      if (entry && now - entry > 30000 && !this.firedIntents.has(key)) {
        this.firedIntents.add(key);
        this.lastDetect = now;
        return "deep-dive";
      }
    }

    // ── Focused reading: slow scroll (5-120px/s) + stable section 5s+ ──
    if (dt > 5000 && this.samples.length >= 6) {
      const speed = dy / (dt / 1000);
      const sections = new Set(this.samples.map((s) => s.section).filter(Boolean));
      const key = `focused-${this.lastSection}`;
      if (speed > 5 && speed < 120 && sections.size <= 2 && !this.firedIntents.has(key)) {
        this.firedIntents.add(key);
        this.lastDetect = now;
        return "focused-reading";
      }
    }

    // ── Comparing: 4+ section changes in window ──
    let changes = 0;
    for (let i = 1; i < this.samples.length; i++) {
      if (
        this.samples[i].section &&
        this.samples[i].section !== this.samples[i - 1].section
      ) {
        changes++;
      }
    }
    if (changes >= 4 && !this.firedIntents.has("comparing")) {
      this.firedIntents.add("comparing");
      this.lastDetect = now;
      return "comparing";
    }

    return null;
  }
}

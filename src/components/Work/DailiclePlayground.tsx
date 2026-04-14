/* ============================================================
   DailiclePlayground — Daily essay pipeline visualizer.
   Two tabs:
   1. Morning Pipeline — the 5:30 AM automated flow
   2. Today's Essay   — typewriter preview + audio waveform
   Aesthetic: literary, calm, newspaper-press feel.
   ============================================================ */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./DailiclePlayground.module.css";

/* ── Types ────────────────────────────────────────────────── */

type FlowId = "pipeline" | "essay";

interface PipelineStep {
  service: string;
  action: string;
  detail: string;
  duration: string;
}

/* ── Data ─────────────────────────────────────────────────── */

const PIPELINE_STEPS: PipelineStep[] = [
  {
    service: "Cron Trigger",
    action: "5:30 AM IST — Render fires daily job",
    detail: "run_daily_article.py",
    duration: "0s",
  },
  {
    service: "topic_history_service",
    action: "Fetching all past topics from MongoDB…",
    detail: "142 previous essays loaded → building exclusion prompt",
    duration: "1.2s",
  },
  {
    service: "llm_service",
    action: "Generating essay with GPT-5.1 + web search",
    detail: "Topic: \"Why Your Best Ideas Come in the Shower\" — 5,847 words",
    duration: "48.3s",
  },
  {
    service: "storage_service",
    action: "Saving to MongoDB",
    detail: "articles collection + topic_history updated",
    duration: "0.3s",
  },
  {
    service: "audio_service",
    action: "Generating TTS narration → S3 → CloudFront",
    detail: "OpenAI TTS (nova voice) — 22m 14s audio → s3://dailicle-audio/",
    duration: "34.1s",
  },
  {
    service: "notion_service",
    action: "Creating Notion page with full article",
    detail: "Page created in Dailicle workspace → synced",
    duration: "2.8s",
  },
  {
    service: "email_service",
    action: "Sending morning email via Gmail SMTP",
    detail: "\"Your daily essay is ready\" → subscribers",
    duration: "1.1s",
  },
];

const ESSAY_LINES = [
  "Why Your Best Ideas Come in the Shower",
  "",
  "There's a moment, somewhere between the shampoo and the conditioner,",
  "when the world's most stubborn problems suddenly solve themselves.",
  "",
  "Archimedes had his bathtub. Newton had his apple tree. You have",
  "a $40 showerhead and a half-empty bottle of Old Spice.",
  "",
  "This isn't coincidence. It's neuroscience.",
  "",
  "When your brain shifts from focused mode to diffuse mode — when",
  "you stop trying to force a solution — your default mode network",
  "lights up like a Christmas tree. This is the same network active",
  "during daydreaming, walking, and yes, showering.",
  "",
  "The prefrontal cortex, that overachieving hall monitor of your",
  "brain, finally takes a break. And in that gap, your subconscious",
  "starts connecting dots that your conscious mind was too busy to see.",
];

const FLOW_LABELS: Record<FlowId, string> = {
  pipeline: "Morning Pipeline",
  essay: "Today's Essay",
};

/* ── Component ───────────────────────────────────────────── */

export function DailiclePlayground() {
  const [activeFlow, setActiveFlow] = useState<FlowId>("pipeline");

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <span className={styles.title}>How Dailicle works</span>
        <div className={styles.tabs}>
          {(["pipeline", "essay"] as FlowId[]).map((id) => (
            <button
              key={id}
              className={`${styles.tab} ${activeFlow === id ? styles.tabActive : ""}`}
              onClick={() => setActiveFlow(id)}
            >
              {FLOW_LABELS[id]}
            </button>
          ))}
        </div>
      </div>

      {activeFlow === "pipeline" ? <PipelineFlow /> : <EssayFlow />}
    </div>
  );
}

/* ── Pipeline Flow (5:30 AM automation) ──────────────────── */

function PipelineFlow() {
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRevealed(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (revealed >= PIPELINE_STEPS.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 700);
    return () => clearTimeout(t);
  }, [revealed]);

  const replay = () => {
    setRevealed(0);
    setDone(false);
  };

  return (
    <div className={styles.pipelineArea}>
      {/* Clock badge */}
      <div className={styles.clockBadge}>
        <span className={styles.clockDot} />
        <span>5:30 AM IST — Daily pipeline</span>
      </div>

      {/* Steps */}
      <div className={styles.pipelineSteps}>
        {PIPELINE_STEPS.map((step, i) => {
          const visible = i < revealed;
          return (
            <div
              key={i}
              className={`${styles.pipelineStep} ${visible ? styles.pipelineStepVisible : ""}`}
            >
              <div className={styles.stepIndex}>{i + 1}</div>
              <div className={styles.stepBody}>
                <div className={styles.stepTop}>
                  <span className={styles.stepService}>{step.service}</span>
                  <span className={styles.stepDuration}>{step.duration}</span>
                </div>
                <span className={styles.stepAction}>{step.action}</span>
                <span className={styles.stepDetail}>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {done && (
        <div className={styles.pipelineSummary}>
          <span>Pipeline complete — total: 87.8s</span>
          <span className={styles.summaryLight}>
            Next.js revalidates at 9:00 AM IST → article goes live
          </span>
          <button className={styles.replayBtn} onClick={replay}>
            Replay
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Essay Flow (typewriter preview + audio) ─────────────── */

function EssayFlow() {
  const [lines, setLines] = useState(0);
  const [audioActive, setAudioActive] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLines(0);
    setAudioActive(false);
  }, []);

  useEffect(() => {
    if (lines >= ESSAY_LINES.length) {
      const t = setTimeout(() => setAudioActive(true), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLines((l) => l + 1), 180);
    return () => clearTimeout(t);
  }, [lines]);

  useEffect(() => {
    const el = textRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const progress = Math.round((lines / ESSAY_LINES.length) * 100);

  return (
    <div className={styles.essayArea}>
      {/* Reading progress */}
      <div className={styles.progressRow}>
        <span className={styles.progressLabel}>
          {progress < 100 ? "Writing…" : "5,847 words · 23 min read"}
        </span>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Essay text */}
      <div className={styles.essayText} ref={textRef}>
        {ESSAY_LINES.slice(0, lines).map((line, i) => (
          <p
            key={i}
            className={`${styles.essayLine} ${i === 0 ? styles.essayTitle : ""}`}
          >
            {line || "\u00A0"}
          </p>
        ))}
        {lines < ESSAY_LINES.length && <span className={styles.cursor}>|</span>}
      </div>

      {/* Audio bar */}
      {audioActive && (
        <div className={styles.audioBar}>
          <div className={styles.audioWave}>
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className={styles.audioBarUnit}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
          <div className={styles.audioMeta}>
            <span className={styles.audioVoice}>nova · OpenAI TTS</span>
            <span className={styles.audioDuration}>22:14</span>
          </div>
        </div>
      )}
    </div>
  );
}

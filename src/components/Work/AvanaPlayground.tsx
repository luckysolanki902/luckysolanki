/* ============================================================
   AvanaPlayground — AI agent conversation simulator.
   Shows multi-agent orchestration in action:
   1. Ask  — simulates a user question → agent routing → specialist handoff → response
   2. Voice — shows the WebRTC realtime voice flow
   Different UI from all other playgrounds: chat messages + agent badges.
   ============================================================ */

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./AvanaPlayground.module.css";

/* ── Types ────────────────────────────────────────────────── */

type FlowId = "ask" | "voice";

interface ChatMsg {
  role: "user" | "agent" | "system";
  agent?: string;
  text: string;
}

/* ── Data ─────────────────────────────────────────────────── */

const ASK_MESSAGES: ChatMsg[] = [
  { role: "user", text: "I'm looking at a 3-are plot in Canggu. Is it safe to buy as a foreigner?" },
  { role: "system", text: "Routing to Legal Expert…" },
  { role: "agent", agent: "Legal Expert", text: "Foreigners cannot own freehold (Hak Milik) land in Indonesia. For Canggu, your options are:" },
  { role: "agent", agent: "Legal Expert", text: "1. **Hak Pakai** (Right to Use) — up to 80 years, registered in your name\n2. **Leasehold** — typically 25-30 year terms, renewable\n3. **PMA company** — Indonesian PT structure, holds HGB title" },
  { role: "system", text: "Fetching land data for Canggu coordinates…" },
  { role: "system", text: "search_land_by_coordinates → UUID: PLT_8f2a → get_zoning_data" },
  { role: "agent", agent: "Legal Expert", text: "This plot is zoned **Residential (Perumahan)** — KDB 60%, KLB 1.2. No flood risk. Market estimate: $850–$1,100/sqm. I'd recommend engaging a licensed PPAT notary for the transaction." },
  { role: "system", text: "Handoff → Tax & Finance Expert" },
  { role: "agent", agent: "Tax Expert", text: "Budget for these costs: BPHTB (5% of transaction), PPh (2.5% seller-side), notary fees (~1-2%), and annual PBB land tax. Total acquisition cost: roughly 8-9% above purchase price." },
];

const VOICE_STEPS = [
  { label: "User taps mic", detail: "Voice Mode activated" },
  { label: "Token request", detail: "POST /api/realtime/token → ephemeral WebRTC token" },
  { label: "WebRTC connect", detail: "SDP offer/answer → ICE candidates → peer connected" },
  { label: "User speaks", detail: '"What about flood risk in Berawa?"' },
  { label: "Agent responds", detail: "Real-time voice: \"Berawa has moderate flood risk during rainy season…\"" },
  { label: "Transcript saved", detail: "Conversation stored → searchable history" },
];

const FLOW_LABELS: Record<FlowId, string> = {
  ask: "Multi-Agent Chat",
  voice: "Realtime Voice",
};

/* ── Component ───────────────────────────────────────────── */

export function AvanaPlayground() {
  const [activeFlow, setActiveFlow] = useState<FlowId>("ask");

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <span className={styles.title}>How Avana works</span>
        <div className={styles.tabs}>
          {(["ask", "voice"] as FlowId[]).map((id) => (
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

      {activeFlow === "ask" ? <AskFlow /> : <VoiceFlow />}
    </div>
  );
}

/* ── Ask Flow (Multi-Agent Chat) ─────────────────────────── */

function AskFlow() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step = () => {
      if (i < ASK_MESSAGES.length) {
        const idx = i;
        i++;
        setMessages((prev) => [...prev, ASK_MESSAGES[idx]]);
        const delay = ASK_MESSAGES[idx].role === "system" ? 500 : 900;
        timers.push(setTimeout(step, delay));
      }
    };
    timers.push(setTimeout(step, 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className={styles.chatArea} ref={chatRef}>
      {messages.map((msg, i) => {
        if (msg.role === "system") {
          return (
            <div key={i} className={styles.systemMsg}>
              {msg.text}
            </div>
          );
        }
        if (msg.role === "user") {
          return (
            <div key={i} className={`${styles.bubble} ${styles.bubbleUser}`}>
              {msg.text}
            </div>
          );
        }
        return (
          <div key={i} className={styles.agentRow}>
            {msg.agent && <span className={styles.agentBadge}>{msg.agent}</span>}
            <div className={`${styles.bubble} ${styles.bubbleAgent}`}>
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Voice Flow ──────────────────────────────────────────── */

function VoiceFlow() {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
  }, []);

  useEffect(() => {
    if (revealed >= VOICE_STEPS.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), 800);
    return () => clearTimeout(t);
  }, [revealed]);

  return (
    <div className={styles.voiceArea}>
      {/* Waveform indicator */}
      <div className={styles.waveform}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`${styles.waveBar} ${revealed >= 4 ? styles.waveBarActive : ""}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        <span className={styles.waveLabel}>
          {revealed < 3 ? "Connecting…" : revealed < 5 ? "Listening…" : "Voice session complete"}
        </span>
      </div>

      {/* Steps */}
      <div className={styles.voiceSteps}>
        {VOICE_STEPS.map((step, i) => {
          const visible = i < revealed;
          return (
            <div
              key={i}
              className={`${styles.voiceStep} ${visible ? styles.voiceStepVisible : ""}`}
            >
              <span className={styles.voiceStepDot} />
              <div className={styles.voiceStepContent}>
                <span className={styles.voiceStepLabel}>{step.label}</span>
                <span className={styles.voiceStepDetail}>{step.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

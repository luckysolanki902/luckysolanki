/* ============================================================
   SpyllPlayground — Anonymous social experience simulator.
   Completely different visual language from pipeline playgrounds:
   confession cards, chat bubbles, encryption reveals, pairing.
   1. Confess — type → encrypt author → post anonymously
   2. Match  — progressive filter pairing → chat → voice call
   ============================================================ */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./SpyllPlayground.module.css";

/* ── Types ────────────────────────────────────────────────── */

type FlowId = "confess" | "match";

type ConfessionPhase = "idle" | "typing" | "encrypting" | "posted";
type MatchPhase = "idle" | "searching" | "paired" | "chatting" | "calling";

interface ChatMsg {
  from: "you" | "stranger";
  text: string;
}

/* ── Data ─────────────────────────────────────────────────── */

const CONFESSION =
  "I've been pretending to understand DSA in class for 3 semesters. The truth? I still google how binary search works every time.";

const REAL_MID = "usr_6f8a2e91c4b7";

// Realistic AES-256 output (truncated for display)
const ENCRYPTED_MID = "U2FsdGVkX1+8kR3xLm9v7QpZ2Nc4fT…";

const FILTER_LEVELS = [
  "Same College + Preferred Gender",
  "Any College + Preferred Gender",
  "Same College + Any Gender",
];

const CHAT_MESSAGES: ChatMsg[] = [
  { from: "stranger", text: "hey" },
  { from: "you", text: "hii" },
  { from: "stranger", text: "which year?" },
  { from: "you", text: "3rd year, you?" },
  { from: "stranger", text: "same lol. what branch?" },
  { from: "you", text: "cse, wbu" },
  { from: "stranger", text: "me too lmaooo" },
];

const FLOW_LABELS: Record<FlowId, string> = {
  confess: "Confess",
  match: "Match",
};

/* ── Component ───────────────────────────────────────────── */

export function SpyllPlayground() {
  const [activeFlow, setActiveFlow] = useState<FlowId>("match");

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <span className={styles.title}>How Spyll works</span>
        <div className={styles.tabs}>
          {(["match", "confess"] as FlowId[]).map((id) => (
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

      {activeFlow === "confess" ? <ConfessFlow /> : <MatchFlow />}
    </div>
  );
}

/* ── Confession Flow ─────────────────────────────────────── */

function ConfessFlow() {
  const [phase, setPhase] = useState<ConfessionPhase>("idle");
  const [typed, setTyped] = useState("");
  const [encryptProgress, setEncryptProgress] = useState(0);
  const [likes, setLikes] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const runConfession = useCallback(() => {
    cleanup();
    setPhase("typing");
    setTyped("");
    setEncryptProgress(0);
    setLikes(0);

    let i = 0;
    const typeNext = () => {
      if (i < CONFESSION.length) {
        setTyped(CONFESSION.slice(0, i + 1));
        i++;
        timerRef.current = setTimeout(typeNext, 18 + Math.random() * 12);
      } else {
        // Pause, then encrypt
        timerRef.current = setTimeout(() => {
          setPhase("encrypting");
          let p = 0;
          const encryptStep = () => {
            if (p <= 100) {
              setEncryptProgress(p);
              p += 4;
              timerRef.current = setTimeout(encryptStep, 30);
            } else {
              timerRef.current = setTimeout(() => {
                setPhase("posted");
                // Animate likes
                const likeCounts = [1, 3, 5, 7, 12, 19, 24];
                likeCounts.forEach((count, idx) => {
                  setTimeout(() => setLikes(count), (idx + 1) * 300);
                });
              }, 400);
            }
          };
          encryptStep();
        }, 600);
      }
    };
    typeNext();
  }, [cleanup]);

  useEffect(() => {
    const t = setTimeout(runConfession, 500);
    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, [runConfession, cleanup]);

  return (
    <div className={styles.confessArea}>
      {/* Confession card */}
      <div
        className={`${styles.confessionCard} ${phase === "posted" ? styles.confessionPosted : ""}`}
      >
        <div className={styles.confessionHeader}>
          <span className={styles.anonBadge}>Anonymous</span>
          {phase === "posted" && (
            <span className={styles.collegeBadge}>IIT Delhi</span>
          )}
        </div>

        <p className={styles.confessionText}>
          {phase === "idle" ? (
            <span className={styles.placeholder}>Type your confession…</span>
          ) : (
            <>
              {typed}
              {phase === "typing" && <span className={styles.cursor}>|</span>}
            </>
          )}
        </p>

        {phase === "idle" || phase === "typing" ? (
          <div className={styles.confessionFooter}>
            <span className={styles.confessionHint}>
              {phase === "typing" ? "typing…" : "Your identity is encrypted before posting"}
            </span>
          </div>
        ) : null}

        {phase === "posted" && (
          <div className={styles.confessionFooter}>
            <span className={styles.confessionLikes}>♡ {likes}</span>
            <span className={styles.confessionTime}>just now</span>
          </div>
        )}
      </div>

      {/* Encryption reveal */}
      {(phase === "encrypting" || phase === "posted") && (
        <div className={styles.encryptionReveal}>
          <div className={styles.encryptRow}>
            <span className={styles.encryptLabel}>your identity</span>
            <span className={styles.encryptValue}>{REAL_MID}</span>
          </div>
          <div className={styles.encryptArrow}>
            {phase === "encrypting" ? (
              <span className={styles.encryptingText}>
                AES-256 encrypting… {encryptProgress}%
              </span>
            ) : (
              <span className={styles.encryptedDone}>AES-256 ✓</span>
            )}
          </div>
          <div className={styles.encryptRow}>
            <span className={styles.encryptLabel}>stored as</span>
            <span className={styles.encryptValue}>
              {phase === "encrypting"
                ? scrambleText(ENCRYPTED_MID, encryptProgress)
                : ENCRYPTED_MID}
            </span>
          </div>
          {phase === "posted" && (
            <p className={styles.encryptNote}>
              Cryptographically untraceable — even with full database access
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Match Flow ──────────────────────────────────────────── */

function MatchFlow() {
  const [phase, setPhase] = useState<MatchPhase>("idle");
  const [filterLevel, setFilterLevel] = useState(-1);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [callActive, setCallActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const runMatch = useCallback(() => {
    cleanup();
    setPhase("searching");
    setFilterLevel(-1);
    setMessages([]);
    setCallActive(false);

    // Progressive filter relaxation
    let level = 0;
    const tryFilter = () => {
      setFilterLevel(level);
      if (level < FILTER_LEVELS.length - 1) {
        level++;
        timerRef.current = setTimeout(tryFilter, 1200);
      } else {
        // Matched on last filter!
        timerRef.current = setTimeout(() => {
          setPhase("paired");
          timerRef.current = setTimeout(() => {
            setPhase("chatting");
            // Drip-feed messages
            CHAT_MESSAGES.forEach((msg, i) => {
              setTimeout(
                () => setMessages((prev) => [...prev, msg]),
                (i + 1) * 800
              );
            });
            // Voice call after messages
            setTimeout(() => {
              setCallActive(true);
              setPhase("calling");
            }, CHAT_MESSAGES.length * 800 + 1000);
          }, 1000);
        }, 800);
      }
    };
    timerRef.current = setTimeout(tryFilter, 600);
  }, [cleanup]);

  useEffect(() => {
    const t = setTimeout(runMatch, 500);
    return () => {
      clearTimeout(t);
      cleanup();
    };
  }, [runMatch, cleanup]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.matchArea}>
      {/* User cards */}
      <div className={styles.matchPair}>
        <div className={`${styles.userCard} ${styles.userYou}`}>
          <div className={styles.userAvatar}>You</div>
          <span className={styles.userInfo}>CSE · 3rd Year</span>
        </div>

        <div className={styles.matchCenter}>
          {phase === "searching" && (
            <div className={styles.searchingDots}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          )}
          {phase === "paired" && (
            <span className={styles.pairedFlash}>Paired!</span>
          )}
          {(phase === "chatting" || phase === "calling") && (
            <div className={styles.connectedLine} />
          )}
        </div>

        <div
          className={`${styles.userCard} ${styles.userStranger} ${
            phase !== "idle" && phase !== "searching"
              ? styles.userRevealed
              : ""
          }`}
        >
          <div className={styles.userAvatar}>
            {phase === "idle" || phase === "searching" ? "?" : "S"}
          </div>
          <span className={styles.userInfo}>
            {phase === "idle" || phase === "searching"
              ? "Finding…"
              : "IIT Delhi · Female"}
          </span>
        </div>
      </div>

      {/* Filter levels */}
      {phase === "searching" && (
        <div className={styles.filters}>
          {FILTER_LEVELS.map((label, i) => (
            <div
              key={label}
              className={`${styles.filterRow} ${
                i < filterLevel
                  ? styles.filterFailed
                  : i === filterLevel
                    ? styles.filterActive
                    : styles.filterWaiting
              }`}
            >
              <span className={styles.filterIcon}>
                {i < filterLevel ? "✗" : i === filterLevel ? "◉" : "○"}
              </span>
              <span className={styles.filterLabel}>
                Level {i + 1}: {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Chat bubbles */}
      {messages.length > 0 && (
        <div className={styles.chatArea}>
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.bubble} ${
                msg.from === "you" ? styles.bubbleYou : styles.bubbleStranger
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Voice call indicator */}
      {callActive && (
        <div className={styles.callBanner}>
          <span className={styles.callPulse} />
          <span className={styles.callText}>
            Voice connected — WebRTC peer-to-peer · audio never touches a server
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────── */

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function scrambleText(target: string, progress: number): string {
  const len = target.length;
  const resolved = Math.floor((progress / 100) * len);
  let out = "";
  for (let i = 0; i < len; i++) {
    if (i < resolved) {
      out += target[i];
    } else {
      out += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
  }
  return out;
}

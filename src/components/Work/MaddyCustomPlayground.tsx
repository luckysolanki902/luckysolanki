/* ============================================================
   MaddyCustomPlayground — Interactive e-commerce flow visualizer.
   Shows real flows from MaddyCustom's architecture:
   1. Customer Journey (single-user timeline + aggregate funnel)
   2. Payment Orchestration (Razorpay → PayU + Shiprocket)
   3. Meta CAPI Pipeline (client pixel + server-side dedup)
   ============================================================ */

"use client";

import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import styles from "./MaddyCustomPlayground.module.css";

/* ── Types ────────────────────────────────────────────────── */

type FlowId = "journey" | "payment" | "meta";

/* ── Customer Journey Timeline ───────────────────────────── */

interface JourneyStep {
  label: string;
  detail: string;
  time: string;
  duration: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  { label: "Landed", detail: "Google → 'custom car wraps near me'", time: "0:00", duration: "" },
  { label: "Product View", detail: "No Limits Window Pillar Wrap for Cars - ₹689", time: "0:23", duration: "23s browsing" },
  { label: "Added to Cart", detail: "Selected: Sedan, Hyundai Verna", time: "1:13", duration: "50s configuring" },
  { label: "Checkout", detail: "Filled address, selected COD → switched to Online", time: "2:41", duration: "1m 28s deciding" },
  { label: "Looking for Offers", detail: "Tried 'SAVE10' — invalid. Tried 'FIRST' — ₹50 off ✓", time: "3:18", duration: "37s coupon hunting" },
  { label: "Payment", detail: "Razorpay UPI — ₹639 — payment.captured ✓", time: "3:52", duration: "34s completing" },
  { label: "Order Confirmed", detail: "Shiprocket AWB: 7821934 — ETA 4 days", time: "3:53", duration: "instant" },
];

/* ── Funnel (aggregate) ──────────────────────────────────── */

interface FunnelStage {
  label: string;
  users: number;
  color: string;
}

const FUNNEL_STAGES: FunnelStage[] = [
  { label: "Visit", users: 1000, color: "var(--text-tertiary)" },
  { label: "Product View", users: 620, color: "var(--text-tertiary)" },
  { label: "Add to Cart", users: 310, color: "var(--text-secondary)" },
  { label: "Checkout", users: 185, color: "var(--text-secondary)" },
  { label: "Payment", users: 142, color: "var(--text-primary)" },
  { label: "Purchase", users: 128, color: "var(--text-primary)" },
];

/* ── Payment Orchestration (dual gateway failover) ───────── */

interface OrchStep {
  label: string;
  status: "ok" | "fail" | "wait";
  gateway?: "razorpay" | "payu";
}

const ORCH_STEPS: OrchStep[] = [
  { label: "Customer clicks 'Pay ₹22,499'", status: "ok" },
  { label: "order.create({ amount: 22499, gateway: 'razorpay' })", status: "ok", gateway: "razorpay" },
  { label: "Razorpay.createOrder() → order_id: 'order_N8z4…'", status: "ok", gateway: "razorpay" },
  { label: "razorpay.open() → UPI intent sent", status: "wait", gateway: "razorpay" },
  { label: "❌ Razorpay timeout — payment.failed (bank_decline)", status: "fail", gateway: "razorpay" },
  { label: "Orchestrator: primary failed → switching to PayU", status: "wait" },
  { label: "PayU.createHash({ key, txnid, amount: 22499 })", status: "ok", gateway: "payu" },
  { label: "Redirect → PayU checkout → UPI selected", status: "wait", gateway: "payu" },
  { label: "PayU callback → status: 'success', mihpayid: '4031…'", status: "ok", gateway: "payu" },
  { label: "POST /api/webhooks/payu → HMAC verified ✓ → order 'confirmed'", status: "ok", gateway: "payu" },
  { label: "Shiprocket.createOrder() → AWB: 7821934 → ETA 4 days ✓", status: "ok" },
];

/* ── Meta CAPI Pipeline ──────────────────────────────────── */

interface MetaNode {
  label: string;
  sub?: string;
}

const META_NODES: MetaNode[] = [
  { label: "Browser", sub: "fbq('track')" },
  { label: "Pixel", sub: "Client-side" },
  { label: "Next.js API", sub: "Server route" },
  { label: "CAPI SDK", sub: "Dedup eventID" },
  { label: "Meta Ads", sub: "Conversions" },
];

const META_LOGS = [
  "fbq('track', 'Purchase', { value: 1299, currency: 'INR' })",
  "Pixel fires → eventID: 'evt_3k8f2a' sent to Meta",
  "POST /api/meta/track → { event: 'Purchase', eventID: 'evt_3k8f2a' }",
  "bizSdk.EventRequest → server_event with matching eventID (dedup)",
  "Meta receives both → deduplicates by eventID → 1 conversion ✓",
];

/* ── Flow config ─────────────────────────────────────────── */

const FLOW_IDS: FlowId[] = ["journey", "payment", "meta"];
const FLOW_LABELS: Record<FlowId, string> = {
  journey: "Customer Journey",
  payment: "Payment Orchestration",
  meta: "Meta CAPI",
};

/* ── Component ───────────────────────────────────────────── */

export function MaddyCustomPlayground() {
  const [activeFlow, setActiveFlow] = useState<FlowId>("journey");

  return (
    <div className={styles.playground}>
      <div className={styles.header}>
        <span className={styles.title}>Live Architecture</span>
        <div className={styles.tabs}>
          {FLOW_IDS.map((id) => (
            <button
              key={id}
              className={`${styles.tab} ${id === activeFlow ? styles.tabActive : ""}`}
              onClick={() => setActiveFlow(id)}
            >
              {FLOW_LABELS[id]}
            </button>
          ))}
        </div>
      </div>

      {activeFlow === "journey" && <JourneyFlow />}
      {activeFlow === "payment" && <PaymentFlow />}
      {activeFlow === "meta" && <MetaFlow />}
    </div>
  );
}

/* ── Customer Journey Flow ───────────────────────────────── */

function JourneyFlow() {
  const [revealed, setRevealed] = useState(0);
  const [showFunnel, setShowFunnel] = useState(false);
  const [funnelRevealed, setFunnelRevealed] = useState(0);

  // Auto-play timeline
  useEffect(() => {
    setRevealed(0);
    setShowFunnel(false);
    setFunnelRevealed(0);
  }, []);

  useEffect(() => {
    if (revealed >= JOURNEY_STEPS.length) {
      const t = setTimeout(() => {
        setShowFunnel(true);
        setFunnelRevealed(0);
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 650);
    return () => clearTimeout(t);
  }, [revealed]);

  // Auto-play funnel after journey completes
  useEffect(() => {
    if (!showFunnel) return;
    if (funnelRevealed >= FUNNEL_STAGES.length) return;
    const t = setTimeout(() => setFunnelRevealed((r) => r + 1), 300);
    return () => clearTimeout(t);
  }, [showFunnel, funnelRevealed]);

  const maxUsers = FUNNEL_STAGES[0].users;

  return (
    <>
      {/* Timeline */}
      <div className={styles.timeline}>
        {JOURNEY_STEPS.map((step, i) => {
          const visible = i < revealed;
          return (
            <div
              key={step.label}
              className={`${styles.timelineStep} ${visible ? styles.timelineStepVisible : ""}`}
            >
              <div className={styles.timelineDot}>
                <span className={styles.timelineDotInner} />
                {i < JOURNEY_STEPS.length - 1 && <span className={styles.timelineLine} />}
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineRow}>
                  <span className={styles.timelineLabel}>{step.label}</span>
                  <span className={styles.timelineTime}>{step.time}</span>
                </div>
                <p className={styles.timelineDetail}>{step.detail}</p>
                {step.duration && (
                  <span className={styles.timelineDuration}>{step.duration}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregated funnel */}
      {showFunnel && (
        <div className={styles.funnelSection}>
          <span className={styles.funnelTitle}>Aggregated across all 100K+ monthly users</span>
          <div className={styles.funnel}>
            {FUNNEL_STAGES.map((stage, i) => {
              const width = (stage.users / maxUsers) * 100;
              const prevUsers = i > 0 ? FUNNEL_STAGES[i - 1].users : null;
              const dropRate = prevUsers
                ? Math.round(((prevUsers - stage.users) / prevUsers) * 100)
                : null;
              const visible = i < funnelRevealed;

              return (
                <div
                  key={stage.label}
                  className={`${styles.funnelRow} ${visible ? styles.funnelRowVisible : ""}`}
                >
                  <span className={styles.funnelLabel}>{stage.label}</span>
                  <div className={styles.funnelBarTrack}>
                    <div
                      className={styles.funnelBar}
                      style={{
                        width: visible ? `${width}%` : "0%",
                        background: stage.color,
                      }}
                    />
                  </div>
                  <span className={styles.funnelCount}>
                    {visible ? stage.users.toLocaleString() : "—"}
                  </span>
                  {dropRate !== null && visible && (
                    <span className={styles.funnelDrop}>-{dropRate}%</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Payment Orchestration Flow ──────────────────────────── */

function PaymentFlow() {
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setRevealed(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (revealed >= ORCH_STEPS.length) {
      setDone(true);
      return;
    }
    // Pause longer on the failure + switch steps for drama
    const step = ORCH_STEPS[revealed];
    const delay = step?.status === "fail" ? 1100 : step?.status === "wait" ? 900 : 650;
    const t = setTimeout(() => setRevealed((r) => r + 1), delay);
    return () => clearTimeout(t);
  }, [revealed]);

  const replay = () => {
    setRevealed(0);
    setDone(false);
  };

  const activeGateway = (() => {
    for (let i = Math.min(revealed, ORCH_STEPS.length) - 1; i >= 0; i--) {
      if (ORCH_STEPS[i].gateway) return ORCH_STEPS[i].gateway;
    }
    return null;
  })();

  const razorpayFailed = revealed > 4;

  return (
    <>
      {/* Gateway indicators */}
      <div className={styles.gatewayRow}>
        <div
          className={`${styles.gatewayBadge} ${
            activeGateway === "razorpay" ? styles.gatewayActive : ""
          } ${razorpayFailed ? styles.gatewayFailed : ""}`}
        >
          Razorpay {razorpayFailed ? "✗" : activeGateway === "razorpay" ? "●" : ""}
        </div>
        <span className={styles.gatewayArrow}>{razorpayFailed ? "failover →" : "primary"}</span>
        <div
          className={`${styles.gatewayBadge} ${
            activeGateway === "payu" ? styles.gatewayActive : ""
          }`}
        >
          PayU {activeGateway === "payu" ? "●" : ""}
        </div>
      </div>

      {/* Step log */}
      <div className={styles.logArea}>
        {ORCH_STEPS.slice(0, revealed).map((step, i) => (
          <div
            key={`orch-${i}`}
            className={`${styles.logLine} ${
              step.status === "fail" ? styles.logFail : ""
            } ${step.status === "wait" ? styles.logWait : ""}`}
          >
            <span className={styles.logArrow}>
              {step.status === "fail" ? "✗" : step.status === "wait" ? "…" : "→"}
            </span>{" "}
            {step.label}
          </div>
        ))}
        {revealed === 0 && (
          <div className={styles.logPlaceholder}>Orchestrating payment flow…</div>
        )}
      </div>

      {done && (
        <button className={styles.runBtn} onClick={replay}>
          Replay →
        </button>
      )}
    </>
  );
}

/* ── Meta CAPI Flow ──────────────────────────────────────── */

function MetaFlow() {
  const [step, setStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(() => {
    if (isRunning) return;
    setStep(0);
    setIsRunning(true);
  }, [isRunning]);

  useEffect(() => {
    const t = setTimeout(() => {
      setStep(0);
      setIsRunning(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isRunning || step < 0) return;
    const max = META_LOGS.length - 1;

    if (step >= max) {
      const t = setTimeout(() => {
        setIsRunning(false);
        setStep(-1);
      }, 2200);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [isRunning, step]);

  return (
    <>
      <div className={styles.pipeline}>
        {META_NODES.map((node, i) => (
          <Fragment key={`meta-${i}`}>
            {i > 0 && (
              <div
                className={`${styles.connector} ${step >= i ? styles.connectorActive : ""}`}
              />
            )}
            <div className={`${styles.node} ${step >= i ? styles.nodeActive : ""}`}>
              <span className={styles.nodeLabel}>{node.label}</span>
              {node.sub && <span className={styles.nodeSub}>{node.sub}</span>}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Dual-track visualization */}
      <div className={styles.dualTrack}>
        <div className={`${styles.trackLine} ${step >= 1 ? styles.trackLineActive : ""}`}>
          <span className={styles.trackDot} />
          Client Pixel
        </div>
        <div className={`${styles.trackLine} ${step >= 3 ? styles.trackLineActive : ""}`}>
          <span className={styles.trackDot} />
          Server CAPI
        </div>
        <div className={`${styles.trackMerge} ${step >= 4 ? styles.trackMergeActive : ""}`}>
          → eventID dedup → 1 event
        </div>
      </div>

      <div className={styles.logArea}>
        {step >= 0 ? (
          META_LOGS.slice(0, step + 1).map((log, i) => (
            <div key={`meta-log-${i}`} className={styles.logLine}>
              <span className={styles.logArrow}>→</span> {log}
            </div>
          ))
        ) : (
          <div className={styles.logPlaceholder}>
            Click &ldquo;Run&rdquo; to see dual tracking in action
          </div>
        )}
      </div>

      <button className={styles.runBtn} onClick={run} disabled={isRunning}>
        {isRunning ? "Tracking..." : "Run Flow →"}
      </button>
    </>
  );
}

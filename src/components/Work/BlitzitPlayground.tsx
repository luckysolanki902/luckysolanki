/* ============================================================
   BlitzitPlayground — Interactive architecture visualizer.
   Shows real data flows through Blitzit's backend:
   1. Outbound Sync (Blitzit → External)
   2. Inbound Webhook (External → Blitzit)
   3. MCP Tool Call (AI ↔ Blitzit)
   Uses actual function names & routes from the codebase.
   ============================================================ */

"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import styles from "./BlitzitPlayground.module.css";

/* ── Types ────────────────────────────────────────────────── */

type FlowId = "outbound" | "inbound" | "mcp";

interface FlowNode {
  label: string;
  sub?: string;
}

interface Flow {
  name: string;
  nodes: FlowNode[];
  logs: string[];
}

/* ── Flow definitions (real architecture) ────────────────── */

const FLOWS: Record<FlowId, Flow> = {
  outbound: {
    name: "Blitzit → External",
    nodes: [
      { label: "Task Change", sub: "Event emitted" },
      { label: "Event Bus", sub: "wireEventBus" },
      { label: "Loop Guard", sub: "meta.source" },
      { label: "Plugin SDK", sub: "BasePlugin" },
      { label: "Asana API", sub: "External" },
    ],
    logs: [
      'eventBus.emit("task.updated", { taskId: "task_8f2" })',
      "wireEventBusToPlugins() → handler matched",
      'meta.source ≠ "integration" — not a sync loop ✓',
      "AsanaPlugin.onTaskUpdated(prev, next, integration)",
      "PATCH api.asana.com/tasks/1207530 → 200 OK",
    ],
  },
  inbound: {
    name: "External → Blitzit",
    nodes: [
      { label: "Webhook", sub: "POST inbound" },
      { label: "HMAC", sub: "Verify sig" },
      { label: "Extract", sub: "Parse events" },
      { label: "Handler", sub: "processEvent" },
      { label: "Database", sub: "Task.create" },
    ],
    logs: [
      "POST /v3/inbound/asana/intg_61fa → 200 (fire-and-forget)",
      "verifyWebhookSignature() → X-Hook-Secret valid ✓",
      'extractEvents(body) → [{ action: "changed", gid: "120753" }]',
      "processEvent() → mapExternalToTask()",
      'Task.create({ meta: { source: "integration" } }) → loop-safe',
    ],
  },
  mcp: {
    name: "AI ↔ Blitzit",
    nodes: [
      { label: "Claude", sub: "AI Agent" },
      { label: "JSON-RPC", sub: "Streamable HTTP" },
      { label: "Auth", sub: "OAuth 2.1" },
      { label: "Executor", sub: "Tool router" },
      { label: "Result", sub: "Task created" },
    ],
    logs: [
      'POST /v3/mcp → { method: "tools/call" }',
      'JSON-RPC 2.0 → params: { name: "create_task" }',
      "resolveConsumer() → scope: tasks:write ✓",
      "executeTool('create_task') → TaskOps.create()",
      "→ content: [{ text: '{ id: \"task_z5k\" }' }]",
    ],
  },
};

const FLOW_IDS: FlowId[] = ["outbound", "inbound", "mcp"];

/* ── Component ───────────────────────────────────────────── */

export function BlitzitPlayground() {
  const [activeFlow, setActiveFlow] = useState<FlowId>("outbound");
  const [step, setStep] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const flow = FLOWS[activeFlow];

  const run = useCallback(() => {
    if (isRunning) return;
    setStep(0);
    setIsRunning(true);
  }, [isRunning]);

  /* Auto-run on mount */
  useEffect(() => {
    const t = setTimeout(() => {
      setStep(0);
      setIsRunning(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  /* Step progression */
  useEffect(() => {
    if (!isRunning || step < 0) return;

    const max = flow.logs.length - 1;
    if (step >= max) {
      const t = setTimeout(() => {
        setIsRunning(false);
        setStep(-1);
      }, 2200);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setStep((s) => s + 1), 850);
    return () => clearTimeout(t);
  }, [isRunning, step, flow.logs.length]);

  const switchFlow = (id: FlowId) => {
    if (id === activeFlow) return;
    setActiveFlow(id);
    setStep(-1);
    setIsRunning(false);
  };

  return (
    <div className={styles.playground}>
      {/* Header + tabs */}
      <div className={styles.header}>
        <span className={styles.title}>Live Architecture</span>
        <div className={styles.tabs}>
          {FLOW_IDS.map((id) => (
            <button
              key={id}
              className={`${styles.tab} ${id === activeFlow ? styles.tabActive : ""}`}
              onClick={() => switchFlow(id)}
            >
              {FLOWS[id].name}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className={styles.pipeline}>
        {flow.nodes.map((node, i) => (
          <Fragment key={`${activeFlow}-${i}`}>
            {i > 0 && (
              <div
                className={`${styles.connector} ${
                  step >= i ? styles.connectorActive : ""
                }`}
              />
            )}
            <div
              className={`${styles.node} ${
                step >= i ? styles.nodeActive : ""
              }`}
            >
              <span className={styles.nodeLabel}>{node.label}</span>
              {node.sub && (
                <span className={styles.nodeSub}>{node.sub}</span>
              )}
            </div>
          </Fragment>
        ))}
      </div>

      {/* Log output */}
      <div className={styles.logArea}>
        {step >= 0 ? (
          flow.logs.slice(0, step + 1).map((log, i) => (
            <div key={`${activeFlow}-log-${i}`} className={styles.logLine}>
              <span className={styles.logArrow}>→</span> {log}
            </div>
          ))
        ) : (
          <div className={styles.logPlaceholder}>
            Click &ldquo;Run&rdquo; to trace the data flow
          </div>
        )}
      </div>

      {/* Trigger */}
      <button className={styles.runBtn} onClick={run} disabled={isRunning}>
        {isRunning ? "Tracing..." : "Run Flow →"}
      </button>
    </div>
  );
}

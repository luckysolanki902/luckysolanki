"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { advanceTrace } from "@/lib/system-walkthrough";
import styles from "./SystemWalkthrough.module.css";

const descriptions = {
  ready: ["Start with a request.", "An agent wants to mark a task as done. Follow the call through the system."],
  checking: ["Check before changing anything.", "The tool checks whether this caller has permission to update the task."],
  executing: ["One implementation. Two entry points.", "The in-app agent and external MCP clients use the same tool executor."],
  committed: ["A change you can undo.", "The task is updated and the change is recorded. Try undoing it below."],
  blocked: ["No permission. No write.", "The call stops at the permission boundary. The task stays unchanged."],
  undone: ["Back where we started.", "The previous task state is restored. Reversible writes give the user a way back."],
};
export function SystemWalkthrough() {
  const [state, dispatch] = useReducer(advanceTrace, "ready");
  const [allowed, setAllowed] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = state === "checking" || state === "executing";
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (state === "checking") timer.current = setTimeout(() => dispatch(allowed ? "allow" : "deny"), reduced ? 0 : 850);
    if (state === "executing") timer.current = setTimeout(() => dispatch("commit"), reduced ? 0 : 850);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [state, allowed]);
  const current = state === "ready" ? 0 : state === "checking" || state === "blocked" ? 1 : state === "executing" ? 2 : 3;
  return <section id="systems" className={styles.section} aria-labelledby="systems-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}>Behind the interface</p><h2 id="systems-title">Useful AI.<br /><span>Dependable systems.</span></h2></div>
      <p className={styles.intro}>An agent calling a tool is the easy part. The interesting work is deciding what it can change, what happens when it fails, and how a user gets control back.</p>
    </div>
    <div className={styles.lab}>
      <div className={styles.labHeader}><span className={styles.labTitle}><i aria-hidden="true" /> Anatomy of an AI action</span><span>Illustrated from my work at Blitzit</span></div>
      <div className={styles.body}>
        <div className={styles.request}>
          <span className={styles.label}>Try a tool call</span>
          <p className={styles.command}>“Mark the launch<br />checklist as done.”</p>
          <fieldset className={styles.options} disabled={busy}><legend>Caller permission</legend>
            <label><input type="radio" name="tool-permission" checked={allowed} onChange={() => {setAllowed(true); dispatch("reset");}} />Can update tasks</label>
            <label><input type="radio" name="tool-permission" checked={!allowed} onChange={() => {setAllowed(false); dispatch("reset");}} />Read only</label>
          </fieldset>
          <button className={styles.run} disabled={busy} onClick={() => { if (state === "committed") dispatch("reset"); else dispatch("run"); }}>{busy ? "Following the call…" : state === "committed" ? "Reset example" : "Run the example"}<span aria-hidden="true">↗</span></button>
          <p className={styles.disclaimer}>An interactive explanation. No real tasks or API calls.</p>
        </div>
        <div className={styles.trace} data-state={state}>
          <ol className={styles.nodes} aria-label="Tool call path">
            {["Request", "Permissions", "Executor", "Journal"].map((name, i) => <li key={name} data-active={current === i} data-complete={current > i} data-blocked={state === "blocked" && i === 1}><span>{state === "blocked" && i === 1 ? "×" : current > i ? "✓" : `0${i + 1}`}</span><strong>{name}</strong></li>)}
          </ol>
          <div className={styles.explanation} role="status" aria-live="polite"><h3>{descriptions[state][0]}</h3><p>{descriptions[state][1]}</p></div>
          <div className={styles.task}><div><span className={styles.label}>Example task</span><strong>Review launch checklist</strong></div><span className={styles.taskStatus} data-done={state === "committed"}>{state === "committed" ? "✓ Done" : "To do"}</span></div>
          <div className={styles.result}><span>{state === "blocked" ? "Write rejected · task unchanged" : state === "committed" ? "Change recorded · undo available" : state === "undone" ? "Previous state restored" : "Permission checked before every write"}</span><button disabled={state !== "committed"} onClick={() => dispatch("undo")}>Undo change ↶</button></div>
        </div>
      </div>
      <div className={styles.labFooter}><p>The same tools and permissions, whether the caller is an in-app agent or an MCP client.</p><Link href="/blog/one-tool-layer-two-agents">Read the engineering notes <span aria-hidden="true">↗</span></Link></div>
    </div>
  </section>;
}

/** Illustrative UI model, not a request to a production system. */
export type TraceState = "ready" | "checking" | "executing" | "committed" | "blocked" | "undone";
export type TraceEvent = "run" | "allow" | "deny" | "commit" | "undo" | "reset";
export function advanceTrace(state: TraceState, event: TraceEvent): TraceState {
  if (event === "reset") return "ready";
  if (event === "run" && ["ready", "blocked", "undone"].includes(state)) return "checking";
  if (event === "allow" && state === "checking") return "executing";
  if (event === "deny" && state === "checking") return "blocked";
  if (event === "commit" && state === "executing") return "committed";
  if (event === "undo" && state === "committed") return "undone";
  return state;
}

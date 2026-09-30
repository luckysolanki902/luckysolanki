/** Bounded first-party activity, never raw pointer trails or form keystrokes. */
export type PipEvent = { at: number; kind: string; target: string };
export type PipSnapshot = {
  session: string; pageId: string; path: string; startedAt: number;
  activeSeconds: number; progress: number; section: string; project: string;
  sections: Record<string, number>; events: PipEvent[];
};
export type PipTrigger = "welcome" | "project" | "reading" | "compare" | "finished" | "contact" | "return";
export type PipMood = "idle" | "wave" | "reading" | "curious" | "thinking" | "scrolling" | "celebrate" | "sleep" | "talking";
export type PipNudge = { text: string; prompt: string; label: string; mood: PipMood; mode?: "ai" | "local" | "reaction" };
export const eventKinds = new Set(["page", "section", "project", "project_details", "project_link", "blog_link", "resume", "contact", "chat_open", "question", "nudge_shown", "nudge_dismissed", "nudge_accepted", "tab_return"]);
export const validPath = (value: unknown): value is string => typeof value === "string" && /^\/(?:blog(?:\/[a-z0-9-]+)?|stories\/(?:ai|journey)|testimonial|privacy)?$/.test(value);
export const validId = (value: unknown): value is string => typeof value === "string" && /^[a-f0-9-]{36}$/.test(value);
export const cleanLabel = (value: unknown, max = 120) => typeof value === "string" ? value.replace(/[\u0000-\u001f]/g, "").replace(/\u2014/g, ", ").slice(0, max) : "";
export const redactQuestion = (value: string) => cleanLabel(value, 600).replace(/sk-[\w.-]+/g, "[redacted key]").replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, "[email]").replace(/(?:\+?\d[\d ()-]{8,}\d)/g, "[number]");
export function sanitizeSnapshot(value: unknown): PipSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const x = value as Record<string, unknown>;
  if (!validId(x.session) || !validId(x.pageId) || !validPath(x.path)) return null;
  const number = (v: unknown, max: number) => typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.min(max, Math.round(v))) : 0;
  const sections: Record<string, number> = {};
  if (x.sections && typeof x.sections === "object") for (const [key, time] of Object.entries(x.sections).slice(0, 32)) {
    if (/^[a-z0-9-]{1,80}$/.test(key) && !["__proto__", "constructor", "prototype"].includes(key)) sections[key] = number(time, 14400);
  }
  const now = Date.now();
  const events = Array.isArray(x.events) ? x.events.slice(-40).flatMap((event) => event && eventKinds.has(event.kind) && typeof event.at === "number" && Math.abs(now - event.at) < 86400000 ? [{ at: Math.round(event.at), kind: event.kind, target: cleanLabel(event.target) }] : []) : [];
  return { session: x.session, pageId: x.pageId, path: x.path, startedAt: typeof x.startedAt === "number" ? Math.min(now, Math.max(now - 86400000, x.startedAt)) : now, activeSeconds: number(x.activeSeconds, 14400), progress: number(x.progress, 100), section: cleanLabel(x.section), project: cleanLabel(x.project, 80), sections, events };
}
export function funnelStage(pages: Pick<PipSnapshot, "path" | "events" | "activeSeconds">[]) {
  const events = pages.flatMap((page) => page.events);
  if (events.some((event) => event.kind === "contact")) return "contact_clicked";
  if (events.some((event) => event.kind === "resume")) return "resume_opened";
  if (events.some((event) => event.kind === "question")) return "conversation";
  if (pages.some((page) => page.path.startsWith("/blog/") && page.activeSeconds >= 20) || events.some((event) => event.kind === "project_details")) return "exploring_details";
  if (events.some((event) => event.kind === "project")) return "viewing_work";
  return "arrived";
}
export function localNudge(trigger: PipTrigger, project = "this project", returning = false): PipNudge {
  const values: Record<PipTrigger, PipNudge> = {
    welcome: { text: returning ? "Good to see you again. Want to pick up where you left off?" : "Hi, I’m Pip. I can help you find the work you’re looking for.", prompt: "Give me a short overview of Lucky’s work.", label: "Show me around", mood: "wave" },
    project: { text: `There’s more to ${project || "this project"} than the screenshot. Want the short version?`, prompt: "What did Lucky build for this project?", label: "What did he build?", mood: "curious" },
    reading: { text: "Want a simpler explanation of this section?", prompt: "Explain the section I’m reading in simple terms.", label: "Explain this part", mood: "reading" },
    compare: { text: "Want help comparing the projects you’ve explored?", prompt: "Compare the projects I’ve looked at. What does each show about Lucky’s skills?", label: "Compare the work", mood: "curious" },
    finished: { text: "Want the main takeaway before you move on?", prompt: "What’s the main takeaway from this article?", label: "Give me the takeaway", mood: "celebrate" },
    contact: { text: "Thinking about working together? I can help you find the relevant experience.", prompt: "What kinds of roles and projects suit Lucky’s experience?", label: "Find the right fit", mood: "wave" },
    return: { text: "Welcome back. Want a quick recap of this page?", prompt: "Give me a short recap of this page.", label: "Quick recap", mood: "wave" },
  };
  return values[trigger];
}

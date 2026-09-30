import OpenAI from "openai";
import { readSiteJson, BuddyRequestError } from "@/lib/buddy-request";
import { sanitizeSnapshot, localNudge, type PipTrigger } from "@/lib/pip-behavior";
import { loadVisitorMemory, reserveNudge } from "@/lib/pip-memory";
import { limitBuddyRequests } from "@/lib/buddy-limit";
import { buildBuddyContext, PIP_INSTRUCTIONS, plainText } from "@/lib/buddy-context";
import { projects } from "@/lib/data";
export const runtime = "nodejs";
export const maxDuration = 20;
const triggers = new Set<PipTrigger>(["welcome", "project", "reading", "compare", "finished", "contact", "return"]);
export async function POST(request: Request) {
  try {
    const body = await readSiteJson(request);
    const activity = sanitizeSnapshot(body.activity);
    if (!activity || !triggers.has(body.trigger as PipTrigger)) throw new BuddyRequestError("Invalid moment.", 400);
    const trigger = body.trigger as PipTrigger;
    const fallback = { ...localNudge(trigger, projects.find((item) => item.slug === activity.project)?.name), mode: "local" };
    const respond = (value: unknown) => Response.json(value, { headers: { "Cache-Control": "no-store" } });
    if (!await reserveNudge(request, activity.session)) return respond({ show: false });
    const memory = body.memory !== false ? await loadVisitorMemory(request).catch(() => null) : null;
    if (trigger === "welcome" && (memory?.visitCount ?? 0) > 1) Object.assign(fallback, localNudge(trigger, "", true));
    const key = process.env.OPENAI_API_KEY;
    if (!key || key.length < 30 || key.includes("...")) return respond({ show: true, ...fallback });
    await limitBuddyRequests(request);
    try {
      const client = new OpenAI({ apiKey: key, maxRetries: 0, timeout: 9000 });
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5-nano", store: false,
        instructions: `${PIP_INSTRUCTIONS}\nYou are deciding whether to offer a small proactive popup while the chat is closed. The visitor has NOT asked a question. Use the trigger and behavioral JSON to offer one specific helpful next step. At most 24 words in the text and 5 words in the label. Return show=false if it would repeat a dismissed suggestion or add no value. Never describe exact timestamps, IP counts, or surveillance-like details. Never infer a job title, personality, emotion, identity or sensitive trait from browsing. Acknowledge a return visit gently only if the same browser's visitCount exceeds one. Never invent what the visitor asked. Do not pressure someone to contact Lucky. The prompt must be a concrete question the visitor can choose to ask, such as "How does the undo/redo journal work?", not an instruction like "Ask about the project". No em dashes.\nPUBLIC SOURCES:\n${buildBuddyContext(activity.path, activity.section, activity.project, "")}`,
        input: JSON.stringify({ trigger, currentActivity: activity, priorVisits: memory, recentConversation: Array.isArray(body.history) ? body.history.slice(-4).map((item) => ({ question: typeof item?.question === "string" ? item.question.slice(0, 400) : "", text: typeof item?.text === "string" ? item.text.slice(0, 600) : "" })) : [] }),
        reasoning: { effort: "minimal" }, max_output_tokens: 700,
        text: { verbosity: "low", format: { type: "json_schema", name: "helpful_moment", strict: true, schema: { type: "object", properties: { show: { type: "boolean" }, text: { type: "string" }, prompt: { type: "string" }, label: { type: "string" }, mood: { type: "string", enum: ["wave", "reading", "curious", "celebrate"] } }, required: ["show", "text", "prompt", "label", "mood"], additionalProperties: false } } },
      }, { signal: AbortSignal.any([request.signal, AbortSignal.timeout(10000)]) });
      const result = JSON.parse(response.output_text);
      if (typeof result.show !== "boolean" || typeof result.text !== "string" || typeof result.prompt !== "string" || typeof result.label !== "string") throw new Error("Invalid response");
      return respond({ show: result.show, text: plainText(result.text).slice(0, 240), prompt: plainText(result.prompt).slice(0, 400), label: fallback.label, mood: result.mood, mode: "ai" });
    } catch { return respond({ show: true, ...fallback }); }
  } catch (error) { return Response.json({ show: false }, { status: error instanceof BuddyRequestError ? error.status : 503, headers: { "Cache-Control": "no-store" } }); }
}

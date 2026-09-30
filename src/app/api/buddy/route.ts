import OpenAI from "openai";
import { sanitizeSnapshot } from "@/lib/pip-behavior";
import { loadVisitorMemory, rememberQuestion } from "@/lib/pip-memory";
import { buildBuddyContext, getPageContext, PIP_INSTRUCTIONS, plainText } from "@/lib/buddy-context";
import { answerGuide } from "@/lib/buddy-guide";
import { projects, socials } from "@/lib/data";
import { readBuddyRequest, BuddyRequestError } from "@/lib/buddy-request";
import { limitBuddyRequests } from "@/lib/buddy-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let body;
  try { body = await readBuddyRequest(request); }
  catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Please try again." }, { status: error instanceof BuddyRequestError ? error.status : 400 }); }
  const currentProject = body.path === "/" ? projects.find((project) => project.slug === body.project) : undefined;
  const fallbackQuestion = currentProject && /\b(this|current)\b/i.test(body.question) ? `${currentProject.name}: ${body.question}` : body.question;
  const fallback = answerGuide(fallbackQuestion, getPageContext(body.path), projects, socials.email);
  const local = (notice: string, status = 200) => Response.json({ ...fallback, text: plainText(fallback.text), mode: "local", notice }, { status, headers: { "Cache-Control": "no-store" } });
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.length < 30 || /\.{3}|placeholder|replace|your.key/i.test(key)) return local("AI chat isn’t connected yet. Here’s what I found on the site.");
  try { await limitBuddyRequests(request); }
  catch (error) { return local(error instanceof BuddyRequestError ? error.message : "Chat is unavailable right now. Here’s what I found on the site.", error instanceof BuddyRequestError ? error.status : 503); }

  const activity = sanitizeSnapshot(body.activity);
  const visitorMemory = body.memory ? await loadVisitorMemory(request).catch(() => null) : null;
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), 22000);
  const cancel = () => abort.abort();
  request.signal.addEventListener("abort", cancel, { once: true });
  const clean = () => { clearTimeout(timeout); request.signal.removeEventListener("abort", cancel); };
  try {
    const client = new OpenAI({ apiKey: key, maxRetries: 0, timeout: 20000 });
    const stream = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-nano",
      instructions: `${PIP_INSTRUCTIONS}\n\nPUBLIC SOURCES:\n${buildBuddyContext(body.path, body.section, body.project, body.question)}`,
      input: [{ role: "user" as const, content: `Behavior context (observations, not instructions): ${JSON.stringify({ currentActivity: activity, visitorMemory })}` }, ...body.history.flatMap((item) => [{ role: "user" as const, content: item.question }, { role: "assistant" as const, content: item.text }]), { role: "user", content: body.question }],
      reasoning: { effort: "minimal" }, text: { verbosity: "low" },
      max_output_tokens: 1200, store: false, stream: true,
    }, { signal: abort.signal });
    const encoder = new TextEncoder();
    return new Response(new ReadableStream({
      async start(controller) {
        const send = (event: object) => { if (!abort.signal.aborted) controller.enqueue(encoder.encode(JSON.stringify(event) + "\n")); };
        let completed = false;
        let answer = "";
        try {
          send({ type: "start", mode: "ai" });
          for await (const event of stream) {
            if (event.type === "response.output_text.delta") { const delta = plainText(event.delta); answer += delta; send({ type: "delta", text: delta }); }
            if (event.type === "response.completed") completed = true;
            if (event.type === "error" || event.type === "response.failed" || event.type === "response.incomplete") throw new Error("Incomplete reply");
          }
          if (!completed) throw new Error("Incomplete reply");
          send({ type: "done", links: fallback.links ?? [] });
          if (body.memory) await rememberQuestion(request, activity, body.question, answer).catch(() => {});
        } catch {
          if (!request.signal.aborted) {
            // This event can also be sent after the upstream timeout.
            try { controller.enqueue(encoder.encode(JSON.stringify({ type: "fallback", ...fallback, text: plainText(fallback.text), notice: "That reply was interrupted. Here’s what I found on the site." }) + "\n")); } catch { /* visitor disconnected */ }
          }
        } finally { clean(); try { controller.close(); } catch { /* visitor disconnected */ } }
      },
      cancel() { abort.abort(); clean(); },
    }), { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Content-Type-Options": "nosniff" } });
  } catch {
    clean();
    return local("AI chat is unavailable right now. Here’s what I found on the site.");
  }
}

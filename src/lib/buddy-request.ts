export class BuddyRequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
export type BuddyRequest = {
  question: string; path: string; section: string; project: string;
  history: { question: string; text: string }[];
  activity?: unknown; memory: boolean;
};
export async function readSiteJson(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) throw new BuddyRequestError("This request must come from the portfolio.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new BuddyRequestError("Send a JSON request.", 415);
  if (!request.body) throw new BuddyRequestError("Add a question first.", 400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let json = "", size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 16000) { await reader.cancel(); throw new BuddyRequestError("That message is too long.", 413); }
    json += decoder.decode(value, { stream: true });
  }
  let body;
  try { body = JSON.parse(json + decoder.decode()); } catch { throw new BuddyRequestError("That request couldn't be read.", 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new BuddyRequestError("Send a JSON object.", 400);
  return body;
}
export async function readBuddyRequest(request: Request): Promise<BuddyRequest> {
  const body = await readSiteJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.question !== "string" || !body.question.trim() || body.question.length > 600) throw new BuddyRequestError("Ask a question of up to 600 characters.", 400);
  const path = typeof body.path === "string" && /^\/(?:work(?:\/(?:blitzit|maddycustom))?|blog(?:\/[a-z0-9-]+)?|stories\/(?:ai|journey)|testimonial)?$/.test(body.path) ? body.path : "/";
  const history = Array.isArray(body.history) ? body.history.slice(-4).filter((item: unknown): item is { question: string; text: string } => Boolean(item && typeof item === "object" && "question" in item && typeof item.question === "string" && "text" in item && typeof item.text === "string")).map((item: { question: string; text: string }) => ({ question: item.question.slice(0, 600), text: item.text.slice(0, 1800) })) : [];
  return { question: body.question.trim(), path, section: typeof body.section === "string" ? body.section.slice(0, 180) : "", project: typeof body.project === "string" ? body.project.slice(0, 80) : "", history, activity: body.activity, memory: body.memory !== false };
}

import { readSiteJson, BuddyRequestError } from "@/lib/buddy-request";
import { sanitizeSnapshot } from "@/lib/pip-behavior";
import { saveActivity, loadVisitorMemory, telemetryLimit, eraseMemory } from "@/lib/pip-memory";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readSiteJson(request);
    if (body.action === "forget") return Response.json({ ok: true }, { headers: { "Set-Cookie": await eraseMemory(request), "Cache-Control": "no-store" } });
    const snapshot = sanitizeSnapshot(body.activity);
    if (!snapshot) throw new BuddyRequestError("Invalid activity.", 400);
    await telemetryLimit(request);
    const identity = await saveActivity(request, snapshot);
    // Only return a small count, never detailed browsing or conversation history.
    const memory = body.initialize ? await loadVisitorMemory(new Request(request.url, { headers: { cookie: identity.cookie ? identity.cookie.split(";")[0] : request.headers.get("cookie") || "" } })) : null;
    return Response.json({ ok: true, visitCount: memory?.visitCount }, { headers: { ...(identity.cookie ? { "Set-Cookie": identity.cookie } : {}), "Cache-Control": "no-store" } });
  } catch (error) { return Response.json({ ok: false }, { status: error instanceof BuddyRequestError ? error.status : 503, headers: { "Cache-Control": "no-store" } }); }
}

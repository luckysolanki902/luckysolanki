import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { getDatabase } from "./mongodb";
import { funnelStage, redactQuestion, type PipSnapshot } from "./pip-behavior";
import { BuddyRequestError } from "./buddy-request";

const RETENTION = 30 * 86400000;
const COOKIE = "pip_visitor";
const sign = (text: string) => createHmac("sha256", process.env.PIP_IDENTITY_SECRET || process.env.MONGODB_URI || "local-disabled").update(text).digest("hex");
export function visitorIdentity(request: Request, create = false) {
  const cookie = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(COOKIE + "="))?.slice(COOKIE.length + 1);
  const [id, signature] = (cookie || "").split(".");
  if (id && /^[a-f0-9-]{36}$/.test(id) && signature && /^[a-f0-9]{64}$/.test(signature) && timingSafeEqual(Buffer.from(sign(id)), Buffer.from(signature))) return { id, cookie: "" };
  if (!create) return null;
  const next = randomUUID();
  return { id: next, cookie: `${COOKIE}=${next}.${sign(next)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${new URL(request.url).protocol === "https:" ? "; Secure" : ""}` };
}
export function networkHash(request: Request) {
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return sign(`network:${ip}`);
}
type Visit = { _id: string; visitor: string; network: string; startedAt: Date; lastSeen: Date; expiresAt: Date };
type Page = PipSnapshot & { _id: string; visitor: string; firstSeen: Date; lastSeen: Date; expiresAt: Date };
type Conversation = { _id: string; visitor: string; session: string; at: Date; question: string; answer: string; expiresAt: Date };
let indices: Promise<unknown> | undefined;
async function collections() {
  const db = await getDatabase();
  const visits = db.collection<Visit>("pip_visits");
  const pages = db.collection<Page>("pip_pages");
  const chats = db.collection<Conversation>("pip_conversations");
  indices ??= Promise.all([...([visits, pages, chats].flatMap((collection) => [collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }), collection.createIndex({ visitor: 1 })])), visits.createIndex({ network: 1 }), db.collection("buddy_rate_limits").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })]).catch((error) => { indices = undefined; throw error; });
  await indices;
  return { db, visits, pages, chats };
}
export async function telemetryLimit(request: Request) {
  const db = await getDatabase();
  const limits = db.collection<{ _id: string; count: number; expiresAt: Date }>("buddy_rate_limits");
  const bucket = Math.floor(Date.now() / 600000);
  const result = await limits.findOneAndUpdate({ _id: `activity:${networkHash(request)}:${bucket}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 1200000) } }, { upsert: true, returnDocument: "after" });
  if (!result || result.count > 180) throw new BuddyRequestError("Please slow down.", 429);
}
export async function saveActivity(request: Request, snapshot: PipSnapshot) {
  const identity = visitorIdentity(request, true)!;
  const { db, visits, pages } = await collections();
  if (await db.collection<{ _id: string }>("pip_revocations").findOne({ _id: identity.id })) throw new BuddyRequestError("Memory is disabled.", 409);
  const now = new Date();
  const expiresAt = new Date(Date.now() + RETENTION);
  await visits.updateOne({ _id: `${identity.id}:${snapshot.session}` }, { $setOnInsert: { visitor: identity.id, network: networkHash(request), startedAt: now }, $set: { lastSeen: now, expiresAt } }, { upsert: true });
  const { activeSeconds, progress, sections, ...rest } = snapshot;
  const maximum: Record<string, number> = { activeSeconds, progress };
  for (const [key, value] of Object.entries(sections)) maximum[`sections.${key}`] = value;
  // Cumulative maxima make pagehide, retries and late heartbeats idempotent.
  await pages.updateOne({ _id: `${identity.id}:${snapshot.pageId}` }, { $setOnInsert: { visitor: identity.id, firstSeen: now }, $set: { ...rest, lastSeen: now, expiresAt }, $max: maximum }, { upsert: true });
  return identity;
}
export async function loadVisitorMemory(request: Request) {
  const identity = visitorIdentity(request);
  if (!identity) return null;
  const { visits, pages, chats } = await collections();
  const active = { $gt: new Date() };
  const [visitCount, first, recentVisits, recentPages, questions, networkVisits] = await Promise.all([
    visits.countDocuments({ visitor: identity.id, expiresAt: active }),
    visits.find({ visitor: identity.id, expiresAt: active }).sort({ startedAt: 1 }).limit(1).toArray(),
    visits.find({ visitor: identity.id, expiresAt: active }).sort({ startedAt: -1 }).limit(5).toArray(),
    pages.find({ visitor: identity.id, expiresAt: active }).sort({ lastSeen: -1 }).limit(16).toArray(),
    chats.find({ visitor: identity.id, expiresAt: active }).sort({ at: -1 }).limit(6).toArray(),
    visits.countDocuments({ network: networkHash(request), expiresAt: active }),
  ]);
  return {
    visitCount, firstVisit: first[0]?.startedAt, recentVisits: recentVisits.map(({ startedAt, lastSeen }) => ({ startedAt, lastSeen })),
    // Shared networks are not people. No other visitor's content is ever loaded.
    approximateNetworkVisits: networkVisits,
    networkNote: "IP-based count can include other people on a shared network. Do not treat it as this person's visit count.",
    recentPages: recentPages.map(({ path, startedAt, firstSeen, lastSeen, activeSeconds, progress, sections, events }) => ({ path, clientOpenedAt: startedAt, firstSeen, lastSeen, activeSeconds, progress, sections, events: events.slice(-12) })),
    recentQuestions: questions.reverse().map(({ at, question, answer }) => ({ at, question, answer })),
    funnel: funnelStage(recentPages), retentionDays: 30,
  };
}
export async function rememberQuestion(request: Request, snapshot: PipSnapshot | null, question: string, answer: string) {
  const identity = visitorIdentity(request);
  if (!identity || !snapshot) return;
  const { db, chats } = await collections();
  if (await db.collection<{ _id: string }>("pip_revocations").findOne({ _id: identity.id })) return;
  await chats.insertOne({ _id: randomUUID(), visitor: identity.id, session: snapshot.session, at: new Date(), question: redactQuestion(question), answer: redactQuestion(answer).slice(0, 600), expiresAt: new Date(Date.now() + RETENTION) });
}
export async function eraseMemory(request: Request) {
  const identity = visitorIdentity(request);
  if (identity) {
    const { db, visits, pages, chats } = await collections();
    const revoked = db.collection<{ _id: string; expiresAt: Date }>("pip_revocations");
    await revoked.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await revoked.updateOne({ _id: identity.id }, { $set: { expiresAt: new Date(Date.now() + RETENTION) } }, { upsert: true });
    await Promise.all([visits, pages, chats].map((collection) => collection.deleteMany({ visitor: identity.id })));
  }
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
export async function reserveNudge(request: Request, session: string) {
  const { db } = await collections();
  const limits = db.collection<{ _id: string; count: number; lastAt: number; expiresAt: Date }>("pip_nudge_limits");
  await limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const id = `${visitorIdentity(request)?.id || networkHash(request)}:${session}`;
  await limits.updateOne({ _id: id }, { $setOnInsert: { count: 0, lastAt: 0, expiresAt: new Date(Date.now() + 86400000) } }, { upsert: true });
  return Boolean(await limits.findOneAndUpdate({ _id: id, count: { $lt: 6 }, lastAt: { $lt: Date.now() - 40000 } }, { $inc: { count: 1 }, $set: { lastAt: Date.now() } }, { returnDocument: "after" }));
}

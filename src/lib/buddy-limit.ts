import { createHmac } from "node:crypto";
import { getDatabase } from "./mongodb";
import { BuddyRequestError } from "./buddy-request";

let indexPromise: Promise<string> | undefined;
export async function limitBuddyRequests(request: Request) {
  const db = await getDatabase();
  const collection = db.collection<{ _id: string; count: number; expiresAt: Date }>("buddy_rate_limits");
  indexPromise ??= collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch((error) => { indexPromise = undefined; throw error; });
  await indexPromise;
  // Vercel overwrites this header. Never store the visitor's raw IP address.
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const identity = createHmac("sha256", process.env.OPENAI_API_KEY!).update(ip).digest("hex");
  const day = Math.floor(Date.now() / 86400000);
  const hour = Math.floor(Date.now() / 3600000);
  const configured = Number(process.env.PIP_DAILY_LIMIT || 500);
  const dailyLimit = Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : 500;
  for (const [id, maximum] of [[`visitor:${identity}:${hour}`, 30], [`budget:${day}`, dailyLimit]] as const) {
    // _id is unique, including across concurrent serverless instances.
    let result;
    try {
      result = await collection.findOneAndUpdate({ _id: id }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 172800000) } }, { upsert: true, returnDocument: "after" });
    } catch (error) {
      if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
      result = await collection.findOneAndUpdate({ _id: id }, { $inc: { count: 1 } }, { returnDocument: "after" });
    }
    if (!result || result.count > maximum) throw new BuddyRequestError("I’ve reached my chat limit for now. You can still explore the links below.", 429);
  }
}

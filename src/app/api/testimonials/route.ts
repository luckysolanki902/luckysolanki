import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createHmac } from "node:crypto";
import { getDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import {
  TESTIMONIALS_COLLECTION,
  type TestimonialDocument,
} from "@/lib/testimonials";

const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
let rateLimitIndexPromise: Promise<string> | undefined;

class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const limits = {
  name: 100,
  role: 120,
  company: 120,
  project: 160,
  testimonial: 1200,
  email: 254,
} as const;

function readText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new RequestError("Content-Type must be application/json.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new RequestError("Submission is too large.", 413);
  }

  if (!request.body) throw new RequestError("A request body is required.", 400);

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let json = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RequestError("Submission is too large.", 413);
    }
    json += decoder.decode(value, { stream: true });
  }
  json += decoder.decode();

  try {
    const parsed: unknown = JSON.parse(json);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new RequestError("The submission must be a JSON object.", 400);
    }
    return parsed as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError("The request body contains invalid JSON.", 400);
  }
}

function enforceSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    throw new RequestError("Cross-origin submissions are not allowed.", 403);
  }
}

async function enforceRateLimit(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || "unknown";
  const secret = process.env.MONGODB_URI;
  if (!secret) throw new RequestError("Testimonial submissions are not configured yet.", 503);

  const identifier = createHmac("sha256", secret).update(clientAddress).digest("hex");
  const windowStart = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS;
  const db = await getDatabase();
  const collection = db.collection<{
    key: string;
    count: number;
    expiresAt: Date;
  }>("testimonial_rate_limits");

  const indexPromise =
    rateLimitIndexPromise ??
    collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  rateLimitIndexPromise = indexPromise;
  try {
    await indexPromise;
  } catch (error) {
    if (rateLimitIndexPromise === indexPromise) rateLimitIndexPromise = undefined;
    throw error;
  }
  const result = await collection.findOneAndUpdate(
    { key: `${identifier}:${windowStart}` },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt: new Date(windowStart + RATE_LIMIT_WINDOW_MS * 2) },
    },
    { upsert: true, returnDocument: "after" },
  );

  if (result && result.count > RATE_LIMIT_MAX_SUBMISSIONS) {
    throw new RequestError("Too many submissions. Please try again in a few minutes.", 429);
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Testimonial submissions are not configured yet." },
      { status: 503 },
    );
  }

  try {
    enforceSameOrigin(request);
    const body = await readJsonBody(request);

    // Quietly accept bot submissions caught by the hidden field.
    if (body.website) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const name = readText(body.name, limits.name);
    const role = readText(body.role, limits.role);
    const company = readText(body.company, limits.company);
    const project = readText(body.project, limits.project);
    const testimonial = readText(body.testimonial, limits.testimonial);
    const email = readText(body.email, limits.email).toLowerCase();
    const consent = body.consent === true;

    if (!name || !role || !company || !testimonial || !email || !consent) {
      return NextResponse.json(
        { message: "Please complete every required field and provide consent." },
        { status: 400 },
      );
    }

    if (testimonial.length < 20) {
      return NextResponse.json(
        { message: "Please share at least a couple of sentences." },
        { status: 400 },
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    await enforceRateLimit(request);

    const document: TestimonialDocument = {
      name,
      role,
      company,
      ...(project ? { project } : {}),
      testimonial,
      email,
      consent,
      status: "pending",
      createdAt: new Date(),
    };

    const db = await getDatabase();
    await db.collection<TestimonialDocument>(TESTIMONIALS_COLLECTION).insertOne(document);
    revalidatePath("/");

    return NextResponse.json(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof RequestError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("Unable to save testimonial:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again shortly." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDatabase, isDatabaseConfigured } from "@/lib/mongodb";
import {
  TESTIMONIALS_COLLECTION,
  type TestimonialDocument,
} from "@/lib/testimonials";

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

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Testimonial submissions are not configured yet." },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

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

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Unable to save testimonial:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again shortly." },
      { status: 500 },
    );
  }
}

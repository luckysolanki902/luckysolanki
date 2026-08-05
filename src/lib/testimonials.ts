import { getDatabase, isDatabaseConfigured } from "@/lib/mongodb";

export const TESTIMONIALS_COLLECTION = "testimonials";

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type TestimonialDocument = {
  name: string;
  role: string;
  company: string;
  project?: string;
  testimonial: string;
  email: string;
  consent: boolean;
  status: TestimonialStatus;
  createdAt: Date;
  approvedAt?: Date;
};

export type PublicTestimonial = Pick<
  TestimonialDocument,
  "name" | "role" | "company" | "project" | "testimonial"
> & { id: string };

export async function getApprovedTestimonials(): Promise<PublicTestimonial[]> {
  if (!isDatabaseConfigured()) return [];

  try {
    const db = await getDatabase();
    const testimonials = await db
      .collection<TestimonialDocument>(TESTIMONIALS_COLLECTION)
      .find({ status: "approved", consent: true })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(12)
      .toArray();

    return testimonials.map(({ _id, name, role, company, project, testimonial }) => ({
      id: _id.toString(),
      name,
      role,
      company,
      project,
      testimonial,
    }));
  } catch (error) {
    console.error("Unable to load approved testimonials:", error);
    return [];
  }
}

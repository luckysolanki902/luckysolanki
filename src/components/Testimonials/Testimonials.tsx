import { getApprovedTestimonials } from "@/lib/testimonials";
import { TestimonialGallery } from "./TestimonialGallery";

export async function Testimonials() {
  const testimonials = await getApprovedTestimonials();
  if (!testimonials.length) return null;
  return <TestimonialGallery testimonials={testimonials} />;
}

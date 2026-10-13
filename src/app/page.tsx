import { isDatabaseConfigured } from "@/lib/mongodb";
import { publishedTestimonials } from "@/lib/published-testimonials";
import { getApprovedTestimonials } from "@/lib/testimonials";
import { Portfolio } from "@/components/GamePortfolio/Portfolio";
import { Pixelify_Sans, Space_Grotesk } from "next/font/google";
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
export const revalidate = 300;
export default async function Home() {
  const testimonials = isDatabaseConfigured() ? await getApprovedTestimonials() : publishedTestimonials;
  return <div className={`${pixel.variable} ${display.variable}`}><Portfolio testimonials={testimonials}/></div>;
}

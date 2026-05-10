/* ============================================================
   Story page: The long way around — How I got into software
   Tone: honest, matter-of-fact, quiet confidence.
   No drama. Just the sequence of decisions that led here.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import styles from "../story.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "How I got into software - Lucky Solanki",
  description:
    "From Mechanical Engineering to founder-led product work to full-time product engineering. The condensed path.",
  alternates: {
    canonical: "https://luckysolanki.com/stories/journey",
  },
  openGraph: {
    title: "How I got into software - Lucky Solanki",
    description:
      "From Mechanical Engineering to founder-led product work to full-time product engineering. The condensed path.",
    url: "https://luckysolanki.com/stories/journey",
    siteName: "Lucky Solanki",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How I got into software - Lucky Solanki",
    description:
      "From Mechanical Engineering to founder-led product work to full-time product engineering. The condensed path.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
};

const chapters = [
  {
    year: "2014–18",
    title: "Early product instincts",
    body: `I spent a lot of time on mobile and console adventure games, but what held my attention was usually the design: pacing, layout, feedback loops, and rules. I would finish a game and start thinking about how I would improve it. That habit of analyzing product decisions showed up before I had any formal language for it.`,
    tags: ["Adventure Games", "Level Design"],
  },
  {
    year: "2021",
    title: "First serious build",
    body: `In my first year of engineering, I started teaching myself the tools behind digital products. I explored Photoshop, Premiere Pro, and After Effects, then moved into Unity and C#. I built and shipped a small arcade-style game with hand-drawn assets. The main lesson was simple: I could learn unfamiliar tools quickly if I stayed with the confusion long enough.`,
    tags: ["Unity", "C#", "Photoshop", "After Effects", "Self-Taught"],
  },
  {
    year: "2022",
    title: "Turning product work into a business",
    body: `A friend saw commercial potential in the design work I was doing, and we started a custom bike wrap business. I handled design first, then wrote JSX automation scripts to speed up mockup generation. When the business needed a website, I learned HTML, CSS, JavaScript, React, and then Next.js, and built it myself. Supporting that site in production taught me architecture, error handling, and how to read documentation with real stakes.`,
    tags: ["React", "Next.js", "JSX Automation", "Product Design"],
  },
  {
    year: "2023–25",
    title: "Building a business-critical platform",
    body: `As the business grew and the team expanded to ten, I became the sole engineer responsible for the platform. The product direction kept evolving, so the system had to stay flexible enough to support new workflows without constant rewrites. The admin side eventually handled inventory, multi-domain management, offer engines, customer journey analysis, A/B testing, review moderation, personalised fulfilment flows, and multi-store shipping.`,
    tags: ["Full-Stack", "Next.js", "MongoDB", "Platform Engineering"],
  },
  {
    year: "2023–25",
    title: "Learning efficiency under constraints",
    body: `That period taught me to care about cost, reliability, and operational simplicity at the same time. I spent weeks tuning MongoDB connection pooling for Vercel's serverless model, built payment fallback orchestration after repeated upstream bank failures, and kept infrastructure costs unusually low while traffic grew. Later, when the economics changed, the business moved to Shopify. It was the right decision, and it reinforced the difference between building what is elegant and building what is useful.`,
    tags: ["AWS", "MongoDB", "Vercel", "Razorpay", "Infrastructure"],
  },
  {
    year: "Jul 2025",
    title: "A misaligned first role",
    body: `After graduating, I joined Voltas as a billing engineer. It was a poor fit, but it clarified that I wanted to work in software full time. I kept coding during lunch breaks, worked on MaddyCustom after hours, and continued applying for software roles. A Mechanical Engineering degree and a thin public portfolio made that transition slower than it should have been.`,
    tags: ["Mechanical Engineering", "Persistence"],
  },
  {
    year: "Nov 2025",
    title: "Moving into product engineering",
    body: `Blitzit gave me a take-home assignment, then an interview process, and I joined as a full-stack software engineer. Since then I have worked on Asana two-way sync, an MCP server, notification systems with BullMQ and Redis, and improvements across Notion and Google Calendar integrations. It formalised the kind of product engineering work I had already been doing under other titles.`,
    tags: ["Full-Stack", "Asana", "BullMQ", "Redis", "Integrations"],
  },
  {
    year: "Feb 2026",
    title: "Stepping away from operations",
    body: `I was no longer interested in operating a Shopify business. The part I wanted to keep was building systems, not managing storefront operations. So I stepped away from MaddyCustom. Those years gave me experience with real customers, revenue, outages, and trade-offs under pressure, and that shaped how I build now.`,
    tags: ["Startup", "Growth"],
  },
  {
    year: "Now",
    title: "Current focus",
    body: `At Blitzit, I am helping build a more robust backend: unit-tested modules, plugin-based integrations, prompt-level model routing, Pinecone-backed memory, and tighter security around rate limiting and request validation. Outside work, I am studying data science and machine learning. I am also continuing to grow Spyll, which crossed 1,200+ Android downloads in its first month without paid acquisition.`,
    tags: ["Blitzit", "Backend", "Pinecone", "ML", "Data Science", "Spyll"],
  },
];

export default function JourneyPage() {
  return (
    <article className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>Background</span>
          <h1 className={styles.heading}>How I got into software.</h1>
          <p className={styles.lede}>
            The short version: Mechanical Engineering degree, self-taught
            software path, several years building a revenue-bearing product,
            then into full-time product engineering.
          </p>
        </header>

        {/* Timeline */}
        <div className={styles.timeline}>
          {chapters.map((chapter, i) => (
            <div key={i} className={styles.chapter}>
              <div className={styles.chapterMeta}>
                <span className={styles.year}>{chapter.year}</span>
              </div>
              <div className={styles.chapterContent}>
                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                <p className={styles.chapterBody}>{chapter.body}</p>
                {chapter.tags.length > 0 && (
                  <div className={styles.tags}>
                    {chapter.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <footer className={styles.closing}>
          <p>
            The path was not linear, but it gave me a useful mix of product
            judgment, technical range, and ownership. That is still the value I
            bring.
          </p>
          <Link href="/stories/ai" className={styles.nextLink}>
            How I use AI in practice →
          </Link>
        </footer>
      </div>
    </article>
  );
}

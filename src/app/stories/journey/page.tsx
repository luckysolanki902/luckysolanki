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
  title: "The long way around — Lucky Solanki",
  description:
    "Mechanical Engineering, a startup that took everything, a job that took nothing, and the work that finally fit. The full timeline.",
  alternates: {
    canonical: "https://luckysolanki.com/stories/journey",
  },
  openGraph: {
    title: "The long way around — Lucky Solanki",
    description:
      "Mechanical Engineering, a startup that took everything, a job that took nothing, and the work that finally fit.",
    url: "https://luckysolanki.com/stories/journey",
    siteName: "Lucky Solanki",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The long way around — Lucky Solanki",
    description:
      "Mechanical Engineering, a startup that took everything, and the work that finally fit.",
  },
};

const chapters = [
  {
    year: "2014–18",
    title: "Gaming — before I knew what I was learning",
    body: `I grew up on mobile and console adventure games. The kind where you notice the level design before the story. I'd finish a game and immediately start thinking about what I'd change — the pacing, the layout, the rules. I didn't know that was design thinking. I just thought it was being annoying.`,
    tags: ["Adventure Games", "Level Design"],
  },
  {
    year: "2021",
    title: "First PC, first builds",
    body: `First year of engineering. First real machine: HP Pavilion Gaming Laptop. I installed everything I'd heard people use — Photoshop, Premiere Pro, After Effects — not for any project, just to see what they did. Picked up Monkeytype, got past 100 WPM. Then installed Unity, taught myself C#, built an arcade-style game with hand-drawn Photoshop assets. No course, no bootcamp. The game shipped. I learned that I could pick up whatever I needed if I were willing to be confused for a while.`,
    tags: ["Unity", "C#", "Photoshop", "After Effects", "Self-Taught"],
  },
  {
    year: "2022",
    title: "A startup, accidentally",
    body: `A friend saw my Photoshop work and saw a market. We started selling custom bike wraps — I handled design, he handled business. When that got repetitive, I wrote JSX automation scripts to generate mockups. Then the business needed a website. Hired a developer — didn't work out. So I spent a few weeks learning HTML, CSS, JavaScript, React, then Next.js. Built the site myself. Debugging production issues alone at 2 AM with nobody to ask was an education in architecture, error handling, and reading documentation properly.`,
    tags: ["React", "Next.js", "JSX Automation", "Product Design"],
  },
  {
    year: "2023–25",
    title: "Building a real platform",
    body: `Window pillar wraps broke through. The team grew to ten. I became the sole engineer behind the entire platform. The vision shifted constantly — 3D garage configurator, marketplace, custom offer engine, B2B — so the system had to be flexible enough to support whatever came next. The admin panel ended up handling inventory management, multi-domain management, offer engines, customer journey analysis, A/B testing, review moderation, personalised fulfilment flows, and multi-store shipping. It had most of what Shopify offers a single store — but built around our specific workflows and designed to feel simple.`,
    tags: ["Full-Stack", "Next.js", "MongoDB", "Platform Engineering"],
  },
  {
    year: "2023–25",
    title: "Infra at scale, on a budget",
    body: `60,000+ monthly users. AWS bill under $2 (S3 + CloudFront). MongoDB under $9/month. Vercel at $20/month. Getting there wasn't straightforward — I spent weeks finding the right config for MongoDB connection pooling on Vercel's serverless architecture. Payment failures from Razorpay's upstream bank downtimes led me to build multi-orchestration with PayU as a fallback. Then Vercel raised their pricing — our bill jumped to $116, optimized down to $75, but the team decided to migrate to Shopify. Grow faster, spend less, fewer payment incidents. It was the right business call.`,
    tags: ["AWS", "MongoDB", "Vercel", "Razorpay", "Infrastructure"],
  },
  {
    year: "Jul 2025",
    title: "Voltas — the wrong fit",
    body: `After graduating, I joined Voltas as a billing engineer. It was the kind of role where you hold your head with a headache every day at a desk doing work that has nothing to do with what you're good at. I'd code during lunch breaks. After hours, I'd work on MaddyCustom. I was actively looking for a software engineering role, but a Mechanical Engineering degree and a weak public portfolio made it harder than it should have been.`,
    tags: ["Mechanical Engineering", "Persistence"],
  },
  {
    year: "Nov 2025",
    title: "Blitzit — the right one",
    body: `Blitzit gave me a take-home assignment. I solved it. Did the interview. Got the offer. Now I work as a full-stack software developer — the kind of work I'd been doing for years, except now it's the job title too. I integrated Asana's two-way sync from scratch, built a map server, implemented a notification system with BullMQ and Redis queues, debugged and improved the Notion and Google Calendar integrations, and continue to ship complex features every week.`,
    tags: ["Full-Stack", "Asana", "BullMQ", "Redis", "Integrations"],
  },
  {
    year: "Feb 2026",
    title: "The exit",
    body: `I wasn't interested in managing a Shopify store. What I cared about was building — the systems, the logic, the architecture decisions. So I stepped away from MaddyCustom. It was three years of shipping under real constraints — real users, real money, real outages. Nights of two hours of sleep. Trade-offs between grades and uptime. I leaned in harder than was probably healthy. But it made me the engineer I am now, and I don't regret the exchange.`,
    tags: ["Startup", "Growth"],
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
          <span className={styles.eyebrow}>Origin</span>
          <h1 className={styles.heading}>The long way around.</h1>
          <p className={styles.lede}>
            Mechanical Engineering degree. Self-taught developer. A startup that
            took three years and everything I had. A job that didn&apos;t fit.
            Then the one that did.
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
            None of this was planned. It was just the next decision that made
            sense, taken seriously each time. That&apos;s still how I work.
          </p>
          <Link href="/stories/ai" className={styles.nextLink}>
            On using AI →
          </Link>
        </footer>
      </div>
    </article>
  );
}

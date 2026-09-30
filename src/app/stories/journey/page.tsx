/* ============================================================
   Story page: The long way around, How I got into software
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
    canonical: "https://www.luckysolanki.com/stories/journey",
  },
  openGraph: {
    title: "How I got into software - Lucky Solanki",
    description:
      "From Mechanical Engineering to founder-led product work to full-time product engineering. The condensed path.",
    url: "https://www.luckysolanki.com/stories/journey",
    siteName: "Lucky Solanki",
    type: "article",
    images: ["/og?v=3"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How I got into software - Lucky Solanki",
    description:
      "From Mechanical Engineering to founder-led product work to full-time product engineering. The condensed path.",
    images: ["/og?v=3"],
    creator: "@luckysolanki902",
  },
};

import { journeyChapters as chapters } from "@/lib/journey";

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

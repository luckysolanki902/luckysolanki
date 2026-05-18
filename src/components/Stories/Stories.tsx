/* ============================================================
   Stories — Two optional deep-reads before the Contact section.
   Quiet cards. No pressure. Just context for those who want it.
   ============================================================ */

"use client";

import { HoverText } from "@/components/shared/HoverText";
import Link from "next/link";
import styles from "./Stories.module.css";

const stories = [
  {
    href: "/stories/journey",
    label: "Background",
    heading: "How I got into software.",
    teaser:
      "From Mechanical Engineering to founder-led product work to full-time product engineering. The short version, without the drama.",
    readTime: "6 min",
  },
  {
    href: "/stories/ai",
    label: "Working style",
    heading: "How I use AI in practice.",
    teaser:
      "Where it helps, where it does not, and how I use it without outsourcing judgment.",
    readTime: "3 min",
  },
];

export function Stories() {
  return (
    <section className={styles.stories}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>More context, if useful</p>
        <div className={styles.grid}>
          {stories.map((story) => (
            <Link key={story.href} href={story.href} className={styles.card}>
              <span className={styles.cardLabel}>{story.label}</span>
              <HoverText as="h3" variant="card-heading" className={styles.cardHeading} font="600 18px Quicksand">
                {story.heading}
              </HoverText>
              <p className={styles.cardTeaser}>{story.teaser}</p>
              <span className={styles.cardFooter}>
                <span className={styles.readTime}>{`${story.readTime} read`}</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

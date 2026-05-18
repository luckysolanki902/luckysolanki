/* ============================================================
   Stories — Two optional deep-reads before the Contact section.
   Quiet cards. No pressure. Just context for those who want it.
   ============================================================ */

"use client";

import Link from "next/link";
import { HoverText } from "@/components/shared/HoverText";
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
        <HoverText as="p" variant="label" className={styles.eyebrow} font="500 12px Inter">
          More context, if useful
        </HoverText>
        <div className={styles.grid}>
          {stories.map((story) => (
            <Link key={story.href} href={story.href} className={styles.card}>
              <HoverText as="span" variant="label" className={styles.cardLabel} font="500 11px Inter">
                {story.label}
              </HoverText>
              <HoverText as="h3" variant="card-heading" className={styles.cardHeading} font="600 18px Quicksand">
                {story.heading}
              </HoverText>
              <HoverText as="p" variant="paragraph" className={styles.cardTeaser} font="400 14px Inter">
                {story.teaser}
              </HoverText>
              <span className={styles.cardFooter}>
                <HoverText as="span" variant="chip" className={styles.readTime} font="400 12px Inter">
                  {`${story.readTime} read`}
                </HoverText>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

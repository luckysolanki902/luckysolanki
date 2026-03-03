/* ============================================================
   Stories — Two optional deep-reads before the Contact section.
   Quiet cards. No pressure. Just context for those who want it.
   ============================================================ */

import Link from "next/link";
import styles from "./Stories.module.css";

const stories = [
  {
    href: "/stories/journey",
    label: "Origin",
    heading: "The long way around.",
    teaser:
      "Mechanical Engineering, then games, then a startup, then web dev. There was no plan — just decisions that made sense at the time.",
    readTime: "4 min",
  },
  {
    href: "/stories/ai",
    label: "Perspective",
    heading: "On using AI.",
    teaser:
      "I use it every day. Here's what that actually looks like — and what it doesn't change.",
    readTime: "3 min",
  },
];

export function Stories() {
  return (
    <section className={styles.stories}>
      <div className={styles.container}>
        <p className={styles.eyebrow}>Two threads worth reading</p>
        <div className={styles.grid}>
          {stories.map((story) => (
            <Link key={story.href} href={story.href} className={styles.card}>
              <span className={styles.cardLabel}>{story.label}</span>
              <h3 className={styles.cardHeading}>{story.heading}</h3>
              <p className={styles.cardTeaser}>{story.teaser}</p>
              <span className={styles.cardFooter}>
                <span className={styles.readTime}>{story.readTime} read</span>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

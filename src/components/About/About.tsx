/* ============================================================
   About, "A trailer, not the movie."
   Short punchy paragraphs. Max 2 lines each.
   Experience cards with current vs past differentiation.
   ============================================================ */

"use client";

import { experience } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HoverText } from "@/components/shared/HoverText";
import styles from "./About.module.css";

export function About() {
  return (
    <section id={SECTION_IDS.about} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="About" />

        <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
            Where I fit best.
          </HoverText>

        <div className={styles.body}>
          <p>I work on the parts that make a product dependable: APIs, integrations, background jobs, and AI agents acting on real user data.</p>
          <p>At <strong className={styles.highlight}>Blitzit</strong>, my work spans AI agents, integrations, realtime collaboration, and the move to a new platform. Most recently, I built Blitzy’s voice architecture, a custom wake word, and an orb that shows what the assistant is doing.</p>
          <p>Co-founding <strong className={styles.highlight}>MaddyCustom</strong> taught me to connect engineering decisions to customers, support, revenue, and what a small team can actually ship.</p>
          <p>I like owning a problem from the first conversation through the API, the interface, and the things that happen after launch.</p>
        </div>

        {/* Experience Cards */}
        <div className={styles.cards}>
          {experience.map((exp) => (
            <div
              key={exp.company}
              className={`${styles.card} ${exp.current ? styles.cardCurrent : ""}`}
            >
              <div className={styles.cardTop}>
                <HoverText as="span" variant="card-heading" className={styles.cardCompany} font="600 16px Quicksand">
                  {exp.company}
                </HoverText>
                {exp.current && (
                  <span className={styles.currentBadge}>now</span>
                )}
              </div>
              <span className={styles.cardRole}>{exp.role}</span>
              <span className={styles.cardPeriod}>{exp.period}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

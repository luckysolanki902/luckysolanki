/* ============================================================
   About — "A trailer, not the movie."
   Short punchy paragraphs. Max 2 lines each.
   Experience cards with current vs past differentiation.
   ============================================================ */

"use client";

import { experience } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionLabel } from "@/components/shared/SectionLabel";
import styles from "./About.module.css";

export function About() {
  return (
    <section id={SECTION_IDS.about} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="About" />

        <FadeIn>
          <h2 className={styles.heading}>
            Where I fit best.
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className={styles.body}>
            <p>
              At{" "}
              <strong className={styles.highlight}>Blitzit</strong>, where I
              work on integrations, AI tooling, and backend systems that support
              daily product use.
            </p>
            <p>
              Before that, I co-founded{" "}
              <strong className={styles.highlight}>MaddyCustom</strong> and
              built the platform behind a business that grew to 100K+ monthly
              users and ₹60L annual revenue.
            </p>
            <p>
              I also run <strong className={styles.highlight}>Spyll</strong>, a
              consumer app that reached 1,200+ Android downloads in its first
              month without paid acquisition.
            </p>
            <p>
              That mix matters. I have shipped as a founder, as an in-house
              engineer, and as a solo builder - which makes me comfortable
              owning both product tradeoffs and technical execution.
            </p>
          </div>
        </FadeIn>

        {/* Experience Cards */}
        <div className={styles.cards}>
          {experience.map((exp, i) => (
            <FadeIn key={exp.company} delay={0.1 + i * 0.06}>
              <div
                className={`${styles.card} ${exp.current ? styles.cardCurrent : ""}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardCompany}>{exp.company}</span>
                  {exp.current && (
                    <span className={styles.currentBadge}>now</span>
                  )}
                </div>
                <span className={styles.cardRole}>{exp.role}</span>
                <span className={styles.cardPeriod}>{exp.period}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

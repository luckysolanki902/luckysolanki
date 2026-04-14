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
            I like building things from the ground&nbsp;up.
          </h2>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className={styles.body}>
            <p>
              Full-stack engineer at{" "}
              <strong className={styles.highlight}>Blitzit</strong>, where I
              build integrations, AI tooling, and the infrastructure behind
              them.
            </p>
            <p>
              I also run{" "}
              <strong className={styles.highlight}>Spyll</strong> — an
              anonymous social platform live across 1,300+ colleges. 1,200+
              downloads in month one, zero paid marketing.
            </p>
            <p>
              Previously co-founded{" "}
              <strong className={styles.highlight}>MaddyCustom</strong> —
              scaled to 100K+ monthly users and ₹60L ARR.
            </p>
            <p>
              Mechanical Engineering from HBTU Kanpur. Self-taught developer.
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

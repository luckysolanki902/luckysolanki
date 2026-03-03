/* ============================================================
   About — "A trailer, not the movie."
   Three pieces: positioning statement, narrative, experience cards.
   Cognitive Load: ~4 chunks max (Hick's Law).
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
        <SectionLabel label="ABOUT" />

        <FadeIn>
          <h2 className={styles.heading}>
            I like building things from the ground up.
          </h2>
        </FadeIn>

        <div className={styles.divider} />

        <FadeIn delay={0.1}>
          <div className={styles.body}>
            <p>
              I work at Blitzit as a software engineer, building the MCP
              server and integration infrastructure. On the side, I run
              Spyll — an anonymous social platform live across 1,300+
              colleges in India.
            </p>
            <p>
              Before that, I co-founded MaddyCustom, an e-commerce platform
              for vehicle customization that grew to 100K+ monthly users.
              Studied Mechanical Engineering at HBTU and picked up
              programming on my own.
            </p>
          </div>
        </FadeIn>

        {/* Experience Cards */}
        <div className={styles.cards}>
          {experience.map((exp, i) => (
            <FadeIn key={exp.company} delay={0.1 + i * 0.08}>
              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardCompany}>{exp.company}</span>
                  {exp.current && <span className={styles.currentDot} />}
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

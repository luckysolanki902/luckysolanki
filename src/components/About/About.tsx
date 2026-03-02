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
            I&apos;m a self-taught engineer who builds products from first line
            to first user.
          </h2>
        </FadeIn>

        <div className={styles.divider} />

        <FadeIn delay={0.1}>
          <div className={styles.body}>
            <p>
              Currently engineering integrations at Blitzit — connecting tools
              like Asana, Trello, and Notion into one product. Before that,
              co-founded and built MaddyCustom from scratch into a platform
              serving 50K+ monthly users. Now building Spyll.
            </p>
            <p>
              Mechanical Engineering degree from HBTU. Everything I know about
              software, I taught myself. 7000+ hours of building, breaking, and
              shipping.
            </p>
          </div>
        </FadeIn>

        {/* Experience Cards */}
        <div className={styles.cards}>
          {experience.map((exp, i) => (
            <FadeIn key={exp.company} delay={0.1 + i * 0.08}>
              <div className={styles.card}>
                <span className={styles.cardCompany}>{exp.company}</span>
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

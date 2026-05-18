/* ============================================================
   About — "A trailer, not the movie."
   Short punchy paragraphs. Max 2 lines each.
   Experience cards with current vs past differentiation.
   ============================================================ */

"use client";

import { experience } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HoverText } from "@/components/shared/HoverText";
import { HoverBlock } from "@/components/shared/HoverBlock";
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
            <HoverBlock as="p">
              At{" "}
              <strong className={styles.highlight}>Blitzit</strong>, where I
              work on integrations, AI tooling, and backend systems that support
              daily product use.
            </HoverBlock>
            <HoverBlock as="p">
              Before that, I co-founded{" "}
              <strong className={styles.highlight}>MaddyCustom</strong> and
              built the platform behind a business that grew to 100K+ monthly
              users and ₹60L annual revenue.
            </HoverBlock>
            <HoverBlock as="p">
              I also run <strong className={styles.highlight}>Spyll</strong>, a
              consumer app that reached 1,200+ Android downloads in its first
              month without paid acquisition.
            </HoverBlock>
            <HoverBlock as="p">
              That mix matters. I have shipped as a founder, as an in-house
              engineer, and as a solo builder - which makes me comfortable
              owning both product tradeoffs and technical execution.
            </HoverBlock>
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
              <HoverText as="span" variant="detail" className={styles.cardRole} font="400 14px Inter">
                {exp.role}
              </HoverText>
              <HoverText as="span" variant="label" className={styles.cardPeriod} font="400 12px Inter">
                {exp.period}
              </HoverText>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

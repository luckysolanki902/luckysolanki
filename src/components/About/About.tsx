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
            <p>
              I fit best when a product needs dependable backend systems around
              AI: agent tools, MCP, integrations, queues, sync, scheduling,
              and the operational surfaces that make those systems usable.
            </p>
            <p>
              I can still own a product end to end when needed, but backend
              and AI infrastructure are where I bring the most leverage.
              That includes SaaS backends, MCP tools, integration runtimes,
              queues, realtime features, and production fixes.
            </p>
            <p>
              For full-time teams, I fit where engineering is close to product.
              At <strong className={styles.highlight}>Blitzit</strong>, I build
              backend systems across the product runtime, history, integrations,
              jobs, sync, and AI tool surface.
            </p>
            <p>
              The founder side matters too. I co-founded{" "}
              <strong className={styles.highlight}>MaddyCustom</strong>, grew a
              commerce platform to 100K+ monthly users and ₹60L annual revenue,
              and built <strong className={styles.highlight}>Spyll</strong>{" "}
              through its first real users. I have had to care about speed,
              revenue, support, messy requirements, and what actually ships.
            </p>
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

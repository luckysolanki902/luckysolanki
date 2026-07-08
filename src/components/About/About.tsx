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
              I am useful when a product needs someone who can take ownership
              across the whole build: frontend, backend, deployment, data
              model, payments, AI integrations, automations, and the admin
              tooling behind the scenes.
            </p>
            <p>
              For freelance work, the best fit is a serious product surface
              that has to ship cleanly without needing a large team around it:
              SaaS backends, AI/MCP tools, internal dashboards, commerce
              workflows, integrations, queues, sync, and production fixes.
            </p>
            <p>
              For full-time teams, I fit where engineering is close to product.
              At <strong className={styles.highlight}>Blitzit</strong>, I lead
              backend work across the product runtime, history, integrations,
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

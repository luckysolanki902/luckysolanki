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
              I fit best where a product has to talk to systems it does not
              control: third-party APIs, OAuth grants, provider webhooks, and
              now AI agents acting on real user data.
            </p>
            <p>
              Most of that work is failure handling. Tokens get revoked rather
              than expired. Resources get deleted while a sync is mid-flight.
              Providers throttle you, deliver the same webhook twice, or return
              one status code that means two different things. The engineering
              is in deciding what each failure means — retry it, surface it, or
              hand the user a fix — instead of collapsing all of it into
              &ldquo;something went wrong&rdquo;.
            </p>
            <p>
              At <strong className={styles.highlight}>Blitzit</strong> that is
              twelve provider integrations behind one plugin contract, a 69-tool
              MCP server for external AI clients, and a shared tool layer so the
              in-app agent and third-party clients run the same implementations
              under the same permissions.
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

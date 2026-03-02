/* ============================================================
   Contact — "Let's build something together."
   Peak-End Rule: this is the second memory anchor.
   Reduce friction to zero. One email link. Social links.
   ============================================================ */

"use client";

import { socials } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionLabel } from "@/components/shared/SectionLabel";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id={SECTION_IDS.contact} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="CONTACT" />

        <FadeIn>
          <h2 className={styles.heading}>
            Let&apos;s build something together.
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className={styles.body}>
            Have a project, a role, or just a question?
            <br />
            I&apos;d like to hear from you.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <a href={`mailto:${socials.email}`} className={styles.email}>
            {socials.email}
            <span className={styles.emailArrow}> →</span>
          </a>
        </FadeIn>

        <div className={styles.divider} />

        <FadeIn delay={0.2}>
          <div className={styles.socials}>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              GitHub
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              LinkedIn
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

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
            Let&apos;s work together.
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
              aria-label="GitHub"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.socialIcon}
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span className={styles.socialText}>GitHub</span>
            </a>
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.socialIcon}
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span className={styles.socialText}>LinkedIn</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

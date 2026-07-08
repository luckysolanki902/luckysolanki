/* ============================================================
   Contact — "Let's build something together."
   Peak-End Rule: this is the second memory anchor.
   Reduce friction to zero. One email link. Social links.
   ============================================================ */

"use client";

import { socials } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { ResumeCard } from "@/components/shared/ResumeCard";
import { HoverText } from "@/components/shared/HoverText";
import styles from "./Contact.module.css";

const engagementLanes = [
  "Freelance builds: SaaS backends, dashboards, automations, AI integrations, MCP tools, payments, and deployment",
  "Full-time roles: product engineering close to backend, platform, integrations, queues, sync, and realtime systems",
  "Founder-style ownership: unclear requirements, moving scope, production fixes, support pressure, and shipping decisions",
];

export function Contact() {
  return (
    <section id={SECTION_IDS.contact} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="Contact" />

        <div className={styles.grid}>
          {/* Left column */}
          <div className={styles.left}>
            <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
                If you need someone who can take a product from problem to shipped.
              </HoverText>

            <p className={styles.body}>
                I work best where product judgment and engineering execution
                have to stay close: frontend, backend, deployment, AI
                integrations, automation, payments, realtime features, and the
                admin systems that keep the product usable.
              </p>

            <ul className={styles.lanes} aria-label="Best-fit engagement lanes">
                {engagementLanes.map((lane) => (
                  <li key={lane} className={styles.laneItem}>
                    {lane}
                  </li>
                ))}
              </ul>

            <p className={styles.note}>
                If you are hiring, send the role and the part of the product
                that needs ownership. For freelance work, send the problem, the
                current stack, timeline, and what is blocked.
              </p>

            <a href={`mailto:${socials.email}`} className={styles.email}>
                {socials.email}
                <span className={styles.emailArrow}> →</span>
              </a>

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
                <a
                  href={socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label="X (Twitter)"
                >
                  {/* Official X (Twitter) logo */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={styles.socialIcon}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.057 5.45-6.057zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className={styles.socialText}>X</span>
                </a>
              </div>

          </div>

          {/* Right column — resume card */}
          <div className={styles.right}>
            <ResumeCard />
          </div>
        </div>
      </div>
    </section>
  );
}

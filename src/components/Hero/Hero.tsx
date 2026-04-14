/* ============================================================
   Hero — The first impression.
   Left-aligned. Content-first. One visual idea: the soft rise.
   Metric callout for trust. Scroll cue at bottom.
   Mobile: photo above text. Desktop: text left, photo right.
   ============================================================ */

"use client";

import Image from "next/image";
import { SECTION_IDS } from "@/lib/constants";
import { FadeIn } from "@/components/shared/FadeIn";
import { MarginNote } from "@/components/shared/MarginNote";
import styles from "./Hero.module.css";

const headingLines = ["I ship products", "people actually use."];

export function Hero() {
  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={SECTION_IDS.hero} className={styles.hero}>
      <div className={styles.container}>
        <FadeIn delay={0.06}>
          <div className={styles.photoWrapper}>
            <Image
              src="/images/lucky.jpg"
              alt="Lucky Solanki"
              width={200}
              height={248}
              className={styles.photo}
              priority
              sizes="(max-width: 768px) 140px, 200px"
            />
          </div>
        </FadeIn>

        <div className={styles.content}>
          <FadeIn>
            <h1 className={styles.heading}>
              {headingLines.map((line, i) => (
                <span key={i} className={styles.headingLine}>
                  {line}
                </span>
              ))}
            </h1>
          </FadeIn>

          <FadeIn delay={0.08}>
            <p className={styles.subtext}>
              Full-stack product engineer. 4+ years shipping consumer apps to
              100K+&nbsp;users. Building with TypeScript, AI&nbsp;agents, and
              MCP&nbsp;servers.
              <MarginNote number={1}>I almost became a mechanical engineer. Taught myself to code between lectures — the compiler didn&apos;t care about my GPA.</MarginNote>
            </p>
          </FadeIn>

          <FadeIn delay={0.14}>
            <div className={styles.ctas}>
              <a
                href={`#${SECTION_IDS.work}`}
                className={styles.primaryCta}
                onClick={handleScrollTo(SECTION_IDS.work)}
              >
                See my work
                <span className={styles.arrow} aria-hidden="true">→</span>
              </a>
              <a
                href={`#${SECTION_IDS.contact}`}
                className={styles.secondaryCta}
                onClick={handleScrollTo(SECTION_IDS.contact)}
              >
                Get in touch
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll cue — subtle arrow at bottom of hero */}
      <FadeIn delay={0.5}>
        <div
          className={styles.scrollCue}
          onClick={handleScrollTo(SECTION_IDS.about)}
          role="button"
          tabIndex={0}
          aria-label="Scroll to about section"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleScrollTo(SECTION_IDS.about)(e as unknown as React.MouseEvent);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </FadeIn>
    </section>
  );
}

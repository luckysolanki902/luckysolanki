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
import styles from "./Hero.module.css";

const headingLines = ["I build the hard parts", "of product software."];
const proofPoints = [
  "100K+ monthly users",
  "13-tool MCP server",
  "Founder + in-house experience",
];

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
              src="/images/lucky3.png"
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
              I work on integrations, AI workflows, realtime systems,
              payments, and internal tooling - the parts of a product that are
              hard to fake and expensive to get wrong. My background spans
              founder-led products, in-house engineering, and solo client
              builds.
            </p>
          </FadeIn>

          <FadeIn delay={0.11}>
            <ul className={styles.proofStrip} aria-label="Selected proof points">
              {proofPoints.map((point) => (
                <li key={point} className={styles.proofItem}>
                  {point}
                </li>
              ))}
            </ul>
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

/* ============================================================
   Hero — The first impression.
   Left-aligned. Content-first. One visual idea: the soft rise.
   Metric callout for trust. Scroll cue at bottom.
   Mobile: photo above text. Desktop: text left, photo right.
   Photo: still portrait with a simple signature panel.
   ============================================================ */

"use client";

import Image from "next/image";
import { SECTION_IDS } from "@/lib/constants";
import { HoverText } from "@/components/shared/HoverText";
import { useThemeStore } from "@/store/useThemeStore";
import styles from "./Hero.module.css";

const eyebrow = "Backend & AI Infrastructure Engineer · Shipping production software since 2022";
const headingLines = ["I build backend and AI", "infrastructure for products that can't afford to break."];
const proofPoints = [
  "12 provider integrations",
  "69-tool MCP server",
  "Bidirectional sync + webhooks",
  "Queues, retries, idempotency",
  "100K+ monthly users shipped",
];

export function Hero() {
  const theme = useThemeStore((state) => state.theme);

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id={SECTION_IDS.hero} className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.photoWrapper}>
            <div className={styles.photoFrame}>
            <Image
              src={theme === "dark" ? "/images/lucky-dark-gpt.png" : "/images/lucky-light-gpt.png"}
              alt="Illustrated portrait of Lucky Solanki"
              width={1122}
              height={1402}
              className={styles.photo}
              priority
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 250px, 180px"
            />
            </div>
            <div className={styles.signatureEntrance}>
              <div className={styles.signatureCard}>
                <span className={styles.signatureEyebrow}>Hi, I’m</span>
                <span className={styles.signatureName}>Lucky Solanki</span>
                <svg className={styles.signatureUnderline} viewBox="0 0 180 12" fill="none" aria-hidden="true">
                  <path d="M3 8C43 2 101 2 177 5" pathLength="1" />
                </svg>
              </div>
            </div>
          </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{eyebrow}</p>

          <h1 className={styles.heading}>
              {headingLines.map((line, i) => (
                <HoverText
                  key={i}
                  as="span"
                  variant="heading"
                  className={styles.headingLine}
                  font="600 32px Quicksand"
                >
                  {line}
                </HoverText>
              ))}
            </h1>

          <HoverText
              as="p"
              variant="paragraph"
              className={styles.subtext}
              font="400 14px Inter"
            >
              At Blitzit I build the integration and agent layer: twelve third-party providers behind one plugin contract, and a 69-tool MCP server that lets external AI clients act on the product safely. Most of that work is really about failure — revoked tokens, deleted resources, rate limits, duplicate webhooks, two workers racing for the same write. Before this I co-founded and shipped products of my own, to 100K+ monthly users and ₹60L in annual revenue.
            </HoverText>

          <ul className={styles.proofStrip} aria-label="Selected proof points">
              {proofPoints.map((point) => (
                <li key={point} className={styles.proofItem}>
                  {point}
                </li>
              ))}
            </ul>

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
        </div>
      </div>

      {/* Scroll cue — subtle arrow at bottom of hero */}
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
    </section>
  );
}

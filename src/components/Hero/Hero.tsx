/* ============================================================
   Hero — The first impression.
   Left-aligned. Content-first. One visual idea: the soft rise.
   Metric callout for trust. Scroll cue at bottom.
   Mobile: photo above text. Desktop: text left, photo right.
   Photo: stepped zoom-in at cursor on hover, reverses after 5.
   ============================================================ */

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { SECTION_IDS } from "@/lib/constants";
import { HoverText } from "@/components/shared/HoverText";
import { useThemeStore } from "@/store/useThemeStore";
import styles from "./Hero.module.css";

const headingLines = ["I build the hard parts", "of product software."];
const proofPoints = [
  "Frontend + backend + deployment",
  "AI integrations + automations",
  "MCP systems",
  "Freelance product builds",
  "Founder + CTO experience",
];

const ZOOM_STEP = 0.08;
const ZOOM_MAX = 5;
const ZOOM_INTERVAL_MS = 2000;

export function Hero() {
  const theme = useThemeStore((s) => s.theme);

  // ── Stepped zoom at cursor ────────────────────────────
  const [zoom, setZoom] = useState({ step: 0, zoomingIn: true });
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearZoomInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearZoomInterval, [clearZoomInterval]);

  const handleMouseEnter = useCallback(() => {
    setZoom({ step: 1, zoomingIn: true });
    clearZoomInterval();
    intervalRef.current = setInterval(() => {
      setZoom((prev) => {
        if (prev.zoomingIn) {
          if (prev.step >= ZOOM_MAX) return { step: ZOOM_MAX - 1, zoomingIn: false };
          return { step: prev.step + 1, zoomingIn: true };
        }
        if (prev.step <= 0) return { step: 1, zoomingIn: true };
        return { step: prev.step - 1, zoomingIn: false };
      });
    }, ZOOM_INTERVAL_MS);
  }, [clearZoomInterval]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearZoomInterval();
    setZoom({ step: 0, zoomingIn: true });
  }, [clearZoomInterval]);

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const scale = 1 + zoom.step * ZOOM_STEP;
  const imageStyle = {
    transform: `scale(${scale})`,
    transformOrigin: `${origin.x}% ${origin.y}%`,
  };

  return (
    <section id={SECTION_IDS.hero} className={styles.hero}>
      <div className={styles.container}>
        <div
          className={styles.photoWrapper}
          ref={wrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
            <Image
              src={theme === "dark" ? "/images/lucky-b-dark.png" : "/images/lucky-b-light.png"}
              alt="Lucky Solanki"
              width={200}
              height={248}
              className={styles.photo}
              style={imageStyle}
              priority
              sizes="(max-width: 768px) 140px, 200px"
            />
          </div>

        <div className={styles.content}>
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
              I build across the whole product surface: frontend, backend, deployment, queues, payments, sync, realtime features, admin tooling, AI integrations, automations, and MCP systems. At Blitzit I own major backend systems. As a founder and freelancer, I have taken products from rough idea to shipped software.
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

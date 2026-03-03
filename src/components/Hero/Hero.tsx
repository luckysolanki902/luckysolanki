/* ============================================================
   Hero — The first impression. 80% of the conversion.
   Animation #2: "The Measured Arrival" — line-by-line heading
   Animation #3: "The Gentle Uncover" — clip-path photo reveal
   Z-pattern: name → photo → heading → subtext → CTA
   ============================================================ */

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import styles from "./Hero.module.css";

const headingLines = ["I build products", "people actually use."];

// Animation #2: "The Measured Arrival"
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const lineVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

// Animation #3: "The Gentle Uncover"
const photoVariants = {
  hidden: {
    clipPath: "inset(100% 0 0 0)",
    scale: 1.04,
  },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    scale: 1,
    transition: {
      duration: 0.7,
      delay: 0.9, // After heading lines finish
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// GIF plays for one full cycle (~2.4s) then reverts
const GIF_DURATION = 2400;

export function Hero() {
  const [showGif, setShowGif] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGif = useCallback(() => {
    if (showGif) return;
    setShowGif(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowGif(false), GIF_DURATION);
  }, [showGif]);

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id={SECTION_IDS.hero} className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Name Badge */}
          <motion.span
            className={styles.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {siteConfig.name}
          </motion.span>

          {/* Heading — Line by line */}
          <motion.h1
            className={styles.heading}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {headingLines.map((line, i) => (
              <motion.span
                key={i}
                className={styles.headingLine}
                variants={lineVariants}
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className={styles.subtext}
            custom={1.1}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            Software Engineer at Blitzit. Founder of Spyll.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className={styles.ctas}
            custom={1.3}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <a
              href={`#${SECTION_IDS.work}`}
              className={styles.primaryCta}
              onClick={handleScrollTo(SECTION_IDS.work)}
            >
              View my work
              <span className={styles.arrow}>→</span>
            </a>
            <a
              href={`#${SECTION_IDS.contact}`}
              className={styles.secondaryCta}
              onClick={handleScrollTo(SECTION_IDS.contact)}
            >
              Get in touch
            </a>
          </motion.div>
        </div>

        {/* Photo — hover/tap to say hello */}
        <motion.div
          className={styles.photoWrapper}
          variants={photoVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tight clickable wrapper — only the photo area triggers gif */}
          <div
            className={styles.photoClickArea}
            onMouseEnter={triggerGif}
            onClick={triggerGif}
          >
            <AnimatePresence mode="wait" initial={false}>
              {showGif ? (
                <motion.div
                  key="gif"
                  className={styles.imageFrame}
                  initial={{ opacity: 0, y: 36, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 22,
                    opacity: { duration: 0.18 },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/hello-penguin.gif"
                    alt="Hello!"
                    className={styles.gifImage}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="photo"
                  className={styles.imageFrame}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                >
                  <Image
                    src="/images/lucky.jpg"
                    alt="Lucky Solanki — Engineer and Founder"
                    width={280}
                    height={340}
                    className={styles.photo}
                    priority
                    sizes="(max-width: 768px) 200px, (max-width: 1024px) 240px, 280px"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

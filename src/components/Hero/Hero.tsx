/* ============================================================
   Hero — The first impression. 80% of the conversion.
   Animation #2: "The Measured Arrival" — line-by-line heading
   Animation #3: "The Gentle Uncover" — clip-path photo reveal
   Z-pattern: name → photo → heading → subtext → CTA
   ============================================================ */

"use client";

import { motion } from "framer-motion";
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

export function Hero() {
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
            Built products used by 50K+ monthly users.
            <br />
            Co-founder of Spyll. Engineer at Blitzit.
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

        {/* Photo */}
        <motion.div
          className={styles.photoWrapper}
          variants={photoVariants}
          initial="hidden"
          animate="visible"
        >
          <Image
            src="/images/lucky.jpg"
            alt="Lucky Solanki — Engineer and Founder"
            width={280}
            height={340}
            className={styles.photo}
            priority
            sizes="(max-width: 768px) 220px, (max-width: 1024px) 250px, 280px"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* Contact, the warm, playful close. */

import { ArrowUpRight } from "lucide-react";
import { socials } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Sparkle, Star, Clouds } from "./decor";
import styles from "./Site.module.css";

const LINKS = [
  { label: "GitHub", href: socials.github, color: "var(--c-mint)", tilt: "-3deg" },
  { label: "LinkedIn", href: socials.linkedin, color: "var(--c-sky)", tilt: "2deg" },
  { label: "X", href: socials.x, color: "var(--c-blush)", tilt: "-2deg" },
  { label: "Résumé", href: "/resume.pdf", color: "var(--c-butter)", tilt: "3deg" },
];

export function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contactWash} aria-hidden />
      <Clouds />
      <Star className={styles.floatStar1} />
      <Sparkle className={styles.floatStar2} />
      <Star className={styles.floatStar3} />

      <Reveal className={styles.contactInner}>
        <p className={styles.kicker}>let&apos;s talk</p>
        <h2 className={styles.contactTitle}>
          Say hi <Sparkle className={styles.contactSparkle} />
        </h2>
        <p className={styles.contactLead}>
          Hiring, a freelance project, or an early idea you want a hand with? Tell me
          the problem and where it&apos;s stuck. I&apos;ll be honest about fit.
        </p>

        <a href={`mailto:${socials.email}`} className={styles.emailCard}>
          <span className={styles.emailLabel}>drop me a line</span>
          <span className={styles.email}>
            {socials.email}
            <ArrowUpRight size={22} />
          </span>
        </a>
        <p className={styles.replyNote}>I usually reply within a day :)</p>

        <div className={styles.contactLinks}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialSticker}
              style={{ ["--badge" as string]: l.color, ["--tilt" as string]: l.tilt }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

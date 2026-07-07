/* Hero, playful pastel welcome. Bunting, a drifting sky, a
   handwritten hello, and a few sticker badges. */

import Link from "next/link";
import { Bunting, Clouds, WavyUnderline, ArrowDoodle } from "./decor";
import styles from "./Site.module.css";

const BADGES = [
  { label: "Lead Backend · Blitzit", tilt: "-4deg", color: "var(--c-peri)" },
  { label: "ex-CTO · MaddyCustom", tilt: "3deg", color: "var(--c-blush)" },
  { label: "Founder ×3", tilt: "-2deg", color: "var(--c-mint)" },
];

export function Hero() {
  return (
    <header id="hero" className={styles.hero}>
      <div className={styles.buntingWrap}>
        <Bunting />
      </div>
      <Clouds />

      <div className={styles.heroInner}>
        <p className={styles.hello}>hey there, I&apos;m</p>
        <h1 className={styles.heroName}>Lucky Solanki</h1>

        <p className={styles.heroLine}>
          I build the{" "}
          <span className={styles.underlined}>
            hard parts
            <WavyUnderline className={styles.wave} />
          </span>{" "}
          of software, and have a lot of fun doing it.
        </p>

        <ul className={styles.badges} aria-label="At a glance">
          {BADGES.map((b) => (
            <li
              key={b.label}
              className={styles.badge}
              style={{ ["--tilt" as string]: b.tilt, ["--badge" as string]: b.color }}
            >
              {b.label}
            </li>
          ))}
        </ul>

        <div className={styles.heroCtas}>
          <div className={styles.primaryWrap}>
            <a href="#work" className={styles.btnPrimary}>
              See what I&apos;ve built
            </a>
            <span className={styles.startHere} aria-hidden>
              <ArrowDoodle className={styles.arrowDoodle} />
              start here!
            </span>
          </div>
          <Link href="/blog" className={styles.btnGhost}>
            Read the blog
          </Link>
          <a href="#contact" className={styles.btnGhost}>
            Say hi
          </a>
        </div>
      </div>
    </header>
  );
}

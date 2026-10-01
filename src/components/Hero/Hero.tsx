"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getExperienceYears } from "@/lib/experience";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { SECTION_IDS } from "@/lib/constants";
import { useThemeStore } from "@/store/useThemeStore";
import styles from "./Hero.module.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: "700", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

export function Hero() {
  const [years, setYears] = useState(getExperienceYears);
  useEffect(() => {
    const update = () => setYears(getExperienceYears());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  const theme = useThemeStore((state) => state.theme);
  const goTo = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <section id={SECTION_IDS.hero} className={`${styles.hero} ${body.className}`}>
      <div className={styles.stage}>
        <h1 className={`${styles.name} ${display.className}`} aria-label="Lucky Solanki">
          {["LUCKY", "SOLANKI"].map((word, wordIndex) => (
            <span className={styles.word} key={word} aria-hidden="true">
              {[...word].map((letter, i) => <span className={styles.letter} key={i} style={{ animationDelay: `${80 + (i + wordIndex * 5) * 45}ms` }}>{letter}</span>)}
            </span>
          ))}
        </h1>
        <div className={styles.intro}>
          <span className={styles.smallLabel}>Backend & AI engineer</span>
          <p>I like figuring<br />things out.<br /><em>Then building them.</em></p>
          <span className={styles.description}>Voice, agents, and the backend<br />that turns an idea into a product.</span>
        </div>
        <div className={styles.portrait}>
          <Image src={theme === "dark" ? "/images/lucky-dark-gpt.png" : "/images/lucky-light-gpt.png"} alt="Lucky Solanki" width={1122} height={1402} priority sizes="(min-width: 1024px) 450px, (min-width: 768px) 360px, 280px" className={styles.photo} />
        </div>
        <div className={styles.invitation}>
          <p>Currently building at <strong>Blitzit.</strong><br />Previously, co-founded<br />and built MaddyCustom.</p>
          <a className={styles.workLink} href="#work" onClick={goTo(SECTION_IDS.work)}><span>Explore my work</span><span className={styles.arrow} aria-hidden="true">↘</span></a>
          <a className={styles.contactLink} href="#contact" onClick={goTo(SECTION_IDS.contact)}>Say hello <span aria-hidden="true">↗</span></a>
          <a className={styles.resumeLink} href="/resume.pdf" target="_blank" rel="noopener noreferrer">View résumé <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={styles.bottomline}>
        <p>Always learning.<br />Usually building.</p>
        <p className={styles.experience}><strong suppressHydrationWarning>{years}+ years</strong><span>building full-stack products,<br />backend systems & AI integrations.</span></p>
        <a href="#work" onClick={goTo(SECTION_IDS.work)} className={styles.scroll}>Scroll to discover <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}

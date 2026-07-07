/* SiteNav — quiet sticky nav. Name left, a few links right,
   frosts softly once you scroll. */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "./decor";
import styles from "./Site.module.css";

const LINKS = [
  { label: "work", href: "/#work" },
  { label: "blog", href: "/blog" },
  { label: "about", href: "/#about" },
  { label: "say hi", href: "/#contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`} aria-label="Main">
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand}>
          <Star className={styles.brandStar} />
          Lucky&nbsp;Solanki
        </Link>
        <div className={styles.navLinks}>
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className={styles.navLink}>
              {l.label}
            </Link>
          ))}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navResume}
          >
            Résumé
          </a>
        </div>
      </div>
    </nav>
  );
}

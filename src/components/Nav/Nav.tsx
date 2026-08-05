/* ============================================================
   Nav — Fixed navigation bar
   Animation #4: "The Quiet Settle" — transparent → frosted bar
   Three links only (Hick's Law). Active section detection.
   Mobile: hamburger → fullscreen overlay.
   ============================================================ */

"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import styles from "./Nav.module.css";

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection();
  const { scrollDirection, scrollY } = useScrollDirection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const isScrolled = scrollY > 100;
  const isHidden = scrollDirection === "down" && scrollY > 400;

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!isHome) return; // let normal navigation happen (goes to /#section)
      e.preventDefault();
      setMobileOpen(false);
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [isHome]
  );

  const scrollToTop = useCallback(
    (e: React.MouseEvent) => {
      if (!isHome) return;
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [isHome]
  );

  return (
    <>
      <nav
        className={`${styles.nav} ${isScrolled ? styles.scrolled : ""} ${
          isHidden ? styles.hidden : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link
            href="/"
            className={styles.logo}
            onClick={scrollToTop}
            aria-label="Go to homepage"
          >
            Lucky Solanki
          </Link>

          {/* Desktop Links */}
          <div className={styles.desktopLinks}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`${styles.navLink} ${
                  activeSection === link.href.replace("/#", "") ? styles.active : ""
                }`}
                onClick={(e) => handleNavClick(e, link.href.replace("/", ""))}
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile: only theme toggle, no hamburger */}
          <div className={styles.mobileToggle}>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <button
              className={styles.closeButton}
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              type="button"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.overlayContent}>
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className={styles.overlayLink}
                  onClick={(e) => handleNavClick(e, link.href.replace("/", ""))}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + NAV_LINKS.length * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={styles.overlayToggle}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   Footer — "The quietest part of the page."
   Just a respectful sign-off. No repeated nav.
   ============================================================ */

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.text}>© 2026 Lucky Solanki</span>
        <span className={styles.text}>Built with Next.js</span>
      </div>
    </footer>
  );
}

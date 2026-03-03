/* ============================================================
   Footer — "The quietest part of the page."
   Just a respectful sign-off. No repeated nav.
   ============================================================ */

import styles from "./Footer.module.css";

export function Footer() {

  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.text}>© {year} Lucky Solanki</span>
        <span className={styles.text}>Built with Next.js</span>
      </div>
    </footer>
  );
}

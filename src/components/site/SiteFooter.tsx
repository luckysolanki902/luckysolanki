/* SiteFooter, a cheerful little sign-off. */

import Link from "next/link";
import { Heart, Star } from "./decor";
import styles from "./Site.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <span className={styles.footerBrand}>
          <Star className={styles.footerStar} /> Lucky Solanki
        </span>

        <div className={styles.footerLinks}>
          <a href="#hero">back to top</a>
          <Link href="/blog">blog</Link>
          <a href="mailto:luckysolanki902@gmail.com">email</a>
        </div>

        <span className={styles.footerNote}>
          made with <Heart className={styles.footerHeart} /> and chai
        </span>
      </div>
      <p className={styles.footerCopy}>© {new Date().getFullYear()} Lucky Solanki</p>
    </footer>
  );
}

/* About, a short, warm hello and the three hats I wear. */

import { experience } from "@/lib/data";
import { Reveal } from "./Reveal";
import { Star } from "./decor";
import styles from "./Site.module.css";

export function About() {
  return (
    <section id="about" className={styles.section}>
      <Reveal>
        <p className={styles.kicker}>a little about me</p>
        <h2 className={styles.sectionTitle}>
          I wear a few hats <Star className={styles.titleStar} /> and I like all of them.
        </h2>
      </Reveal>

      <div className={styles.aboutGrid}>
        <Reveal className={styles.aboutBody}>
          <p>
            I&apos;ve shipped as a <strong>founder</strong>, an{" "}
            <strong>in-house engineer</strong>, and a <strong>solo builder</strong>, so
            I&apos;m happy owning both the product call and the code. I gravitate to the
            problems that are hard to fake: sync that can&apos;t drop data, payments that
            can&apos;t lose an order, realtime that can&apos;t feel laggy.
          </p>
          <p>
            These days I lead the backend at Blitzit. Before that I co-founded and was CTO
            of MaddyCustom, which grew to 100K+ monthly users and ₹60L a year. And I keep
            starting little things on the side, because the empty-repo part is my favourite.
          </p>
        </Reveal>

        <Reveal className={styles.expList} delay={0.1}>
          {experience.map((e) => (
            <div key={e.company} className={styles.expRow}>
              <div className={styles.expHead}>
                <span className={styles.expCompany}>{e.company}</span>
                {e.current && <span className={styles.expNow}>now</span>}
              </div>
              <span className={styles.expRole}>{e.role}</span>
              <span className={styles.expPeriod}>{e.period}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

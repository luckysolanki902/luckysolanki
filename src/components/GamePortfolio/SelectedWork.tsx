import Link from "next/link";
import Image from "next/image";
import { projects, socials } from "@/lib/data";
import styles from "./SelectedWork.module.css";
export function SelectedWork() {
  return (
    <section
      className={styles.section}
      id="selected-work"
      aria-labelledby="selected-heading"
    >
      <div className={styles.inner}>
        <header className={styles.heading}>
          <span>01 / SELECTED WORK</span>
          <h2 id="selected-heading">Behind the interface.</h2>
          <p>
            Two products where I owned the systems that make the experience
            work.
          </p>
        </header>
        <article className={styles.feature}>
          <div>
            <span className={styles.eyebrow}>BLITZIT · NOV 2025 — PRESENT</span>
            <h3>A backend built from the ground up.</h3>
            <p className={styles.role}>Core Backend Developer & AI Engineer</p>
            <p>
              I designed and built the Blitzit 3.0 backend: domain modules,
              APIs, background workers, realtime collaboration, integrations,
              and a shared execution layer for AI tools.
            </p>
            <div className={styles.decisions}>
              <Link href="/work/blitzit#architecture">
                API and worker boundaries ↗
              </Link>
              <Link href="/work/blitzit#integrations">
                OAuth, webhooks, and sync recovery ↗
              </Link>
              <Link href="/work/blitzit#shared-tools">
                Shared tools, explicit permissions ↗
              </Link>
            </div>
            <p className={styles.status}>
              Voice backend merged. Complete frontend voice experience in
              review.
            </p>
            <Link className={styles.cta} href="/work/blitzit">
              Read the engineering story →
            </Link>
          </div>
          <figure>
            <Image
              src="/images/projects/blitzit/board-clean.webp"
              alt="Blitzit task board using an isolated demo account"
              width={1440}
              height={960}
              sizes="(max-width:800px) 90vw, 45vw"
            />
            <figcaption>
              The product these systems support · demo account
            </figcaption>
          </figure>
        </article>
        <article className={styles.feature}>
          <div>
            <span className={styles.eyebrow}>
              MADDYCUSTOM · DEC 2022 — FEB 2026
            </span>
            <h3>Software tied to the business.</h3>
            <p className={styles.role}>Co-founder & Lead Developer</p>
            <p>
              A bike-wrap business became my path into software. I built its
              storefront and operations tools, connecting checkout and payments
              to production files, inventory, and shipping.
            </p>
            <div className={styles.decisions}>
              <Link href="/work/maddycustom#payments">
                Payments, retries, and order state ↗
              </Link>
              <Link href="/work/maddycustom#operations">
                From an order to a shipped product ↗
              </Link>
            </div>
            <Link className={styles.cta} href="/work/maddycustom">
              Read the building story →
            </Link>
          </div>
          <div className={styles.flow} aria-label="Business workflow">
            <span>01 / STOREFRONT</span>
            <strong>A customer chooses a design.</strong>
            <i>↓</i>
            <span>02 / PAYMENTS & ORDERS</span>
            <strong>An order becomes production work.</strong>
            <i>↓</i>
            <span>03 / OPERATIONS</span>
            <strong>The team makes it, packs it, ships it.</strong>
            <small>I built the software connecting those steps.</small>
          </div>
        </article>
        <header className={styles.heading}>
          <span>02 / OTHER PROJECTS</span>
          <h2>Different problems. More to learn.</h2>
        </header>
        <div className={styles.projects}>
          {projects
            .filter((p) => !["blitzit", "maddycustom"].includes(p.slug))
            .map((p) => (
              <article key={p.slug}>
                <h3>{p.name}</h3>
                <p>{p.tagline}</p>
                <span>{p.role}</span>
                <a href={`/#projects/${p.slug}`}>Project details ↗</a>
              </article>
            ))}
        </div>
        <footer className={styles.footer}>
          <div>
            <span>03 / A LITTLE MORE</span>
            <h2>Games were the beginning.</h2>
            <p>
              Mechanical engineering, design, a business, then software.
              <br />
              The thread through it: learning enough to build what was needed.
            </p>
            <Link href="/stories/journey">How I got here ↗</Link>
            <Link href="/blog">Technical notes ↗</Link>
          </div>
          <div>
            <h2>Let’s talk.</h2>
            <a href={`mailto:${socials.email}`}>{socials.email} ↗</a>
            <a href="/resume.pdf">View résumé ↗</a>
            <a href={socials.github}>GitHub ↗</a>
          </div>
        </footer>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight, Bot, Layers3, Server } from "lucide-react";
import { buildFocus } from "@/lib/build-focus";
import { FadeIn } from "@/components/shared/FadeIn";
import styles from "./BuildFocus.module.css";

const icons = { ai: Bot, backend: Server, product: Layers3 };

export function BuildFocus() {
  return <section id="systems" className={styles.section} aria-labelledby="systems-title">
    <div className={styles.heading}>
      <div>
        <p className={styles.eyebrow}>Where I can help</p>
        <h2 id="systems-title">What can we<br />build together?</h2>
      </div>
      <p className={styles.intro}>Bring me the part that needs figuring out. I can help turn it into something your customers use and your team can run.</p>
    </div>
    <div className={styles.grid}>
      {buildFocus.map((item, index) => {
        const Icon = icons[item.kind];
        return <FadeIn key={item.kind} delay={index * .07} className={styles.reveal}>
          <article className={styles.card} data-kind={item.kind}>
            <div className={styles.topline}>
              <span className={styles.icon} aria-hidden="true"><Icon size={25} strokeWidth={1.4} /></span>
              <p className={styles.label}>{item.label}</p>
            </div>
            <h3>{item.title}</h3>
            <p className={styles.description}>{item.description}</p>
            <div className={styles.proof}>
              <p className={styles.project}>Built at <strong>{item.project}</strong></p>
              <p>{item.proof}</p><Link href={item.href} className={styles.proofLink}>{item.linkLabel} ↗</Link><Link href={item.secondHref} className={styles.proofLink}>{item.secondLabel} ↗</Link>
            </div>
          </article>
        </FadeIn>;
      })}
    </div>
    <div className={styles.footer}>
      <a className={styles.contact} href="#contact">Tell me what you’re building <ArrowUpRight size={19} aria-hidden="true" /></a>
      <Link className={styles.notes} href="/work">Go deeper into the work stories <span aria-hidden="true">↗</span></Link>
    </div>
  </section>;
}

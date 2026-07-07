/* Work, playful polaroids of the things I've built. Tilted,
   taped, with a handwritten caption. Filter by which hat. */

"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { projects, type Audience } from "@/lib/data";
import { Reveal } from "./Reveal";
import styles from "./Site.module.css";

const FILTERS: { label: string; value: Audience | "all" }[] = [
  { label: "everything", value: "all" },
  { label: "founder", value: "founder" },
  { label: "freelance", value: "freelance" },
  { label: "full-time", value: "employed" },
];

const TILTS = ["-2.2deg", "1.8deg", "-1.4deg", "2.4deg", "-2deg", "1.5deg"];

export function Work() {
  const [filter, setFilter] = useState<Audience | "all">("all");
  const shown =
    filter === "all" ? projects : projects.filter((p) => p.audience.includes(filter));

  return (
    <section id="work" className={styles.section}>
      <Reveal>
        <p className={styles.kicker}>stuff I&apos;ve made</p>
        <h2 className={styles.sectionTitle}>A few things I&apos;m proud of.</h2>
      </Reveal>

      <div className={styles.filters} role="tablist" aria-label="Filter work">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            className={`${styles.filterFlag} ${filter === f.value ? styles.filterOn : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.workGrid}>
        {shown.map((p, i) => (
          <Reveal key={p.slug}>
            <article
              className={styles.polaroid}
              style={{
                ["--tilt" as string]: TILTS[i % TILTS.length],
                ["--card-accent" as string]: p.accent,
              }}
            >
              <span className={styles.tape} aria-hidden />
              <div className={styles.photo}>
                <Image
                  src={p.image}
                  alt={`${p.name}, ${p.tagline}`}
                  width={720}
                  height={460}
                  className={styles.photoImg}
                  sizes="(max-width: 760px) 100vw, 500px"
                />
              </div>

              <p className={styles.caption}>{p.role}</p>

              <div className={styles.polaroidBody}>
                <h3 className={styles.projName}>{p.name}</h3>
                <p className={styles.projDesc}>{p.description}</p>

                {p.metrics && (
                  <p className={styles.projMetric}>
                    {p.playStore ? (
                      <a href={p.playStore} target="_blank" rel="noopener noreferrer" className={styles.metricLink}>
                        <Download size={13} /> {p.metrics}
                      </a>
                    ) : (
                      p.metrics
                    )}
                  </p>
                )}

                <ul className={styles.projStack}>
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>

                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.projVisit}>
                    have a look
                    <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

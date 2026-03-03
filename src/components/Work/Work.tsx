/* ============================================================
   Work — "The core of the entire portfolio."
   Converts the hero's claim into evidence.
   3-4 projects max (Hick's Law). Full editorial cards.
   ============================================================ */

"use client";

import { projects } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { FadeIn } from "@/components/shared/FadeIn";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

export function Work() {
  return (
    <section id={SECTION_IDS.work} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="WORK" />

        <FadeIn>
          <h2 className={styles.heading}>Selected Work</h2>
        </FadeIn>

        <div className={styles.projects}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

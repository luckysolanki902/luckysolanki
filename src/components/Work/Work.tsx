/* ============================================================
   Work — "The core of the entire portfolio."
   Converts the hero's claim into evidence.
   3-4 projects max (Hick's Law). Full editorial cards.
   ============================================================ */

"use client";

import { projects } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HoverText } from "@/components/shared/HoverText";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

export function Work() {
  return (
    <section id={SECTION_IDS.work} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="Work" />

        <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
            Selected Work
          </HoverText>

        <div className={styles.projects}>
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

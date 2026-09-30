/* ============================================================
   Work, "The core of the entire portfolio."
   Converts the hero's claim into evidence.
   3-4 projects max (Hick's Law). Full editorial cards.
   ============================================================ */

"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { projects } from "@/lib/data";
import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HoverText } from "@/components/shared/HoverText";
import { SystemWalkthrough } from "@/components/SystemWalkthrough/SystemWalkthrough";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

type WorkFilter = "all" | "founder" | "freelance" | "fulltime";

const filters: { label: string; value: WorkFilter }[] = [
  { label: "All", value: "all" },
  { label: "Founder", value: "founder" },
  { label: "Freelance", value: "freelance" },
  { label: "Full-time", value: "fulltime" },
];

export function Work() {
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("all");

  const visibleProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  return (
    <section id={SECTION_IDS.work} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="Work" />

        <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
          A few things I’ve shipped.
        </HoverText>

        <div className={styles.filterRow} aria-label="Filter work by role">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={`${styles.filterChip} ${
                activeFilter === filter.value ? styles.filterChipActive : ""
              }`}
              onClick={() => setActiveFilter(filter.value)}
              aria-pressed={activeFilter === filter.value}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.projects}>
          <div className={activeFilter === "all" ? styles.featuredStack : styles.filteredProjects}>
            {(activeFilter === "all" ? visibleProjects.slice(0, 3) : visibleProjects).map((project, i) => (
              <div className={activeFilter === "all" ? styles.projectScene : undefined} data-project-scene={activeFilter === "all" ? "" : undefined} style={{ "--deck-index": i } as CSSProperties} key={project.slug}>
                <ProjectCard project={project} index={i} featured={activeFilter === "all"} />
              </div>
            ))}
          </div>
          {activeFilter === "all" && <SystemWalkthrough />}
          {activeFilter === "all" && (
            <div className={styles.moreWork}>
              <p className={styles.moreLabel} data-reveal>More work, different problems.</p>
              <div className={styles.featuredStack}>
                {visibleProjects.slice(3).map((project, i) => (
                  <div className={styles.projectScene} data-project-scene style={{ "--deck-index": i } as CSSProperties} key={project.slug}>
                    <ProjectCard project={project} index={i + 3} featured />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

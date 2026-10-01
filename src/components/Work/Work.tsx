"use client";

import { useState, type CSSProperties } from "react";
import { projects } from "@/lib/data";
import { workStories } from "@/lib/work-stories";
import { WorkShowcase } from "@/components/WorkStories/WorkShowcase";
import { BuildFocus } from "@/components/BuildFocus/BuildFocus";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

export function Work() {
  const [filter, setFilter] = useState("all");
  const otherProjects = projects.filter(p => !["blitzit", "maddycustom"].includes(p.slug)).filter(p => filter === "all" || (filter === "freelance" ? p.category === "freelance" : p.category !== "freelance"));
  return <section id="work" className={styles.section}>
    <div className={styles.container}>
      <SectionLabel label="Work experience" />
      <h2 className={styles.heading}>Real products.<br />Deep ownership.</h2>
      <div className={styles.projects}>
        {workStories.map((story, i) => <WorkShowcase key={story.slug} story={story} index={i} />)}
        <BuildFocus />
        <section id="projects" className={styles.moreWork}>
          <div><SectionLabel label="Projects & freelance" /><h2 className={styles.moreLabel}>Different ideas. Same care.</h2></div>
          <div className={styles.filterRow} aria-label="Filter projects">{["all", "projects", "freelance"].map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)} className={`${styles.filterChip} ${filter === value ? styles.filterChipActive : ""}`}>{value === "all" ? "All" : value === "projects" ? "Projects" : "Freelance"}</button>)}</div>
          <div className={styles.featuredStack}>
            {otherProjects.map((project, i) => <div key={project.slug} data-project-scene className={styles.projectScene} style={{"--deck-index":i} as CSSProperties}><ProjectCard project={project} index={i} featured /></div>)}
          </div>
        </section>
      </div>
    </div>
  </section>;
}

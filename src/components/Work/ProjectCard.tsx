/* ============================================================
   ProjectCard — Individual project display.
   Full-width editorial card: screenshot, name, link, 
   description, tech stack.
   Animation #5: "The Lift" — subtle hover on screenshot.
   ============================================================ */

"use client";

import Image from "next/image";
import type { Project } from "@/lib/data";
import { FadeIn } from "@/components/shared/FadeIn";
import styles from "./Work.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <FadeIn delay={index * 0.08}>
      <article className={styles.card}>
        {/* Screenshot */}
        <div className={styles.imageWrapper}>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.imageLink}
              aria-label={`Visit ${project.name}`}
            >
              <Image
                src={project.image}
                alt={`${project.name} — ${project.tagline}`}
                width={1000}
                height={625}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1000px"
              />
            </a>
          ) : (
            <Image
              src={project.image}
              alt={`${project.name} — ${project.tagline}`}
              width={1000}
              height={625}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1000px"
            />
          )}
        </div>

        {/* Meta */}
        <div className={styles.cardMeta}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardName}>{project.name}</h3>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}{" "}
                <span className={styles.linkArrow}>→</span>
              </a>
            )}
          </div>

          <p className={styles.cardDescription}>{project.description}</p>

          <p className={styles.cardStack}>{project.stack.join(" · ")}</p>
        </div>
      </article>
    </FadeIn>
  );
}

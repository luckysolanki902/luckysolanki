/* ============================================================
   ProjectCard — Alternating side layout.
   Even index: image left, text right.
   Odd index: text left, image right.
   Animation #5: "The Lift" on screenshot hover.
   ============================================================ */

"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import type { Project } from "@/lib/data";
import { FadeIn } from "@/components/shared/FadeIn";
import styles from "./Work.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 !== 0;

  return (
    <FadeIn delay={index * 0.07}>
      <article className={`${styles.card} ${isReversed ? styles.cardReversed : ""}`}>
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
                width={720}
                height={450}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 440px"
              />
            </a>
          ) : (
            <Image
              src={project.image}
              alt={`${project.name} — ${project.tagline}`}
              width={720}
              height={450}
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 440px"
            />
          )}
        </div>

        {/* Meta */}
        <div className={styles.cardMeta}>
          <div className={styles.cardNameRow}>
            <h3 className={styles.cardName}>{project.name}</h3>
            <span className={styles.cardRole}>{project.role}</span>
          </div>

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

          <p className={styles.cardDescription}>{project.description}</p>

          {project.metrics && (
            <p className={styles.cardMetrics}>
              {project.playStore ? (
                <a
                  href={project.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.playStoreLink}
                >
                  <Download size={13} strokeWidth={1.8} className={styles.playStoreIcon} />
                  {project.metrics}
                </a>
              ) : (
                project.metrics
              )}
            </p>
          )}

          <p className={styles.cardStack}>{project.stack.join(" · ")}</p>
        </div>
      </article>
    </FadeIn>
  );
}

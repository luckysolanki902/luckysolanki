/* ============================================================
   ProjectCard — Alternating side layout.
   Even index: image left, text right.
   Odd index: text left, image right.
   Animation #5: "The Lift" on screenshot hover.
   ============================================================ */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import type { Project } from "@/lib/data";
import { HoverText } from "@/components/shared/HoverText";
import styles from "./Work.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 !== 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = Boolean(project.details?.length);

  return (
    <article className={`${styles.card} ${isReversed ? styles.cardReversed : ""}`}>
      <div className={styles.imageWrapper}>
        {project.image ? (
          project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
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
          )
        ) : (
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderEyebrow}>{project.role}</span>
            <span className={styles.placeholderName}>{project.name}</span>
            <span className={styles.placeholderTagline}>{project.tagline}</span>
          </div>
        )}
        {project.location && (
          <div className={styles.locationTag} aria-label={`Client based in ${project.location}`}>
            <span className={styles.locationDot} />
            {project.location}
          </div>
        )}
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.cardNameRow}>
          <HoverText as="h3" variant="card-heading" className={styles.cardName} font="600 18px Quicksand">
            {project.name}
          </HoverText>
          <span className={styles.cardRole}>{project.role}</span>
        </div>

        <p className={styles.cardTagline}>{project.tagline}</p>

        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
            {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}{" "}
            <span className={styles.linkArrow}>→</span>
          </a>
        )}

        <p className={styles.cardDescription}>{project.description}</p>

        {project.metrics && (
          <p className={styles.cardMetrics}>
            {project.playStore ? (
              <a href={project.playStore} target="_blank" rel="noopener noreferrer" className={styles.playStoreLink}>
                <Download size={13} strokeWidth={1.8} className={styles.playStoreIcon} />
                {project.metrics}
              </a>
            ) : (
              project.metrics
            )}
          </p>
        )}

        <p className={styles.cardStack}>{project.stack.join(" · ")}</p>

        {hasDetails && (
          <>
            <button
              type="button"
              className={styles.detailsToggle}
              onClick={() => setIsExpanded((value) => !value)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "See more"}
            </button>

            {isExpanded && (
              <div className={styles.detailsPanel}>
                {project.details?.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

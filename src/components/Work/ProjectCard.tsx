/* ============================================================
   ProjectCard, Alternating side layout.
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
  featured?: boolean;
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const isReversed = index % 2 !== 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = Boolean(project.details?.length);

  return (
    <article id={`project-${project.slug}`} data-project={project.slug} data-project-card className={`${styles.card} ${isReversed ? styles.cardReversed : ""} ${featured ? styles.featured : ""} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.projectCaption}><span>Selected work / {String(index + 1).padStart(2, "0")}</span><span>{project.year}</span></div>
      <div className={styles.imageWrapper}>
        {project.image ? (
          project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.imageLink}>
              <Image
                src={project.image}
                preload
                unoptimized
                alt={`${project.name}, ${project.tagline}`}
                width={720}
                height={450}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 440px"
              />
            </a>
          ) : (
            <Image
              src={project.image}
                preload
                unoptimized
              alt={`${project.name}, ${project.tagline}`}
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

        <p className={styles.ownershipLabel}>My part</p>
        <p className={styles.cardDescription}>{project.description}</p>

        {project.metrics && (
          <p className={styles.cardMetrics}><span className={styles.outcomeLabel}>What shipped</span>
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
              aria-controls={`details-${project.slug}`}
            >
              {isExpanded ? "Close project notes −" : "Explore the engineering +"}
            </button>

          </>
        )}
      </div>
            {isExpanded && (
              <div id={`details-${project.slug}`} className={styles.detailsPanel}>
                {project.story && (
                  <div className={styles.story}>
                    <ol className={styles.flow} aria-label={`${project.name} system overview`}>
                      {project.story.flow.map((step, i) => <li key={step} ><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>)}
                    </ol>
                    {(["problem", "system", "outcome"] as const).map((key) => <div key={key}><h4>{key}</h4><p>{project.story![key]}</p></div>)}
                  </div>
                )}
                {project.details?.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            )}
    </article>
  );
}

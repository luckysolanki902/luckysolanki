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
import { FadeIn } from "@/components/shared/FadeIn";
import { BlitzitPlayground } from "./BlitzitPlayground";
import { MaddyCustomPlayground } from "./MaddyCustomPlayground";
import { SpyllPlayground } from "./SpyllPlayground";
import { AvanaPlayground } from "./AvanaPlayground";
import { DailiclePlayground } from "./DailiclePlayground";
import styles from "./Work.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const PLAYGROUND_SLUGS = new Set(["blitzit", "maddycustom", "spyll", "avana", "dailicle"]);

export function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 !== 0;
  const [showPlayground, setShowPlayground] = useState(false);
  const hasPlayground = PLAYGROUND_SLUGS.has(project.slug);

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
          {project.location && (
            <div className={styles.locationTag} aria-label={`Client based in ${project.location}`}>
              <span className={styles.locationDot} />
              {project.location}
            </div>
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

          {hasPlayground && (
            <button
              className={styles.playgroundToggle}
              onClick={() => setShowPlayground(!showPlayground)}
            >
              {showPlayground ? "Hide walkthrough" : "View system walkthrough →"}
            </button>
          )}
        </div>
      </article>

      {showPlayground && project.slug === "blitzit" && <BlitzitPlayground />}
      {showPlayground && project.slug === "maddycustom" && <MaddyCustomPlayground />}
      {showPlayground && project.slug === "spyll" && <SpyllPlayground />}
      {showPlayground && project.slug === "avana" && <AvanaPlayground />}
      {showPlayground && project.slug === "dailicle" && <DailiclePlayground />}
    </FadeIn>
  );
}

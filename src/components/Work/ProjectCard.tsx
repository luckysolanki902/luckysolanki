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
import { HoverText } from "@/components/shared/HoverText";
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
            <HoverText as="h3" variant="card-heading" className={styles.cardName} font="600 18px Quicksand">
              {project.name}
            </HoverText>
            <HoverText as="span" variant="label" className={styles.cardRole} font="500 12px Inter">
              {project.role}
            </HoverText>
          </div>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              <HoverText as="span" variant="cta" font="400 13px Inter">
                {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </HoverText>{" "}
              <span className={styles.linkArrow}>→</span>
            </a>
          )}

          <HoverText as="p" variant="detail" className={styles.cardDescription} font="400 14px Inter">
            {project.description}
          </HoverText>

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

          <HoverText as="p" variant="label" className={styles.cardStack} font="400 13px Inter">
            {project.stack.join(" · ")}
          </HoverText>

          {hasPlayground && (
            <button
              className={styles.playgroundToggle}
              onClick={() => setShowPlayground(!showPlayground)}
            >
              <HoverText as="span" variant="cta" font="500 13px Inter">
                {showPlayground ? "Hide walkthrough" : "View system walkthrough →"}
              </HoverText>
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

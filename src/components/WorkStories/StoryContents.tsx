"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./StoryContents.module.css";

type Chapter = { id: string; label: string };
export function StoryContents({ name, minutes, screenshotCount, chapters, details = [] }: { name: string; minutes: number; screenshotCount: number; chapters: Chapter[]; details?: Chapter[] }) {
  const [active, setActive] = useState("starting-point");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("article section[id]"));
      const current = sections.filter(el => el.getBoundingClientRect().top <= innerHeight * .35).at(-1);
      setActive(current?.id ?? "starting-point");
      const article = document.querySelector("article")?.getBoundingClientRect();
      if (article) setProgress(Math.round(Math.max(0, Math.min(100, -article.top / Math.max(1, article.height - innerHeight) * 100))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  return <aside className={styles.sidebar} aria-label={`${name} story navigation`}>
    <div className={styles.intro}><span>Inside the build</span><strong>{name}</strong><p>{minutes} min read · {screenshotCount} screenshots</p></div>
    <div className={styles.progress} role="progressbar" aria-label="Story reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
    <details className={styles.outline} open>
      <summary>Explore this story <span aria-hidden="true">⌄</span></summary>
      <nav aria-label="Story contents">{chapters.map((chapter, index) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id || (chapter.id === "voice-details" && active.startsWith("voice-detail-")) ? "location" : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{chapter.label}</a>)}</nav>
      {details.length > 0 && <details className={styles.deep}><summary>Go deeper into Blitzy <span aria-hidden="true">＋</span></summary><nav aria-label="Blitzy engineering chapters">{details.map(chapter => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined}>{chapter.label}</a>)}</nav></details>}
    </details>
    <Link className={styles.contact} href="/#contact">Building something similar? <span aria-hidden="true">↗</span></Link>
  </aside>;
}

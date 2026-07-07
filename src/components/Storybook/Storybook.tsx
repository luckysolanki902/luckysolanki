/* ============================================================
   Storybook — the page-turning heart of the home spread.

   Renders one spread at a time inside the book. Turning a page
   swivels it away and the next scene folds up. Cover → Hello →
   a chapter per project → Field Notes → The End. Everything is
   re-narrated by the active ribbon (lens).

   Fully keyboard-driven (←/→, Home/End), with a contents bar for
   direct jumps and an always-present screen-reader/SEO text layer.
   ============================================================ */

"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Smartphone,
  Mail,
  BookOpen,
} from "lucide-react";
import {
  projects,
  bio,
  closing,
  socials,
  experience,
  type Project,
} from "@/lib/data";
import { useLensStore, LENSES } from "@/store/useLensStore";
import { Scene } from "./scenes";
import styles from "./Storybook.module.css";

type Spread =
  | { kind: "cover"; motif: string; accent?: string }
  | { kind: "hello"; motif: string; accent?: string }
  | { kind: "project"; motif: string; accent?: string; project: Project }
  | { kind: "notes"; motif: string; accent?: string }
  | { kind: "end"; motif: string; accent?: string };

export function Storybook() {
  const lens = useLensStore((s) => s.lens);
  const reduce = useReducedMotion();

  const spreads: Spread[] = useMemo(
    () => [
      { kind: "cover", motif: "meadow" },
      { kind: "hello", motif: "meadow" },
      ...projects.map(
        (p): Spread => ({
          kind: "project",
          motif: p.scene,
          accent: p.accent,
          project: p,
        })
      ),
      { kind: "notes", motif: "press" },
      { kind: "end", motif: "meadow" },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const last = spreads.length - 1;

  const go = useCallback(
    (n: number) => {
      setIndex((cur) => {
        const next = Math.max(0, Math.min(last, n));
        setDir(next >= cur ? 1 : -1);
        return next;
      });
    },
    [last]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(last);
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, last, go]);

  const spread = spreads[index];

  const pageVariants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (d: number) => ({ rotateY: d > 0 ? 40 : -40, x: d > 0 ? 80 : -80, opacity: 0 }),
        center: { rotateY: 0, x: 0, opacity: 1 },
        exit: (d: number) => ({ rotateY: d > 0 ? -40 : 40, x: d > 0 ? -80 : 80, opacity: 0 }),
      };

  return (
    <div className={styles.book}>
      {/* ---- The living spread ---- */}
      <div className={styles.viewport}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={index}
            className={styles.spread}
            custom={dir}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ transformOrigin: dir > 0 ? "left center" : "right center" }}
          >
            <SpreadView spread={spread} index={index} lens={lens} />
          </motion.div>
        </AnimatePresence>

        <span className={styles.spine} aria-hidden />
      </div>

      {/* ---- Page turners ---- */}
      <button
        className={`${styles.turn} ${styles.turnPrev}`}
        onClick={() => go(index - 1)}
        disabled={index === 0}
        aria-label="Previous page"
      >
        <ArrowLeft size={20} />
      </button>
      <button
        className={`${styles.turn} ${styles.turnNext}`}
        onClick={() => go(index + 1)}
        disabled={index === last}
        aria-label="Next page"
      >
        <ArrowRight size={20} />
      </button>

      {/* ---- Contents bar ---- */}
      <nav className={styles.contents} aria-label="Table of contents">
        {spreads.map((s, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to ${chapterTitle(s)}`}
            aria-current={i === index ? "true" : undefined}
          >
            <span className={styles.dotLabel}>{chapterTitle(s)}</span>
          </button>
        ))}
      </nav>

      {/* ---- Always-present text for crawlers + no-JS + screen readers ---- */}
      <SeoLayer lens={lens} />
    </div>
  );
}

/* -----------------------------------------------------------
   A single spread's contents.
   ----------------------------------------------------------- */
function SpreadView({
  spread,
  index,
  lens,
}: {
  spread: Spread;
  index: number;
  lens: ReturnType<typeof useLensStore.getState>["lens"];
}) {
  return (
    <>
      <div className={styles.leftPage}>
        <Scene motif={spread.motif} active accent={spread.accent} />
      </div>

      <div className={styles.rightPage}>
        {spread.kind === "cover" && <CoverText />}
        {spread.kind === "hello" && <HelloText lens={lens} />}
        {spread.kind === "project" && (
          <ProjectText project={spread.project} lens={lens} n={index - 1} />
        )}
        {spread.kind === "notes" && <NotesText />}
        {spread.kind === "end" && <EndText lens={lens} />}
      </div>
    </>
  );
}

function CoverText() {
  return (
    <div className={styles.cover}>
      <span className={`${styles.eyebrow} hand`}>a pop-up portfolio</span>
      <h1 className={styles.coverTitle}>Lucky Solanki</h1>
      <p className={styles.coverSub}>
        Founder, engineer, and builder of the hard parts of software.
      </p>
      <span className={`${styles.turnHint} hand`}>turn the page →</span>
    </div>
  );
}

function HelloText({ lens }: { lens: "hire" | "commission" | "back" }) {
  const b = bio[lens];
  return (
    <div className={styles.text}>
      <span className={styles.chapter}>Hello</span>
      <h2 className={styles.heading}>{b.headline}</h2>
      {b.body.map((p, i) => (
        <p key={i} className={styles.para}>
          {p}
        </p>
      ))}
      <ul className={styles.exp}>
        {experience.map((e) => (
          <li key={e.company} className={styles.expItem}>
            <span className={styles.expCompany}>{e.company}</span>
            <span className={styles.expRole}>{e.role}</span>
            <span className={styles.expPeriod}>{e.period}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectText({
  project,
  lens,
  n,
}: {
  project: Project;
  lens: "hire" | "commission" | "back";
  n: number;
}) {
  const frame = project.lenses[lens];
  return (
    <div className={styles.text}>
      <span className={styles.chapter}>
        Chapter {n} · {project.year}
      </span>
      <h2 className={styles.heading}>{project.name}</h2>
      {frame && <p className={styles.hook}>{frame.headline}</p>}
      <p className={styles.para}>{frame ? frame.frame : project.description}</p>

      <div className={styles.stack}>
        {project.stack.map((s) => (
          <span key={s} className={styles.chip}>
            {s}
          </span>
        ))}
      </div>

      {project.metrics && <p className={styles.metric}>{project.metrics}</p>}

      <div className={styles.links}>
        {project.url && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <ExternalLink size={15} /> Visit
          </a>
        )}
        {project.playStore && (
          <a href={project.playStore} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <Smartphone size={15} /> Play Store
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <Github size={15} /> Code
          </a>
        )}
        <span className={styles.roleTag}>{project.role}</span>
      </div>
    </div>
  );
}

function NotesText() {
  return (
    <div className={styles.text}>
      <span className={styles.chapter}>Field Notes</span>
      <h2 className={styles.heading}>Things I learned building this stuff.</h2>
      <p className={styles.para}>
        Long-form write-ups on the interesting problems — undo/redo systems,
        plugin architecture, MCP servers, testing at scale, and more.
      </p>
      <Link href="/log" className={styles.bigLink}>
        <BookOpen size={16} /> Open the field notes
      </Link>
    </div>
  );
}

function EndText({ lens }: { lens: "hire" | "commission" | "back" }) {
  const c = closing[lens];
  return (
    <div className={styles.text}>
      <span className={styles.chapter}>The End · or the start</span>
      <h2 className={styles.heading}>{c.headline}</h2>
      <p className={styles.para}>{c.body}</p>
      <a href={`mailto:${socials.email}`} className={styles.bigLink}>
        <Mail size={16} /> {socials.email}
      </a>
      <div className={styles.socials}>
        <a href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={socials.x} target="_blank" rel="noopener noreferrer">X</a>
      </div>
      <span className={`${styles.cta} hand`}>{LENSES[lens].cta} →</span>
    </div>
  );
}

/* Plain, always-rendered content for SEO / no-JS / screen readers. */
function SeoLayer({ lens }: { lens: "hire" | "commission" | "back" }) {
  return (
    <div className={styles.srOnly}>
      <h2>{bio[lens].headline}</h2>
      {bio[lens].body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {projects.map((p) => {
        const f = p.lenses[lens];
        return (
          <section key={p.slug}>
            <h3>
              {p.name} — {p.tagline}
            </h3>
            <p>{f ? f.frame : p.description}</p>
            <p>Role: {p.role}. Stack: {p.stack.join(", ")}.</p>
            {p.url && <a href={p.url}>{p.name} website</a>}
          </section>
        );
      })}
      <p>
        Contact: <a href={`mailto:${socials.email}`}>{socials.email}</a>
      </p>
    </div>
  );
}

function chapterTitle(s: Spread): string {
  switch (s.kind) {
    case "cover":
      return "Cover";
    case "hello":
      return "Hello";
    case "project":
      return s.project.name;
    case "notes":
      return "Field Notes";
    case "end":
      return "Contact";
  }
}

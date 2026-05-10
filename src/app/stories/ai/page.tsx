/* ============================================================
   Story page: How I use AI in practice
   Tone: practical, sober, specific.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import styles from "../story.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "How I use AI in practice - Lucky Solanki",
  description:
    "A practical note on how I use Claude Code and GitHub Copilot for research, technical decisions, implementation, and verification.",
  alternates: {
    canonical: "https://luckysolanki.com/stories/ai",
  },
  openGraph: {
    title: "How I use AI in practice - Lucky Solanki",
    description:
      "A practical note on how I use Claude Code and GitHub Copilot for research, technical decisions, implementation, and verification.",
    url: "https://luckysolanki.com/stories/ai",
    siteName: "Lucky Solanki",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How I use AI in practice - Lucky Solanki",
    description:
      "A practical note on how I use Claude Code and GitHub Copilot for research, technical decisions, implementation, and verification.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
};

const tools = [
  {
    name: "Claude Code",
    role: "Research, codebase inspection, and planning",
    description:
      "Best when I need to inspect an unfamiliar codebase, compare implementation paths, gather documentation, trace dependencies, or turn a rough problem into a concrete plan. It helps with research and technical decisions, not just code generation.",
  },
  {
    name: "GitHub Copilot",
    role: "Implementation, refactoring, and fast iteration",
    description:
      "Best once the direction is clear: repetitive code, schema work, file-to-file refactors, tests, and quick editor-side iteration. It compresses the mechanical part of shipping, but I still review and verify everything it produces.",
  },
];

export default function AIPage() {
  return (
    <article className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>Working style</span>
          <h1 className={styles.heading}>How I use AI in practice.</h1>
          <p className={styles.lede}>
            Claude Code and GitHub Copilot do far more than syntax work for me.
            They accelerate research, planning, implementation, and verification
            without replacing judgment.
          </p>
        </header>

        <div className={styles.prose}>
          <p>
            If AI only helped with syntax, I would not care about it nearly as
            much. The bigger value is how quickly it helps me gather context,
            inspect unfamiliar code, compare options, and move from a rough
            problem to a workable plan.
          </p>
          <p>
            Technical decisions still get made the normal way: understand the
            product constraint, inspect the system, and choose tradeoffs
            deliberately. AI helps during that process too. It speeds up
            documentation lookup, alternative evaluation, edge-case discovery,
            codebase exploration, and first-pass architecture work.
          </p>
          <p>
            Once the direction is clear, Claude Code and Copilot make execution
            dramatically faster. Refactors that used to take hours become much
            shorter loops. Boilerplate, repetitive handlers, schema changes,
            test scaffolding, repo-wide edits, and implementation follow-through
            move far faster than they used to. In practice, the whole workflow
            feels closer to 20x faster than before.
          </p>

          <h2 className={styles.subheading}>How the work actually splits</h2>
        </div>

        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <div key={tool.name} className={styles.toolCard}>
              <div className={styles.toolHeader}>
                <span className={styles.toolName}>{tool.name}</span>
                <span className={styles.toolRole}>{tool.role}</span>
              </div>
              <p className={styles.toolDesc}>{tool.description}</p>
            </div>
          ))}
        </div>

        <div className={styles.prose}>
          <p>
            Claude Code is strongest for repo-level research and decision
            support. Copilot is strongest once the path is clear and I want to
            move quickly inside the editor. Together they speed up the whole
            loop, not just typing.
          </p>
          <p>
            I still debug by reading the code and tracing the system. I still
            decide what is correct, what is risky, and what actually ships.
            That is the useful frame for me: AI is leverage across the full
            loop, from research to delivery. It makes me faster at thinking,
            faster at executing, and faster at verifying. It does not remove
            the need for judgment.
          </p>
        </div>

        <footer className={styles.closing}>
          <Link href="/stories/journey" className={styles.nextLink}>
            ← How I got into software
          </Link>
        </footer>
      </div>
    </article>
  );
}

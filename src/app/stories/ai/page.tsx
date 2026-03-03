/* ============================================================
   Story page: On using AI
   Tone: honest, practical. No hype. No fear.
   Just what it actually looks like in a real workflow.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import styles from "../story.module.css";

export const metadata: Metadata = {
  title: "On using AI — Lucky Solanki",
  description:
    "I use AI every day. Here's what that actually looks like — practical thoughts, not hype.",
};

const tools = [
  {
    name: "ChatGPT",
    role: "Thinking out loud",
    description:
      "Architecture decisions, edge cases, explaining a confusing API. Useful when the problem is still unclear and I need to pressure-test my thinking before writing code.",
  },
  {
    name: "GitHub Copilot",
    role: "The everyday pair",
    description:
      "Boilerplate, repetitive patterns, typed schemas — but also refactoring across files and tracing how a change ripples through a codebase. It handles both the parts I already know and the parts that need more context than fits in my head. I still read everything it produces.",
  },
  {
    name: "Custom scripts",
    role: "Automate once, never again",
    description:
      "When a task is repetitive and mechanical, I describe it, get a script, verify it, and file it away. The Photoshop JSX automation from 2022 was the first version of this pattern.",
  },
];

export default function AIPage() {
  return (
    <article className={styles.page}>
      <div className={styles.container}>
        {/* Back link */}
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>Perspective</span>
          <h1 className={styles.heading}>On using AI.</h1>
          <p className={styles.lede}>
            I use it every day. Here&apos;s what that actually looks like — and
            what it doesn&apos;t change.
          </p>
        </header>

        {/* Body */}
        <div className={styles.prose}>
          <p>
            When ChatGPT launched in late 2022, the first thing I did was ask it
            to write a Python script to batch-convert images to WebP. It worked.
            That was enough to take it seriously.
          </p>
          <p>
            What changed wasn&apos;t that I stopped writing code. It&apos;s
            that I started spending more time thinking about what to build. The
            mechanical parts — translating intent into syntax, looking up API
            signatures, writing the same handler for the fifth time — got faster.
            The interesting parts — architecture, what to prioritise, what not to
            build — got more time.
          </p>
          <p>
            The people who use AI best aren&apos;t the ones who prompt most
            cleverly. They&apos;re the ones who know what they want clearly
            enough to describe it. That clarity is a skill. AI makes the gap
            between a clear idea and working code smaller. It doesn&apos;t
            generate the clarity.
          </p>

          <h2 className={styles.subheading}>What I actually use</h2>
        </div>

        {/* Tools grid */}
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
            I still debug by reading code. I still review everything that ships.
            The tools handle translation. Judgment stays mine.
          </p>
          <p>
            That&apos;s a sustainable way to use it. Not as a replacement for
            knowing what you&apos;re doing — as an accelerant once you do.
          </p>
        </div>

        {/* Closing */}
        <footer className={styles.closing}>
          <Link href="/stories/journey" className={styles.nextLink}>
            ← The long way around
          </Link>
        </footer>
      </div>
    </article>
  );
}

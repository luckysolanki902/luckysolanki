/* ============================================================
   Story page: How I use AI in practice
   Tone: practical, sober, specific. One voice — no tool ranking.
   ============================================================ */

import type { Metadata } from "next";
import Link from "next/link";
import styles from "../story.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "How I use AI in practice - Lucky Solanki",
  description:
    "A practical note on how tools like GitHub Copilot and Claude Code fit into my workflow — where they earn their keep and where judgment still lives.",
  alternates: {
    canonical: "https://luckysolanki.com/stories/ai",
  },
  openGraph: {
    title: "How I use AI in practice - Lucky Solanki",
    description:
      "A practical note on how tools like GitHub Copilot and Claude Code fit into my workflow — where they earn their keep and where judgment still lives.",
    url: "https://luckysolanki.com/stories/ai",
    siteName: "Lucky Solanki",
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How I use AI in practice - Lucky Solanki",
    description:
      "A practical note on how tools like GitHub Copilot and Claude Code fit into my workflow — where they earn their keep and where judgment still lives.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
};

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
            Tools like GitHub Copilot and Claude Code have changed every phase
            of how I work — not just how fast I type, but how quickly I can
            think through a problem and move to something working.
          </p>
        </header>

        <div className={styles.prose}>
          <p>
            If AI only saved keystrokes, I would not care much about it. The
            bigger shift is cognitive. Context gathering, codebase traversal,
            option comparison, first-pass architecture — all of that moves
            faster now. What used to be an afternoon of chasing documentation
            and tracing dependencies can take twenty minutes.
          </p>
          <p>
            I use tools like GitHub Copilot and Claude Code. Both do the same
            core thing well: read context, reason about it, generate useful
            output. Between the two, I have settled into preferring GitHub
            Copilot as my primary tool. It lives inside VS Code, the editor I
            already think in — I do not context-switch, I do not break flow, it
            is just there. The pricing is also meaningfully better for the
            volume of work I push through it every day.
          </p>

          <h2 className={styles.subheading}>Where AI earns its keep</h2>

          <p>
            It is not autocomplete. Before I write a line of code: reading an
            unfamiliar codebase, tracing how a feature actually works end to
            end, comparing two implementation paths before committing to one.
            During implementation: schema changes, repetitive handlers,
            file-to-file refactors, test scaffolding, boilerplate that has to
            be correct but does not need to be interesting. After: reviewing
            the diff, catching edge cases I missed, spotting places where I
            over-engineered.
          </p>
          <p>
            The whole loop — from problem to shipped code — moves differently
            now. Refactors that used to cost hours become short feedback
            cycles. I can explore an option I would have skipped before just
            because the cost of trying it is so low. That changes what I build,
            not just how fast I build it.
          </p>

          <h2 className={styles.subheading}>Where judgment still lives</h2>

          <p>
            I build integrations, realtime features, and payment flows. These
            are systems where "often correct" is not good enough. A sync
            conflict, a race condition, a missing idempotency key — the AI will
            generate plausible code for all of these and sometimes generate it
            wrong. Every output gets read. Every pattern gets checked against
            how the actual system behaves.
          </p>
          <p>
            The tools are fast and frequently right. But I still decide what
            ships. I still read the error and trace the system. I still catch
            the case where a generated pattern is technically valid but wrong
            for the product. That work has not changed — only the speed at
            which everything around it moves.
          </p>
          <p>
            The frame that works for me: AI is leverage across the full loop,
            from research to delivery. Not a replacement for knowing what you
            are doing, but a serious force multiplier on the parts of the work
            that did not need to be slow.
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

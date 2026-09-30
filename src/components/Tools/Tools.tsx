/* ============================================================
   Tools, "What I Build With"
   Plain text grid. No icons. No logos. No progress bars.
   3 columns desktop / 2 tablet / 1 mobile.
   "Also:" line for overflow.
   ============================================================ */

"use client";


import { SECTION_IDS } from "@/lib/constants";
import { SectionLabel } from "@/components/shared/SectionLabel";
import { HoverText } from "@/components/shared/HoverText";
import styles from "./Tools.module.css";

const columns = [
  { heading: "Backend foundations", items: ["TypeScript, Node.js, Fastify, Python", "PostgreSQL, MongoDB, Redis", "Queues, workers, and reliable job processing"] },
  { heading: "AI that can take action", items: ["MCP, scoped tools, and shared executors", "RAG, vector search, and realtime voice", "Memory, model routing, and evaluations"] },
  { heading: "Products that hold together", items: ["OAuth, webhooks, and bidirectional sync", "Payments, subscriptions, and operations", "React, Next.js, Flutter, and deployment"] },
];

export function Tools() {
  return (
    <section id={SECTION_IDS.tools} className={styles.section}>
      <div className={styles.container}>
        <SectionLabel label="Stack" />

        <HoverText as="h2" variant="heading" className={styles.heading} font="600 24px Quicksand">
            What I work with
          </HoverText>

        <div className={styles.grid}>
          {columns.map((col) => (
            <div key={col.heading} className={styles.column}>
                <h3 className={styles.columnHeading}>{col.heading}</h3>
                {col.items.map((item) => (
                  <p key={item} className={styles.columnItem}>{item}</p>
                ))}
              </div>
          ))}
        </div>

        <p className={styles.also}>The project comes first. The stack follows the constraints.</p>
      </div>
    </section>
  );
}

/* Blog teaser — a few recent posts as playful sticky notes. */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { allPosts } from "@/lib/posts";
import { Reveal } from "./Reveal";
import styles from "./Site.module.css";

const NOTE_COLORS = ["var(--c-butter)", "var(--c-sky)", "var(--c-blush)"];
const NOTE_TILTS = ["-1.8deg", "1.6deg", "-1.2deg"];

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Notes() {
  const featured = allPosts.slice(0, 3);

  return (
    <section id="blog" className={styles.section}>
      <Reveal>
        <p className={styles.kicker}>the blog</p>
        <h2 className={styles.sectionTitle}>Writing about the fun problems.</h2>
        <p className={styles.sectionLead}>
          Deep-dives on the systems I&apos;ve built: architecture, undo/redo, MCP,
          payments, testing. Written from the code, not from memory.
        </p>
      </Reveal>

      <div className={styles.notesGrid}>
        {featured.map((post, i) => (
          <Reveal key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className={styles.stickyNote}
              style={{
                ["--note" as string]: NOTE_COLORS[i % NOTE_COLORS.length],
                ["--tilt" as string]: NOTE_TILTS[i % NOTE_TILTS.length],
              }}
            >
              <span className={styles.pin} aria-hidden />
              <div className={styles.noteTags}>
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className={styles.noteTag}>
                    {t}
                  </span>
                ))}
              </div>
              <h3 className={styles.noteTitle}>{post.title}</h3>
              <p className={styles.noteSummary}>{post.summary}</p>
              <span className={styles.noteMeta}>
                {shortDate(post.date)} · {post.readingMins} min read
                <ArrowRight size={15} className={styles.noteArrow} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <Link href="/blog" className={styles.allNotes}>
          read the whole blog <ArrowRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}

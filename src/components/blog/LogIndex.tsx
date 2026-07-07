/* LogIndex — the blog index: search + tag filter over the post
   list. Client-side, instant, no page reloads. */

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import { allPosts, allTags } from "@/lib/posts";
import styles from "./Blog.module.css";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function LogIndex() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return allPosts.filter((p) => {
      const matchTag = !tag || p.tags.includes(tag);
      const matchText =
        !needle ||
        p.title.toLowerCase().includes(needle) ||
        p.summary.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle));
      return matchTag && matchText;
    });
  }, [q, tag]);

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={17} className={styles.searchIcon} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the blog…"
            className={styles.search}
            aria-label="Search the blog"
          />
        </div>

        <div className={styles.tagRow}>
          <button
            className={`${styles.tag} ${tag === null ? styles.tagOn : ""}`}
            onClick={() => setTag(null)}
          >
            All
          </button>
          {allTags.map((t) => (
            <button
              key={t}
              className={`${styles.tag} ${tag === t ? styles.tagOn : ""}`}
              onClick={() => setTag(tag === t ? null : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <p className={styles.empty}>No posts match that yet. Try another word :)</p>
      ) : (
        <ul className={styles.postList}>
          {results.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className={styles.postRow}>
                <div className={styles.postRowMain}>
                  <div className={styles.postTags}>
                    {p.tags.map((t) => (
                      <span key={t} className={styles.postTag}>
                        {t}
                      </span>
                    ))}
                    {p.draft && <span className={styles.draft}>draft</span>}
                  </div>
                  <h2 className={styles.postTitle}>
                    {p.title}
                    <ArrowUpRight size={18} className={styles.postArrow} />
                  </h2>
                  <p className={styles.postSummary}>{p.summary}</p>
                  <span className={styles.postMeta}>
                    {fmtDate(p.date)} · {p.readingMins} min read
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { blogPosts, blogTags } from "@/lib/blog";
import styles from "./BlogIndex.module.css";

export function BlogIndex() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blogPosts.filter((post) => {
      const matchesTag = tag ? post.tags.includes(tag) : true;
      const matchesQuery = q
        ? [post.title, post.subtitle, post.excerpt, post.tags.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(q)
        : true;
      return matchesTag && matchesQuery;
    });
  }, [query, tag]);

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            className={styles.search}
          />
        </div>

        <div className={styles.tags}>
          <button
            type="button"
            onClick={() => setTag(null)}
            className={!tag ? styles.activeTag : ""}
          >
            All
          </button>
          {blogTags.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setTag(tag === item ? null : item)}
              className={tag === item ? styles.activeTag : ""}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {posts.length > 0 ? (
        <div className={styles.list}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.post}>
              <span className={styles.meta}>
                {post.project} · {post.readTime} read · {post.date}
              </span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <div className={styles.postTags}>
                {post.tags.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p>No posts match that filter.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag(null);
            }}
          >
            <X size={14} />
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { getFeaturedBlogPosts } from "@/lib/blog";
import { HoverText } from "@/components/shared/HoverText";
import styles from "./BlogPreview.module.css";

const featuredPosts = getFeaturedBlogPosts();

export function BlogPreview() {
  return (
    <section id="blog" className={styles.blog}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Blog</p>
            <h2 className={styles.heading}>Notes from shipped systems.</h2>
          </div>
          <Link href="/blog" className={styles.allLink}>
            See all posts →
          </Link>
        </div>

        <div className={styles.grid}>
          {featuredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
              <span className={styles.meta}>
                {post.project} · {post.readTime} read
              </span>
              <HoverText
                as="h3"
                variant="card-heading"
                className={styles.cardTitle}
                font="600 18px Quicksand"
              >
                {post.title}
              </HoverText>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <div className={styles.tags}>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

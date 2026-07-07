/* /blog/[slug], the blog reader. */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { posts, getPost } from "@/lib/posts";
import { PostBody } from "@/components/blog/PostBody";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import blog from "@/components/blog/Blog.module.css";

export const dynamic = "force-static";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title}, Blog`,
    description: post.summary,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <>
      <SiteNav />
      <main id="main-content">
        <article className={blog.article}>
          <Link href="/blog" className={blog.back}>
            <ArrowLeft size={15} /> all posts
          </Link>

          <div className={blog.readTags}>
            {post.tags.map((t) => (
              <span key={t} className={blog.postTag}>
                {t}
              </span>
            ))}
          </div>

          <h1 className={blog.articleTitle}>{post.title}</h1>
          <div className={blog.articleMeta}>
            <span>{formatDate(post.date)}</span>
            <span>·</span>
            <span>{post.readingMins} min read</span>
          </div>

          <div className={blog.articleDivider} />

          <PostBody body={post.body} />
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

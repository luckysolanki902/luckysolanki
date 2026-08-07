import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MermaidDiagram } from "@/components/Blog/MermaidDiagram";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { siteConfig } from "@/lib/data";
import styles from "../blog.module.css";

export const dynamic = "force-static";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post not found - Lucky Solanki",
    };
  }

  const url = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} - Lucky Solanki`,
    description: post.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} - Lucky Solanki`,
      description: post.excerpt,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      images: ["/og-image2.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Lucky Solanki`,
      description: post.excerpt,
      images: ["/og-image2.png"],
      creator: "@luckysolanki902",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <article className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.articleContainer}>
        <Link href="/blog" className={styles.backLink}>
          ← Blog
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>{post.project}</span>
          <h1 className={styles.heading}>{post.title}</h1>
          <p className={styles.lede}>{post.subtitle}</p>
          <div className={styles.meta}>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} read</span>
          </div>
          <div className={styles.tagRow}>
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </header>

        <div className={styles.content}>
          {post.sections.map((section) => (
            <section key={section.heading} className={styles.section}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.quote && (
                <blockquote className={styles.quote}>{section.quote}</blockquote>
              )}
              {section.table && (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                          {row.map((cell) => (
                            <td key={cell}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.codeBlock && (
                <figure className={styles.codeBlock}>
                  {section.codeBlock.title && (
                    <figcaption>{section.codeBlock.title}</figcaption>
                  )}
                  <pre>
                    <code>{section.codeBlock.code}</code>
                  </pre>
                </figure>
              )}
              {section.diagram && (
                <MermaidDiagram
                  title={section.diagram.title}
                  code={section.diagram.code}
                />
              )}
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          <Link href="/blog" className={styles.backLink}>
            ← All posts
          </Link>
        </footer>
      </div>
    </article>
  );
}

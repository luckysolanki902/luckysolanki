import type { Metadata } from "next";
import Link from "next/link";
import { BlogIndex } from "@/components/Blog/BlogIndex";
import { siteConfig } from "@/lib/data";
import styles from "./blog.module.css";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog - Lucky Solanki",
  description:
    "Technical and founder notes from shipped products: Blitzit, MaddyCustom, Avana, Spyll, AutoRemov, and Dailicle.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Blog - Lucky Solanki",
    description:
      "Technical and founder notes from shipped products: Blitzit, MaddyCustom, Avana, Spyll, AutoRemov, and Dailicle.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Lucky Solanki",
    description:
      "Technical and founder notes from shipped products: Blitzit, MaddyCustom, Avana, Spyll, AutoRemov, and Dailicle.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
};

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back
        </Link>

        <header className={styles.header}>
          <span className={styles.eyebrow}>Blog</span>
          <h1 className={styles.heading}>Notes from shipped systems.</h1>
          <p className={styles.lede}>
            Technical and founder writing from the products I have built:
            backend architecture, commerce operations, AI research tools,
            social systems, migrations, and publishing.
          </p>
        </header>

        <BlogIndex />
      </div>
    </main>
  );
}

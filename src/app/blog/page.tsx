/* /blog, the blog index. */

import type { Metadata } from "next";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { LogIndex } from "@/components/blog/LogIndex";
import blog from "@/components/blog/Blog.module.css";

export const metadata: Metadata = {
  title: "Blog · Lucky Solanki",
  description:
    "Deep-dives on the systems I've built: architecture, undo/redo, MCP servers, payments, and testing.",
};

export const dynamic = "force-static";

export default function BlogPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className={blog.logMain}>
        <p className={blog.logKicker}>the blog</p>
        <h1 className={blog.logTitle}>Writing about the fun problems.</h1>
        <p className={blog.logLead}>
          Deep-dives on the systems I&apos;ve built, written from the actual codebase,
          not from memory. Search or filter by tag.
        </p>
        <LogIndex />
      </main>
      <SiteFooter />
    </>
  );
}

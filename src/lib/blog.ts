import { autoremovImageJobSystem } from "@/content/blog/autoremov-image-job-system";
import { avanaInvestmentResearchAssistant } from "@/content/blog/avana-investment-research-assistant";
import { blitzit3PlatformRewrite } from "@/content/blog/blitzit-3-platform-rewrite";
import { blitzitIntegrationPluginSystem } from "@/content/blog/blitzit-integration-plugin-system";
import { blitzitUndoRedoChangeJournal } from "@/content/blog/blitzit-undo-redo-change-journal";
import { dailicleWeeklyReadingRitual } from "@/content/blog/dailicle-weekly-reading-ritual";
import { maddycustomAdminOps } from "@/content/blog/maddycustom-admin-ops";
import { spyllAnonymousCollegeNetwork } from "@/content/blog/spyll-anonymous-college-network";

export interface BlogDiagram {
  title: string;
  code: string;
}

export interface BlogCodeBlock {
  title?: string;
  language?: string;
  code: string;
}

export interface BlogTable {
  headers: string[];
  rows: string[][];
}

export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  quote?: string;
  codeBlock?: BlogCodeBlock;
  table?: BlogTable;
  diagram?: BlogDiagram;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  project:
    | "Blitzit"
    | "MaddyCustom"
    | "Avana"
    | "Spyll"
    | "AutoRemov"
    | "Dailicle";
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  sections: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  blitzit3PlatformRewrite,
  blitzitUndoRedoChangeJournal,
  blitzitIntegrationPluginSystem,
  maddycustomAdminOps,
  avanaInvestmentResearchAssistant,
  spyllAnonymousCollegeNetwork,
  autoremovImageJobSystem,
  dailicleWeeklyReadingRitual,
];

export const blogTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags))).sort();

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedBlogPosts() {
  return blogPosts.filter((post) => post.featured).slice(0, 2);
}

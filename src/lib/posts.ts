/* ============================================================
   FIELD NOTES, blog data.

   Posts are block-based (not MDX yet) so the renderer stays
   simple now and the real write-ups can drop straight in later.
   These are PLACEHOLDERS, summaries are real, bodies are stubs
   until the repo research pass fills them in.
   ============================================================ */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang?: string; code: string };

export interface Post {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  date: string; // ISO
  readingMins: number;
  project?: string;
  draft?: boolean;
  body: Block[];
}

const STUB: Block[] = [
  {
    type: "p",
    text: "This write-up is on its way. The short version is below, the full deep-dive, with code and diagrams, lands soon.",
  },
  { type: "h2", text: "What this covers" },
  {
    type: "p",
    text: "A walk through the problem, the design I landed on, the trade-offs, and what I'd do differently. Written from the actual codebase, not from memory.",
  },
  {
    type: "code",
    lang: "ts",
    code: "// a taste of the shape of things\nexport function comingSoon() {\n  return \"full post in progress\";\n}",
  },
  {
    type: "quote",
    text: "The interesting part isn't that it works, it's why the earlier version didn't.",
  },
];

export const posts: Post[] = [
  {
    slug: "blitzit-plugin-architecture",
    title: "Turning integrations into ~300-line plugins",
    summary:
      "How Blitzit's backend went from 10+ files per integration to a single, self-contained plugin, and why that changed everything about shipping new connectors.",
    tags: ["Architecture", "Blitzit", "Backend"],
    date: "2026-06-20",
    readingMins: 9,
    project: "blitzit",
    draft: true,
    body: STUB,
  },
  {
    slug: "blitzit-undo-redo",
    title: "Designing an undo/redo system that never lies",
    summary:
      "Command history, inverse operations, and keeping optimistic UI honest across a synced, multi-device task app.",
    tags: ["Architecture", "Blitzit", "Realtime"],
    date: "2026-06-10",
    readingMins: 11,
    project: "blitzit",
    draft: true,
    body: STUB,
  },
  {
    slug: "mcp-server-13-tools",
    title: "Shipping an MCP server with 13 AI-callable tools",
    summary:
      "OAuth 2.1 (PKCE), JSON-RPC 2.0 over streamable HTTP, and what it takes to let an LLM safely drive your product.",
    tags: ["AI", "MCP", "Blitzit"],
    date: "2026-05-28",
    readingMins: 8,
    project: "blitzit",
    draft: true,
    body: STUB,
  },
  {
    slug: "blitzit-3-0-testing",
    title: "How we test the Blitzit 3.0 backend",
    summary:
      "The testing strategy behind the rebuild, timezone-aware scheduling, sync correctness, and catching the bugs that only show up at 2am in another timezone.",
    tags: ["Testing", "Blitzit", "Backend"],
    date: "2026-05-15",
    readingMins: 10,
    project: "blitzit",
    draft: true,
    body: STUB,
  },
  {
    slug: "blitzit-3-0-vs-2-0",
    title: "Blitzit 3.0 vs 2.0: what a rewrite actually buys you",
    summary:
      "A candid before/after of the backend rewrite, modularity, plugin architecture, and the parts of 2.0 that were quietly holding everything back.",
    tags: ["Architecture", "Blitzit", "Backend"],
    date: "2026-05-02",
    readingMins: 12,
    project: "blitzit",
    draft: true,
    body: STUB,
  },
  {
    slug: "maddycustom-payments-fallback",
    title: "Never drop an order: multi-gateway payments with fallback",
    summary:
      "Building resilient checkout at MaddyCustom, Razorpay with a PayU fallback, idempotency, and the analytics to see where money leaks.",
    tags: ["Payments", "MaddyCustom", "Ecommerce"],
    date: "2026-04-18",
    readingMins: 9,
    project: "maddycustom",
    draft: true,
    body: STUB,
  },
  {
    slug: "avana-multi-agent",
    title: "A multi-agent research app, built solo",
    summary:
      "Orchestrator and specialist handoffs, realtime voice over WebRTC, and payments, the architecture behind Avana.",
    tags: ["AI", "Avana", "Realtime"],
    date: "2026-04-02",
    readingMins: 8,
    project: "avana",
    draft: true,
    body: STUB,
  },
];

export const allPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

export const allTags = Array.from(
  new Set(posts.flatMap((p) => p.tags))
).sort();

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

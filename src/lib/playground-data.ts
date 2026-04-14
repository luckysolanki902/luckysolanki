/* ============================================================
   PLAYGROUND DATA — Architecture pipelines for each project.
   Each project defines nodes (what) and edges (data flow).
   Nodes can be clicked for implementation detail.
   ============================================================ */

export interface PipelineNode {
  id: string;
  label: string;
  detail: string;
  icon: string; // emoji for visual shorthand
  /** Grid column (1-based). Rows auto-flow. */
  col: number;
  row: number;
}

export interface PipelineEdge {
  from: string;
  to: string;
  label?: string;
  /** Delay before this edge animates (stagger) */
  delay: number;
}

export interface PlaygroundPipeline {
  slug: string;
  title: string;
  subtitle: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  /** Auto-play data packet loop interval in ms */
  loopInterval: number;
}

export const playgrounds: Record<string, PlaygroundPipeline> = {
  blitzit: {
    slug: "blitzit",
    title: "How Blitzit syncs everything",
    subtitle: "Plugin SDK → MCP Server → BullMQ → Integrations",
    loopInterval: 4000,
    nodes: [
      { id: "task", label: "Task Created", detail: "User creates a task in Blitzit. Triggers sync pipeline.", icon: "📝", col: 1, row: 1 },
      { id: "plugin", label: "Plugin SDK", detail: "Single-file plugin (~400 LOC) handles normalization. Cut new integrations from 10+ files to one.", icon: "🔌", col: 2, row: 1 },
      { id: "mcp", label: "MCP Server", detail: "13 AI-callable tools via JSON-RPC 2.0 over Streamable HTTP. OAuth 2.1 with PKCE.", icon: "🤖", col: 2, row: 2 },
      { id: "queue", label: "BullMQ", detail: "Redis-backed job queue. Handles retries, rate limiting, and 21-timezone scheduling.", icon: "📬", col: 3, row: 1 },
      { id: "asana", label: "Asana", detail: "Deep bidirectional sync. Assignees, due dates, subtasks, comments.", icon: "📋", col: 4, row: 1 },
      { id: "notion", label: "Notion", detail: "Pages ↔ Tasks. Properties mapped to custom fields.", icon: "📓", col: 4, row: 2 },
      { id: "gcal", label: "Google Calendar", detail: "Events sync across 21 timezones. Handles recurring events.", icon: "📅", col: 4, row: 3 },
    ],
    edges: [
      { from: "task", to: "plugin", label: "normalize", delay: 0 },
      { from: "task", to: "mcp", label: "AI route", delay: 200 },
      { from: "plugin", to: "queue", label: "enqueue", delay: 600 },
      { from: "mcp", to: "queue", label: "enqueue", delay: 800 },
      { from: "queue", to: "asana", label: "sync", delay: 1200 },
      { from: "queue", to: "notion", label: "sync", delay: 1400 },
      { from: "queue", to: "gcal", label: "sync", delay: 1600 },
    ],
  },

  spyll: {
    slug: "spyll",
    title: "How Spyll matches users",
    subtitle: "Join → Redis Pub/Sub → Match → Encrypted Chat",
    loopInterval: 3500,
    nodes: [
      { id: "user", label: "Student opens app", detail: "User picks a college and enters the anonymous matching pool.", icon: "👤", col: 1, row: 1 },
      { id: "pool", label: "Redis Pool", detail: "Pub/Sub matching engine. Sub-second pairing across 1,300+ colleges.", icon: "🔴", col: 2, row: 1 },
      { id: "match", label: "Match Engine", detail: "Pairs two users from same college. Handles race conditions and stale connections.", icon: "🔀", col: 3, row: 1 },
      { id: "chat", label: "Socket.IO Chat", detail: "Real-time encrypted 1:1 messaging. Messages never stored server-side.", icon: "💬", col: 4, row: 1 },
      { id: "voice", label: "WebRTC Voice", detail: "Peer-to-peer voice calls. TURN server fallback for restrictive networks.", icon: "🎙️", col: 4, row: 2 },
      { id: "confess", label: "Confessions Feed", detail: "Anonymous encrypted posts. College-scoped. No usernames ever.", icon: "🔒", col: 2, row: 2 },
    ],
    edges: [
      { from: "user", to: "pool", label: "join", delay: 0 },
      { from: "user", to: "confess", label: "post", delay: 200 },
      { from: "pool", to: "match", label: "pair", delay: 600 },
      { from: "match", to: "chat", label: "connect", delay: 1000 },
      { from: "chat", to: "voice", label: "upgrade", delay: 1400 },
    ],
  },

  avana: {
    slug: "avana",
    title: "How Avana's agents work",
    subtitle: "User Query → Orchestrator → Specialist Agents → Response",
    loopInterval: 4500,
    nodes: [
      { id: "query", label: "User asks a question", detail: "Natural language query about Bali land investment.", icon: "💭", col: 1, row: 2 },
      { id: "orchestrator", label: "Orchestrator Agent", detail: "Routes queries to specialist agents based on intent classification.", icon: "🧠", col: 2, row: 2 },
      { id: "market", label: "Market Agent", detail: "Analyzes pricing trends, comparable sales, and ROI projections.", icon: "📊", col: 3, row: 1 },
      { id: "legal", label: "Legal Agent", detail: "Indonesian land law, foreign ownership rules, PT PMA structures.", icon: "⚖️", col: 3, row: 2 },
      { id: "news", label: "News Agent", detail: "Scrapes and summarizes Bali real estate news. Updated daily.", icon: "📰", col: 3, row: 3 },
      { id: "voice", label: "WebRTC Voice", detail: "Real-time voice conversation with any agent. Sub-200ms latency.", icon: "🎙️", col: 4, row: 1 },
      { id: "response", label: "Unified Response", detail: "Agents synthesize findings into a single coherent answer.", icon: "✨", col: 4, row: 2 },
    ],
    edges: [
      { from: "query", to: "orchestrator", label: "classify", delay: 0 },
      { from: "orchestrator", to: "market", label: "handoff", delay: 400 },
      { from: "orchestrator", to: "legal", label: "handoff", delay: 600 },
      { from: "orchestrator", to: "news", label: "handoff", delay: 800 },
      { from: "market", to: "response", label: "findings", delay: 1200 },
      { from: "legal", to: "response", label: "findings", delay: 1400 },
      { from: "news", to: "response", label: "findings", delay: 1600 },
      { from: "response", to: "voice", label: "speak", delay: 2000 },
    ],
  },

  maddycustom: {
    slug: "maddycustom",
    title: "How MaddyCustom handles payments",
    subtitle: "Cart → Gateway Orchestration → Shipping → Analytics",
    loopInterval: 4000,
    nodes: [
      { id: "cart", label: "Customer checkout", detail: "Cart with custom vehicle wraps + stickers. COD + prepaid options.", icon: "🛒", col: 1, row: 1 },
      { id: "razorpay", label: "Razorpay", detail: "Primary payment gateway. Handles UPI, cards, netbanking.", icon: "💳", col: 2, row: 1 },
      { id: "payu", label: "PayU Fallback", detail: "Auto-switches if Razorpay fails. Zero dropped payments.", icon: "🔄", col: 2, row: 2 },
      { id: "order", label: "Order Created", detail: "Webhook confirms payment. Order enters fulfillment pipeline.", icon: "✅", col: 3, row: 1 },
      { id: "ship", label: "Shiprocket", detail: "Auto-generates shipping label. Tracks delivery status.", icon: "🚚", col: 4, row: 1 },
      { id: "meta", label: "Meta Pixel", detail: "Server-side tracking. Purchase, AddToCart, ViewContent events.", icon: "📡", col: 3, row: 2 },
      { id: "funnel", label: "Funnel Analytics", detail: "Sankey diagrams + customer journey analysis in admin panel.", icon: "📈", col: 4, row: 2 },
    ],
    edges: [
      { from: "cart", to: "razorpay", label: "pay", delay: 0 },
      { from: "cart", to: "payu", label: "fallback", delay: 200 },
      { from: "razorpay", to: "order", label: "webhook", delay: 600 },
      { from: "payu", to: "order", label: "webhook", delay: 800 },
      { from: "order", to: "ship", label: "fulfill", delay: 1200 },
      { from: "order", to: "meta", label: "track", delay: 1000 },
      { from: "meta", to: "funnel", label: "aggregate", delay: 1600 },
    ],
  },

  dailicle: {
    slug: "dailicle",
    title: "How Dailicle generates essays",
    subtitle: "Cron → Research → Write → TTS → Publish → Email",
    loopInterval: 4500,
    nodes: [
      { id: "cron", label: "9:00 AM IST", detail: "Python cron job fires. Decides today's topic from a curated queue.", icon: "⏰", col: 1, row: 1 },
      { id: "research", label: "Web Research", detail: "Scrapes and summarizes 5-10 sources for context and facts.", icon: "🔍", col: 2, row: 1 },
      { id: "write", label: "Essay Generation", detail: "GPT-4 with custom system prompt. ~1,500 words. Fact-checked against sources.", icon: "✍️", col: 3, row: 1 },
      { id: "tts", label: "TTS → S3", detail: "Text-to-speech narration. Audio uploaded to S3 + CloudFront CDN.", icon: "🔊", col: 3, row: 2 },
      { id: "mongo", label: "MongoDB + Notion", detail: "Essay saved to DB. Notion page auto-created for editorial review.", icon: "💾", col: 4, row: 1 },
      { id: "email", label: "Email Subscribers", detail: "Automated email with essay preview + audio link.", icon: "📧", col: 4, row: 2 },
    ],
    edges: [
      { from: "cron", to: "research", label: "trigger", delay: 0 },
      { from: "research", to: "write", label: "context", delay: 600 },
      { from: "write", to: "tts", label: "audio", delay: 1200 },
      { from: "write", to: "mongo", label: "save", delay: 1400 },
      { from: "mongo", to: "email", label: "notify", delay: 1800 },
    ],
  },
};

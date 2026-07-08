/* ============================================================
   DATA LAYER — All portfolio content lives here.
   Single source of truth. No hardcoded strings in components.
   ============================================================ */

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  category: "founder" | "freelance" | "fulltime";
  url?: string;
  github?: string;
  playStore?: string;
  image?: string;
  stack: string[];
  details?: string[];
  metrics?: string;
  year: string;
  status: "active" | "shipped" | "archived";
  location?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  current: boolean;
}

export const siteConfig = {
  name: "Lucky Solanki",
  title: "Lucky Solanki — Full-Stack Product Engineer",
  description:
    "Full-stack product engineer building frontend, backend, deployment, AI integrations, automations, MCP systems, payments, realtime features, admin tooling, and product infrastructure.",
  url: "https://luckysolanki.com",
} as const;

export const socials = {
  github: "https://github.com/luckysolanki902",
  linkedin: "https://linkedin.com/in/luckysolanki902",
  x: "https://x.com/luckysolanki902",
  email: "luckysolanki902@gmail.com",
} as const;

export const experience: Experience[] = [
  {
    company: "Blitzit",
    role: "Lead Backend Engineer",
    period: "Nov 2025 — Now",
    current: true,
  },
  {
    company: "Spyll",
    role: "Founder & Lead Engineer",
    period: "2023 — Now",
    current: true,
  },
  {
    company: "MaddyCustom",
    role: "Co-Founder & CTO",
    period: "Dec 2022 — Feb 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "blitzit",
    name: "Blitzit",
    url: "https://www.blitzit.app",
    tagline: "Backend platform for an AI-native task app",
    role: "Lead Backend Engineer",
    category: "fulltime",
    location: "United Kingdom",
    description:
      "I led the backend rewrite that made Blitzit 3.0 much more reliable and easy to scale: Fastify services, MongoDB models, Redis/BullMQ workers, MCP tools, integration plugins, realtime sync, webhook ingestion, and a Git-style undo/redo journal for task history.",
    image: "/images/projects/blitzit.jpeg",
    stack: ["Fastify", "MongoDB", "Redis", "BullMQ", "MCP", "OAuth 2.1", "Zod"],
    details: [
      "Owned the 3.0 backend shape after the older 2.0 API had grown around integrations and OAuth redirects. The rewrite gave normal app traffic, AI tool calls, MCP clients, provider webhooks, queues, schedulers, and sync workers the same auth, validation, ownership, and domain-event rules.",
      "Built the integration plugin architecture so new providers could plug into a shared contract instead of spreading provider-specific code across routes, workers, OAuth handlers, and sync logic.",
      "Designed the undo/redo system as a per-user change journal. Mutations from humans, Blitzy, MCP tools, and API clients become reversible commits with content hashes, so a user can trust direct AI writes without losing newer manual changes.",
    ],
    metrics: "Backend platform · MCP tools · Undo/redo history · Integration runtime",
    year: "2024",
    status: "active",
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "Custom vehicle commerce and operations",
    role: "Co-founder & CTO",
    category: "founder",
    description:
      "I co-founded MaddyCustom and ran the technical side: storefront, admin, order operations, production downloads, analytics, payments, shipping, inventory, and the small internal tools that kept a custom-commerce team moving every day.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js 15", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    details: [
      "The product sold custom vehicle stickers and wraps, which meant every order carried design choices, production requirements, shipping constraints, support context, and buyer history. The admin side became the operating system for that work.",
      "Built payment fallback with Razorpay and PayU, Shiprocket shipping, server-side Meta tracking, funnel analytics, customer journey views, review moderation, product controls, role-based access, and downloads that gave the production team the right files for each custom order.",
      "The business reached 100K+ monthly users and around ₹60L annual revenue while the platform kept changing around real customer behavior.",
    ],
    metrics: "100K+ monthly users · ₹60L annual revenue",
    year: "2023",
    status: "shipped",
  },
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Verified anonymous college network",
    role: "Co-founder & Lead Engineer",
    category: "founder",
    description:
      "I co-founded Spyll as a campus social product where verified students could post anonymously, chat, vote, react, join random connects, and use the app without turning it into a mess for everyone else.",
    url: "https://spyll.in",
    playStore: "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll2.png",
    stack: ["Fastify", "MongoDB", "Socket.IO", "BullMQ", "Firebase", "Flutter"],
    details: [
      "Built the backend around verified access, anonymous posting, confession feeds, polls, comments, reactions, realtime chat, random connect, blocking, reporting, and moderation queues.",
      "The interesting work sat in the trust layer: keeping the product anonymous to other students while still giving the system enough structure to rate-limit abuse, moderate posts, send useful notifications, and keep rooms safe.",
      "Shipped the first Android version to 1,700+ downloads in the first month without paid acquisition, then started rebuilding the mobile client in Flutter for smoother native behavior.",
    ],
    metrics: "1,700+ downloads in the first month",
    year: "2023",
    status: "active",
  },
  {
    slug: "avana",
    name: "Avana",
    tagline: "Investment research assistant for Bali real estate",
    role: "Freelance · Sole Developer",
    category: "freelance",
    location: "Bali, Indonesia",
    description:
      "Built Avana as a research product for Bali real estate investors: an assistant surface, subscription billing, admin knowledge controls, news operations, onboarding, and document-backed answers tied to local investment context.",
    url: "https://avanaapp.ai/",
    image: "/images/projects/avana.png",
    stack: ["Next.js 16", "OpenAI", "Vector Search", "WebRTC", "Xendit", "MongoDB"],
    details: [
      "Built the chat and voice surface with an orchestrator-style assistant, realtime voice, onboarding questions, saved context, and a knowledge base around Bali property terms, land categories, locations, and investor concerns.",
      "Built the admin side for documents, vector-store operations, news scraping and approval, users, subscriptions, pricing plans, and the controls needed to keep the research material clean.",
      "Integrated Xendit subscriptions and guarded the product around access, plan state, usage, and admin workflows so the assistant could be sold as a product instead of staying a demo.",
    ],
    metrics: "Research assistant · Realtime voice · Xendit subscriptions",
    year: "2025",
    status: "active",
  },
  {
    slug: "autoremov",
    name: "AutoRemov",
    tagline: "Backend for image background removal",
    image: "/images/projects/autoremov.png",
    role: "Freelance · Backend Engineer",
    category: "freelance",
    description:
      "Built the backend for a background-removal product: uploads, durable image jobs, account and credit logic, Razorpay payments, storage integration, migration work, and test coverage around the parts that would hurt in production.",
    stack: ["Fastify", "TypeScript", "Prisma", "Postgres", "pg-boss", "Razorpay", "S3"],
    details: [
      "Designed the API around presigned uploads, image records, job state, worker handoff, result delivery, and failure recovery. The expensive image work runs outside the request path, while the API keeps users updated with clear status.",
      "Built auth, sessions, OAuth pieces, credit accounting, Razorpay order/payment flows, and backend guards so image jobs could be connected to real accounts and billing state.",
      "Handled migration work from MySQL-era assumptions toward a Postgres/Prisma backend, with integration tests around image processing, payments, and the workflows most likely to break under real users.",
    ],
    metrics: "Uploads · Durable jobs · Credits · Payments · Postgres migration",
    year: "2026",
    status: "shipped",
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "Weekly deeply researched reading ritual",
    role: "Founder",
    category: "founder",
    location: "India",
    description:
      "I founded Dailicle as a weekly publication for people who want one deeply researched article they can sit with. The product is built around a calmer reading habit: one subject, proper context, an archive worth returning to, and no feed to chase.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle2.png",
    stack: ["Next.js 16", "MongoDB", "Notion", "AWS S3", "CloudFront", "Email"],
    details: [
      "The product direction is simple: publish one serious article every week, make the archive easy to browse, and let each issue feel like it was worth the reader's time.",
      "Built the reading surface, issue pages, archive structure, sharing metadata, subscriber emails, audio support, caching, and the small publishing workflow around preparing each essay.",
      "The editorial bar matters here. Dailicle is framed around researched weekly writing, with topics chosen because they leave the reader understanding something better than before.",
    ],
    metrics: "Weekly essays · Research-led writing · Archive-first reading",
    year: "2025",
    status: "active",
  },
];

export const tools = {
  frontend: [
    "TypeScript, JavaScript, Dart",
    "React, Next.js, Vue",
    "Flutter, React Native, Electron",
    "Tailwind, Framer Motion, shadcn/ui",
    "Redux, MUI, responsive product UI",
    "Server components, dynamic OG images",
  ],
  backend: [
    "Node.js, Fastify, Express",
    "Python, FastAPI",
    "MongoDB, MySQL, Redis",
    "BullMQ, Firebase",
    "Postgres, Prisma, pg-boss",
    "Zod validation, REST APIs, webhooks",
    "AsyncLocalStorage, jsondiffpatch",
    "SSE sync, content hashes, soft deletes",
  ],
  ai: [
    "OpenAI Agents SDK, MCP Protocol",
    "LLM orchestration, multi-agent handoffs",
    "Pinecone vector memory, RAG",
    "Prompt-level model routing",
    "AI tool surfaces, MCP servers",
    "AI integrations, workflow automation",
    "Vector search, document-backed answers",
  ],
  infrastructure: [
    "AWS S3, CloudFront",
    "Vercel, Docker, Cloudflare",
    "WebRTC, Socket.IO",
    "OAuth 2.1/PKCE, Clerk",
    "Redis queues, workers, schedulers",
    "S3-compatible storage, presigned uploads",
    "Razorpay, Xendit, Shiprocket",
    "Playwright, integration testing",
  ],
  also: "A/B testing, funnel analytics, Notion APIs, Firebase Cloud Messaging, CloudFront caching, server-side Meta tracking, web push, OAuth provider flows",
} as const;

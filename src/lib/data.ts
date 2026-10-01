/* ============================================================
   DATA LAYER, All portfolio content lives here.
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
  story?: { problem: string; system: string; outcome: string; flow: string[] };
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
  title:
    "Lucky Solanki | Backend & AI Engineer",
  description:
    "Backend and AI engineer building voice assistants, agent tools, integrations, and realtime products. Building software since December 2022.",
  url: "https://www.luckysolanki.com",
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
    role: "Core Backend Developer & AI Engineer",
    period: "Nov 2025, Now",
    current: true,
  },
  {
    company: "MaddyCustom",
    role: "Co-founder & Lead Full-Stack Developer & AI Engineer",
    period: "Dec 2022, Feb 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "blitzit",
    story: {
      problem: "Let people and AI work on the same tasks, with consistent permissions, realtime updates, and a way to undo changes.",
      system: "Shared agent tools, provider integrations, realtime collaboration, and a reversible change journal.",
      outcome: "12 provider integrations and 70+ MCP tools, with bidirectional sync and reversible AI writes.",
      flow: ["AI client", "OAuth + scopes", "Shared tools", "Change journal"],
    },
    name: "Blitzit",
    url: "https://www.blitzit.app",
    tagline: "The systems behind an AI-native productivity app",
    role: "Core Backend Developer & AI Engineer",
    category: "fulltime",
    location: "United Kingdom",
    description:
      "I build the backend and AI systems behind Blitzit: shared agent tools, integrations, realtime collaboration, and reversible actions. My latest work brings that foundation into Blitzy’s voice experience.",
    image: "/images/projects/blitzit.webp",
    stack: ["TypeScript", "Fastify", "MongoDB", "Redis", "MCP", "WebRTC", "ONNX"],
    details: [
      "Built Blitzy’s realtime voice architecture so spoken requests use the same reasoning agent, conversation context, and scoped executor as typed chat. The realtime model handles speech with no business tools, while the shared agent owns actions and their outcomes. Backend work is merged; the complete frontend voice experience is currently in review.",
      "Trained a custom ‘Hey Blitzy’ wake-word classifier in Colab and integrated local ONNX inference into the desktop app, with a short transcription check after candidate detections. Built the state-driven orb, microphone handoff, interruption handling, and session lifecycle around it.",
      "Built shared-list collaboration and realtime delivery, per-user migration from Blitzit 2.0 to 3.0, managed-team billing, and observability. Later work included multiplexed database change streams, agent memory and personalization, and in-app notifications.",
      "Built the integration plugin architecture behind 12 providers, Asana, ClickUp, Notion, Trello, Todoist, TickTick, Linear, GitHub, Google Calendar, Google Tasks, Microsoft Calendar and Microsoft To Do. Each one declares its API shape, auth and field mapping against a shared contract instead of spreading provider-specific code across routes, workers, OAuth handlers and sync logic.",
      "Built the MCP server that exposes the product to external AI clients: 70+ tools over JSON-RPC 2.0 and Streamable HTTP, with OAuth 2.1/PKCE, per-tool scopes, and read-only/destructive annotations so a client knows what a call will do before it makes it. The in-app agent runs on the same 70+ tool definitions plus 3 of its own, through one shared executor, one schema, one implementation, one permission model across both surfaces.",
      "Built the failure handling that keeps integrations honest under partial failure: upstream errors are classified into a bounded outcome set rather than collapsing into one generic 502, so a revoked grant, a deleted calendar, a throttle and a provider outage each produce the right status, the right retry decision, and the right fix for the user.",
      "Designed the undo/redo system as a per-user change journal. Mutations from humans, the in-app agent, MCP clients and API callers become reversible commits with content hashes, so a user can trust direct AI writes without losing newer manual changes.",
    ],
    metrics: "12 integrations · 70+ MCP tools · Bidirectional sync · Reversible AI writes",
    year: "2025",
    status: "active",
  },
  {
    slug: "maddycustom",
    story: {
      problem: "Custom orders need more than checkout: designs, production files, payments, and shipping must stay connected.",
      system: "A storefront and operations platform spanning the complete order journey.",
      outcome: "The business reached 100K+ monthly users and approximately $62.4K USD in annual revenue.",
      flow: ["Custom order", "Payment", "Production files", "Shipping"],
    },
    name: "MaddyCustom",
    tagline: "Custom vehicle commerce and operations",
    role: "Co-founder & Lead Full-Stack Developer & AI Engineer",
    category: "founder",
    description:
      "I co-founded the business and built its commerce platform, connecting custom orders, payments, production files, and shipping in one workflow.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.webp",
    stack: ["Next.js 15", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    details: [
      "The product sold custom vehicle stickers and wraps, which meant every order carried design choices, production requirements, shipping constraints, support context, and buyer history. The admin side became the operating system for that work.",
      "Built payment fallback with Razorpay and PayU, Shiprocket shipping, server-side Meta tracking, funnel analytics, customer journey views, review moderation, product controls, role-based access, and downloads that gave the production team the right files for each custom order.",
      "The business reached 100K+ monthly users and approximately $62.4K USD annual revenue while the platform kept changing around real customer behavior.",
    ],
    metrics: "100K+ monthly users · ~$62.4K USD annual revenue",
    year: "2023",
    status: "shipped",
  },
  {
    slug: "spyll",
    story: {
      problem: "Make campus conversations anonymous while keeping access verified and abuse manageable.",
      system: "Verified access, realtime conversations, and reporting and moderation workflows.",
      outcome: "Shipped the Android app to 1,700+ downloads in its first month.",
      flow: ["Verified access", "Anonymous post", "Realtime feed", "Moderation"],
    },
    name: "Spyll",
    tagline: "Verified anonymous college network",
    role: "Personal project · Full-Stack Developer",
    category: "founder",
    description:
      "I built Spyll, a college social project, with a backend for verified campus access, anonymous posts, realtime chat, and moderation.",
    url: "https://spyll.in",
    playStore: "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll2.webp",
    stack: ["Fastify", "MongoDB", "Socket.IO", "BullMQ", "Firebase", "Flutter"],
    details: [
      "Built the backend around verified access, anonymous posting, confession feeds, polls, comments, reactions, realtime chat, random connect, blocking, reporting, and moderation queues.",
      "The interesting work sat in the trust layer: keeping the product anonymous to other students while still giving the system enough structure to rate-limit abuse, moderate posts, send useful notifications, and keep rooms safe.",
      "Shipped the first Android version to 1,700+ downloads in the first month, then started rebuilding the mobile client in Flutter for smoother native behavior.",
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
      "I built the product end to end: document-backed answers, realtime voice, subscriptions, and the admin tools that keep the knowledge base useful.",
    url: "https://avanaapp.ai/",
    image: "/images/projects/avana.webp",
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
    image: "/images/projects/autoremov.webp",
    role: "Freelance · Backend Engineer",
    category: "freelance",
    description:
      "I built the API and job pipeline for image processing, with durable workers, credit accounting, payments, and failure recovery.",
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
      "I founded a weekly publication and built its reading experience, publishing workflow, archive, and subscriber delivery.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle-essay.webp",
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
    "React, Next.js, Vue, Flutter",
    "Flutter, React Native, Electron",
    "Tailwind, Framer Motion, shadcn/ui",
    "Redux, MUI, responsive product UI",
    "Server components, dynamic OG images",
  ],
  backend: [
    "TypeScript, Node.js, Fastify",
    "MongoDB, PostgreSQL, Redis",
    "BullMQ, pg-boss, Prisma",
    "Python, FastAPI",
    "REST, JSON-RPC 2.0, Zod schemas",
  ],
  ai: [
    "MCP servers, tool schemas, scopes and annotations",
    "Shared text and voice agents, multi-step tool loops",
    "Realtime voice, WebRTC, interruption and speech coordination",
    "Custom wake-word training, ONNX Runtime, on-device inference",
    "Typed agent memory: extraction, dedup, decay, budgets",
    "Model routing across fast/capable tiers, provider fallback",
    "Prompt caching, token and output budgeting",
    "Golden-dataset evals, LLM-as-judge, tool-selection conformance",
    "RAG, vector search, document-backed answers",
  ],
  infrastructure: [
    "OAuth 2.1/PKCE, token refresh under concurrency",
    "Inbound and outbound webhooks, signature rotation",
    "Bidirectional sync, conflict resolution, loop prevention",
    "Idempotency, retries, backoff, dead-letter handling",
    "Upstream failure taxonomies, rate-limit handling",
    "Queues, workers, schedulers, polling",
    "SSE, Socket.IO, WebRTC",
    "Docker, Vercel, Cloudflare, AWS",
    "Vitest, Playwright, integration and mutation testing",
  ],
  also: "Express, React Native, Electron, Firebase, MySQL, Razorpay, Xendit, Shiprocket, Notion APIs, funnel analytics, CloudFront caching, and web push",
} as const;

/* ============================================================
   DATA LAYER — All portfolio content lives here.
   Single source of truth. No hardcoded strings in components.
   ============================================================ */

import type { Lens } from "@/store/useLensStore";

/** How a project is re-narrated for one kind of reader (ribbon). */
export interface LensFrame {
  /** A short hook — often the stat that matters most to this reader. */
  headline: string;
  /** One or two sentences framing the work for this reader. */
  frame: string;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  url?: string;
  github?: string;
  playStore?: string;
  image: string;
  stack: string[];
  metrics?: string;
  year: string;
  status: "active" | "shipped" | "archived";
  location?: string;
  /** Pastel accent for this project's pop-up spread. */
  accent: string;
  /** Paper-diorama motif id (defaults to slug). */
  scene: string;
  /** Higher = the spread sits earlier under a given ribbon. */
  weight: Record<Lens, number>;
  /** Per-ribbon retelling. Falls back to `description` if absent. */
  lenses: Partial<Record<Lens, LensFrame>>;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  current: boolean;
}

export const siteConfig = {
  name: "Lucky Solanki",
  title: "Lucky Solanki — Product Engineer for AI, Integrations, and Realtime Systems",
  description:
    "Product engineer for AI workflows, integrations, payments, realtime systems, and internal tooling. Built across products used by 100K+ monthly users and founder-led businesses.",
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
    role: "Full-Stack Software Engineer",
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
    role: "Co-Founder & Lead Developer",
    period: "Dec 2022 — Feb 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "blitzit",
    name: "Blitzit",
    url: "https://www.blitzit.app",
    tagline: "Task management platform with deep integrations",
    role: "Full-Stack Software Engineer",
    location: "United Kingdom",
    description:
      "Built a plugin-based integration SDK that reduced new integrations from 10+ files to a single 300–500 line plugin. Built an MCP server with 13 AI-callable tools using OAuth 2.1 (PKCE) and JSON-RPC 2.0 over Streamable HTTP. Also worked on bidirectional sync with Asana, ClickUp, Notion, and Google Calendar across 21 timezones.",
    image: "/images/projects/blitzit.jpeg",
    stack: ["Fastify", "BullMQ", "MCP SDK", "Firebase", "OAuth 2.1", "Electron"],
    metrics: "13 AI-callable tools · 21-timezone scheduling",
    year: "2024",
    status: "active",
    accent: "var(--periwinkle)",
    scene: "lighthouse",
    weight: { hire: 10, commission: 6, back: 5 },
    lenses: {
      hire: {
        headline: "I lead the backend.",
        frame:
          "I rebuilt Blitzit's backend into a plugin architecture and an MCP server with 13 AI-callable tools — the hard, reliable systems work that has to hold up in production every day.",
      },
      commission: {
        headline: "Integrations that just sync.",
        frame:
          "Bidirectional sync with Asana, ClickUp, Notion and Google Calendar across 21 timezones, plus a full AI tool layer — shipped as production features, not demos.",
      },
      back: {
        headline: "An engine built to scale.",
        frame:
          "The backend behind a growing productivity product: reliable sync, an AI tool layer, and an architecture that adds a new integration in hours instead of weeks.",
      },
    },
  },
  {
    slug: "avana",
    name: "Avana",
    tagline: "Multi-agent research platform for Bali real estate",
    role: "Freelance · Sole Developer",
    location: "Bali, Indonesia",
    description:
      "Built solo for a Bali real estate product. The platform combines multi-agent chat with orchestrator and specialist handoffs, realtime voice via WebRTC, Xendit payment integration, and an admin panel with automated news scraping across two codebases.",
    url: "https://avanaapp.ai/",
    image: "/images/projects/avana.png",
    stack: ["Next.js 16", "OpenAI Agents", "WebRTC", "Xendit", "MongoDB"],
    metrics: "Multi-agent AI · Realtime voice · Xendit payments",
    year: "2025",
    status: "active",
    accent: "var(--mint)",
    scene: "villa",
    weight: { hire: 6, commission: 10, back: 6 },
    lenses: {
      hire: {
        headline: "Agents, voice, payments — solo.",
        frame:
          "A multi-agent system with orchestrator/specialist handoffs, realtime WebRTC voice, and Xendit payments — designed and shipped end to end across two codebases.",
      },
      commission: {
        headline: "Built solo, end to end.",
        frame:
          "A Bali real-estate research product delivered alone: multi-agent chat, realtime voice, payments, and an admin panel with automated news scraping. One developer, whole product.",
      },
      back: {
        headline: "AI product, fully realized.",
        frame:
          "Proof I can take an ambitious AI product from empty repo to live — agents, voice, payments, and ops — without a team behind me.",
      },
    },
  },
  {
    slug: "autoremov",
    name: "AutoRemov",
    tagline: "Automated background-removal pipeline & API",
    role: "Freelance · Backend Engineer",
    description:
      "Backend for an automated image background-removal product: a queue-driven processing pipeline, a clean REST API, batch jobs, and storage/CDN delivery — built to chew through large volumes of images without breaking a sweat.",
    url: "https://autoremov.com",
    image: "/images/projects/avana.png",
    stack: ["Node.js", "FastAPI", "Queues", "AWS S3", "CloudFront", "Docker"],
    metrics: "Queue-driven batch pipeline · REST API",
    year: "2025",
    status: "active",
    accent: "var(--sky)",
    scene: "eraser",
    weight: { hire: 5, commission: 9, back: 4 },
    lenses: {
      hire: {
        headline: "Throughput-first backend.",
        frame:
          "A queue-driven background-removal pipeline with a clean API and batch processing — designed around throughput, retries, and predictable cost.",
      },
      commission: {
        headline: "A product's whole backend.",
        frame:
          "I built the engine behind AutoRemov: processing pipeline, REST API, batch jobs, and CDN delivery — the invisible half that makes the product actually work.",
      },
      back: {
        headline: "Infra that earns its keep.",
        frame:
          "The kind of unglamorous, high-volume backend that quietly powers a real business.",
      },
    },
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "Revenue-bearing ecommerce platform",
    role: "Co-Founder & CTO",
    description:
      "E-commerce platform for custom vehicle wraps and stickers. Multi-gateway payment orchestration (Razorpay + PayU fallback), Shiprocket shipping, server-side Meta tracking, and an admin panel with Sankey funnel analytics and customer journey analysis. Grew to 100K+ monthly users and ₹60L annual revenue.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js 15", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    metrics: "100K+ monthly users · ₹60L annual revenue",
    year: "2023",
    status: "shipped",
    accent: "var(--blush)",
    scene: "garage",
    weight: { hire: 6, commission: 7, back: 10 },
    lenses: {
      hire: {
        headline: "I owned the whole platform.",
        frame:
          "As CTO I built payment orchestration with fallback, shipping, server-side tracking, and an analytics admin panel — a real product under real load.",
      },
      commission: {
        headline: "Payments, shipping, analytics.",
        frame:
          "Multi-gateway payments with automatic fallback, Shiprocket shipping, Meta server-side tracking, and funnel analytics — the commerce plumbing that has to never drop an order.",
      },
      back: {
        headline: "₹60L/yr. 100K users/mo.",
        frame:
          "Co-founded and led engineering for a business that grew to 100K+ monthly users and ₹60L annual revenue before moving to Shopify. I've built the thing that makes money.",
      },
    },
  },
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Consumer social app for college students",
    role: "Founder",
    description:
      "Anonymous social platform for college students in India. 1,200+ Android downloads in the first month with zero paid marketing. Real-time 1:1 chat pair matching, voice calls, and encrypted confessions. Redis pub/sub matching engine with WebRTC voice and Socket.IO chat. Rebuilding mobile client in Flutter for native-grade smoothness.",
    url: "https://spyll.in",
    playStore:
      "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll.png",
    stack: ["Next.js", "Flutter", "Socket.IO", "WebRTC", "Redis", "MongoDB"],
    metrics: "1,200+ downloads in the first month",
    year: "2023",
    status: "active",
    accent: "var(--lilac)",
    scene: "rooftop",
    weight: { hire: 5, commission: 5, back: 9 },
    lenses: {
      hire: {
        headline: "Realtime, from scratch.",
        frame:
          "A Redis pub/sub matching engine, WebRTC voice, and Socket.IO chat — the hard realtime primitives, built and shipped to real users.",
      },
      commission: {
        headline: "Realtime matching & voice.",
        frame:
          "1:1 pair matching, voice calls, and encrypted confessions on a realtime stack — the sort of live, stateful features most builds shy away from.",
      },
      back: {
        headline: "1,200 downloads, ₹0 spend.",
        frame:
          "Founded a consumer app that hit 1,200+ Android installs in month one with zero paid marketing. I can find product-market pull, not just write code.",
      },
    },
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "Daily essay product with automated publishing pipeline",
    role: "Founder · Solo",
    location: "India",
    description:
      "A daily essay platform. Every morning at 9:00 AM IST, a Python pipeline generates a long-form essay with web research, saves it to MongoDB, creates a Notion page, produces TTS audio via S3 and CloudFront, and emails subscribers. Next.js frontend with timezone-aware caching and dynamic OG images.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle.png",
    stack: ["Next.js 16", "Python", "FastAPI", "OpenAI", "AWS S3", "MongoDB"],
    metrics: "Automated daily pipeline · TTS narration",
    year: "2025",
    status: "active",
    accent: "var(--butter)",
    scene: "press",
    weight: { hire: 4, commission: 6, back: 7 },
    lenses: {
      hire: {
        headline: "A pipeline that runs itself.",
        frame:
          "Every morning a Python pipeline researches, writes, narrates (TTS), publishes, and emails — an automated content system with zero human in the loop.",
      },
      commission: {
        headline: "AI content, automated.",
        frame:
          "Research → long-form essay → Notion → TTS audio → subscriber email, every day at 9AM, untouched. The whole automated-publishing playbook in one product.",
      },
      back: {
        headline: "A product that wakes up alone.",
        frame:
          "A daily-essay business that publishes itself every morning — built solo to test how far one person plus automation can go.",
      },
    },
  },
];

export const tools = {
  frontend: [
    "TypeScript, JavaScript, Dart",
    "React, Next.js, Vue",
    "Flutter, React Native, Electron",
    "Tailwind, Framer Motion, shadcn/ui",
  ],
  backend: [
    "Node.js, Fastify, Express",
    "Python, FastAPI",
    "MongoDB, MySQL, Redis",
    "BullMQ, Firebase",
  ],
  ai: [
    "OpenAI Agents SDK, MCP Protocol",
    "LLM orchestration, multi-agent handoffs",
    "Pinecone vector memory, RAG",
    "Prompt-level model routing",
  ],
  infrastructure: [
    "AWS S3, CloudFront",
    "Vercel, Docker, Cloudflare",
    "WebRTC, Socket.IO",
    "OAuth 2.1/PKCE, Clerk",
  ],
  also: "A/B testing, funnel analytics, Razorpay, Xendit, Shiprocket, Playwright, Redux, MUI",
} as const;

/* ------------------------------------------------------------------
   BIO — the "Hello" spread, re-narrated per ribbon.
   ------------------------------------------------------------------ */
export const bio: Record<Lens, { headline: string; body: string[] }> = {
  hire: {
    headline: "Hello — I build the hard parts.",
    body: [
      "I'm Lucky. I work on the parts of a product that are expensive to get wrong: integrations, AI tooling, realtime systems, payments, and backend architecture.",
      "Right now I lead backend at Blitzit. Before that I co-founded and was CTO of a business that grew to 100K+ monthly users. I've shipped as a founder, an in-house engineer, and a solo builder — so I own both the product call and the code.",
    ],
  },
  commission: {
    headline: "Hello — need something built well?",
    body: [
      "I'm Lucky. I take ambitious products from empty repo to live — solo. AI features, integrations, payments, realtime, automation: the tricky stuff, delivered as production software.",
      "I've built Avana (multi-agent + voice + payments), AutoRemov's backend, and a fully automated daily-essay pipeline. If it's hard to fake, it's the kind of work I like.",
    ],
  },
  back: {
    headline: "Hello — I like starting things.",
    body: [
      "I'm Lucky. I started building at 2021 and haven't stopped. I founded Spyll, co-founded and led engineering at MaddyCustom (₹60L/yr, 100K users/mo), and run a few products of my own.",
      "I can find product pull and build the whole thing myself — which is exactly what the early days need.",
    ],
  },
};

/* ------------------------------------------------------------------
   CLOSING — the final spread, per ribbon.
   ------------------------------------------------------------------ */
export const closing: Record<Lens, { headline: string; body: string }> = {
  hire: {
    headline: "Let's build something that lasts.",
    body: "If you want someone to own a hard product surface end to end, I'd love to talk.",
  },
  commission: {
    headline: "Have a project in mind?",
    body: "Tell me the problem, the stack, and where it's stuck. I'll tell you honestly if I'm the right person.",
  },
  back: {
    headline: "Building something early?",
    body: "I like the empty-repo, no-map part the most. If that's where you are, let's talk.",
  },
};

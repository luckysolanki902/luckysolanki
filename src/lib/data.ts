/* ============================================================
   DATA LAYER, All portfolio content lives here.
   Single source of truth. No hardcoded strings in components.
   ============================================================ */

export type Audience = "founder" | "freelance" | "employed";

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
  /** Which hats this belongs to, powers the Work filter. */
  audience: Audience[];
  /** Pastel accent for the card. */
  accent: string;
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
    "Lucky Solanki, Lead Backend Engineer, ex-CTO & Founder",
  description:
    "Lead Backend Engineer at Blitzit, ex-CTO & co-founder of MaddyCustom (100K+ users, ₹60L/yr), and founder of Spyll & Dailicle. I build the hard parts of software, backends, integrations, AI, realtime, payments.",
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
    period: "Since Nov 2025",
    current: true,
  },
  {
    company: "Spyll",
    role: "Founder & Lead Engineer",
    period: "Since 2023",
    current: true,
  },
  {
    company: "MaddyCustom",
    role: "Co-Founder & Lead Developer",
    period: "Dec 2022 to Feb 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "blitzit",
    name: "Blitzit",
    url: "https://www.blitzit.app",
    tagline: "Task-management platform with deep integrations",
    role: "Lead Backend Engineer",
    location: "United Kingdom",
    description:
      "I lead the backend. I rebuilt it into a plugin architecture that turns a new integration from 10+ files into a single ~300-line plugin, and shipped an MCP server with 13 AI-callable tools (OAuth 2.1 PKCE, JSON-RPC over streamable HTTP), plus bidirectional sync with Asana, ClickUp, Notion and Google Calendar across 21 timezones.",
    image: "/images/projects/blitzit.jpeg",
    stack: ["Fastify", "BullMQ", "MCP SDK", "Firebase", "OAuth 2.1", "Electron"],
    metrics: "13 AI-callable tools · 21-timezone sync",
    year: "2025",
    status: "active",
    audience: ["employed"],
    accent: "var(--c-peri)",
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "Revenue-bearing ecommerce platform",
    role: "Co-Founder & CTO",
    description:
      "As CTO I built and owned the platform for custom vehicle wraps and stickers: multi-gateway payments with automatic fallback (Razorpay + PayU), Shiprocket shipping, server-side Meta tracking, and an admin panel with Sankey funnel analytics. It grew to 100K+ monthly users and ₹60L annual revenue.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    metrics: "100K+ monthly users · ₹60L annual revenue",
    year: "2023",
    status: "shipped",
    audience: ["founder"],
    accent: "var(--c-blush)",
  },
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Consumer social app for college students",
    role: "Founder",
    description:
      "An anonymous social platform for Indian college students, 1,200+ Android installs in month one with zero paid marketing. Real-time 1:1 pair matching, voice calls, and encrypted confessions, built on a Redis pub/sub matching engine with WebRTC voice and Socket.IO chat. Now rebuilding the mobile client in Flutter.",
    url: "https://spyll.in",
    playStore:
      "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll.png",
    stack: ["Next.js", "Flutter", "Socket.IO", "WebRTC", "Redis", "MongoDB"],
    metrics: "1,200+ installs in the first month",
    year: "2023",
    status: "active",
    audience: ["founder"],
    accent: "var(--c-lilac)",
  },
  {
    slug: "avana",
    name: "Avana",
    tagline: "Multi-agent research platform for Bali real estate",
    role: "Freelance · Sole Developer",
    location: "Bali, Indonesia",
    description:
      "Built solo, end to end. Multi-agent chat with orchestrator and specialist handoffs, realtime voice via WebRTC, Xendit payments, and an admin panel with automated news scraping, across two codebases, one developer.",
    url: "https://avanaapp.ai/",
    image: "/images/projects/avana.png",
    stack: ["Next.js 16", "OpenAI Agents", "WebRTC", "Xendit", "MongoDB"],
    metrics: "Multi-agent AI · Realtime voice · payments",
    year: "2025",
    status: "active",
    audience: ["freelance"],
    accent: "var(--c-mint)",
  },
  {
    slug: "autoremov",
    name: "AutoRemov",
    tagline: "Automated background-removal pipeline & API",
    role: "Freelance · Backend Engineer",
    description:
      "The backend for an automated image background-removal product: a queue-driven processing pipeline, a clean REST API, batch jobs, and storage/CDN delivery, built to chew through large volumes of images with retries and predictable cost.",
    url: "https://autoremov.com",
    image: "/images/projects/avana.png",
    stack: ["Node.js", "FastAPI", "Queues", "AWS S3", "CloudFront", "Docker"],
    metrics: "Queue-driven batch pipeline · REST API",
    year: "2025",
    status: "active",
    audience: ["freelance"],
    accent: "var(--c-sky)",
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "Daily-essay product with an automated pipeline",
    role: "Founder · Solo",
    location: "India",
    description:
      "Every morning at 9:00 IST a Python pipeline researches, writes a long-form essay, saves it, creates a Notion page, generates TTS audio via S3/CloudFront, and emails subscribers, untouched. A Next.js frontend with timezone-aware caching and dynamic OG images.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle.png",
    stack: ["Next.js 16", "Python", "FastAPI", "OpenAI", "AWS S3", "MongoDB"],
    metrics: "Automated daily pipeline · TTS narration",
    year: "2025",
    status: "active",
    audience: ["founder"],
    accent: "var(--c-butter)",
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

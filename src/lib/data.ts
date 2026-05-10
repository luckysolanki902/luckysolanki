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
  url?: string;
  github?: string;
  playStore?: string;
  image: string;
  stack: string[];
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
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "Revenue-bearing ecommerce platform",
    role: "Co-Founder & Lead Developer",
    description:
      "E-commerce platform for custom vehicle wraps and stickers. Multi-gateway payment orchestration (Razorpay + PayU fallback), Shiprocket shipping, server-side Meta tracking, and an admin panel with Sankey funnel analytics and customer journey analysis. Grew to 100K+ monthly users and ₹60L annual revenue.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js 15", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    metrics: "100K+ monthly users · ₹60L annual revenue",
    year: "2023",
    status: "shipped",
  },
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Consumer social app for college students",
    role: "Founder",
    description:
      "Anonymous social platform for college students in India. 1,200+ Android downloads in the first month with zero paid marketing. Real-time 1:1 chat pair matching, voice calls, and encrypted confessions. Redis pub/sub matching engine with WebRTC voice and Socket.IO chat. Rebuilding mobile client in Flutter for native-grade smoothness.",
    url: "https://spyll.in",
    playStore: "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll.png",
    stack: ["Next.js", "Flutter", "Socket.IO", "WebRTC", "Redis", "MongoDB"],
    metrics: "1,200+ downloads in the first month",
    year: "2023",
    status: "active",
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "Daily essay product with automated publishing pipeline",
    role: "Solo Project",
    location: "India",
    description:
      "A daily essay platform. Every morning at 9:00 AM IST, a Python pipeline generates a long-form essay with web research, saves it to MongoDB, creates a Notion page, produces TTS audio via S3 and CloudFront, and emails subscribers. Next.js frontend with timezone-aware caching and dynamic OG images.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle.png",
    stack: ["Next.js 16", "Python", "FastAPI", "OpenAI", "AWS S3", "MongoDB"],
    metrics: "Automated daily pipeline · TTS narration",
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

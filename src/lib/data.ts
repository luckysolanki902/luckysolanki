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
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  current: boolean;
}

export const siteConfig = {
  name: "Lucky Solanki",
  title: "Lucky Solanki — Engineer & Founder",
  description:
    "Full-stack engineer at Blitzit. Founder of Spyll. Building software that gets used.",
  url: "https://luckysolanki.dev",
} as const;

export const socials = {
  github: "https://github.com/luckysolanki902",
  linkedin: "https://linkedin.com/in/luckysolanki902",
  email: "luckysolanki902@gmail.com",
} as const;

export const experience: Experience[] = [
  {
    company: "Blitzit",
    role: "Software Engineer",
    period: "2024 — Now",
    current: true,
  },
  {
    company: "Spyll",
    role: "Founder",
    period: "2023 — Now",
    current: true,
  },
  {
    company: "MaddyCustom",
    role: "Co-Founder & Lead Dev",
    period: "2023 — 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Anonymous college social platform",
    role: "Founder",
    description:
      "Anonymous social platform for college students in India. Real-time 1:1 chat pair matching, voice calls, encrypted confessions, and a post feed — live across 1,300+ colleges. Next.js with Socket.IO, WebRTC, Redis pub/sub for scaling, and Capacitor for Android.",
    url: "https://spyll.in",
    playStore: "https://play.google.com/store/apps/details?id=in.spyll.app&pcampaignid=lucky_portfolio",
    image: "/images/projects/spyll.png",
    stack: ["Next.js", "Socket.IO", "WebRTC", "MongoDB", "Redis", "Capacitor"],
    metrics: "Download on Play Store",
    year: "2023",
    status: "active",
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "E-commerce for vehicle customization",
    role: "Co-Founder & Lead Developer",
    description:
      "E-commerce platform for custom vehicle wraps and stickers. Dual payment gateways, Shiprocket shipping, server-side Meta tracking, and an admin panel with Sankey funnel analytics. Grew to 100K+ monthly users and ₹60L annual revenue.",
    url: "https://maddycustom.vercel.app",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js 15", "MongoDB", "Razorpay", "Shiprocket", "Meta API", "Clerk"],
    metrics: "100K+ monthly users · ₹60L annual revenue",
    year: "2023",
    status: "shipped",
  },
  {
    slug: "blitzit",
    name: "Blitzit",
    url: "https://www.blitzit.app",
    tagline: "AI-powered task management platform",
    role: "Software Engineer",
    description:
      "MCP server with OAuth 2.1 (PKCE), JSON-RPC 2.0 over Streamable HTTP, and 13 AI-callable tools. Deep bidirectional sync with Asana, ClickUp, and Google Calendar. BullMQ notification queue and timezone-aware scheduling across 21 timezones.",
    image: "/images/projects/blitzit.jpeg",
    stack: ["Fastify", "BullMQ", "MCP SDK", "Firebase", "OAuth 2.1", "Electron"],
    metrics: "13 AI-callable tools · 21-timezone scheduling",
    year: "2024",
    status: "active",
  },
  {
    slug: "avana",
    name: "Avana",
    tagline: "AI-powered Bali land investment platform",
    role: "Freelance · Sole Developer",
    description:
      "AI investment research platform for Bali real estate. Multi-agent chat with orchestrator and specialist handoffs, realtime voice via WebRTC, Xendit payment integration, and an admin panel with automated news scraping. Two codebases, built solo.",
    url: "https://web.avanaapp.ai",
    image: "/images/projects/avana.png",
    stack: ["Next.js 16", "OpenAI Agents", "WebRTC", "Xendit", "MongoDB", "Supabase"],
    metrics: "Multi-agent AI · Realtime voice · Xendit payments",
    year: "2025",
    status: "active",
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "One essay per day. No feed. No algorithm.",
    role: "Solo Project",
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
    "React, Next.js",
    "Vue.js, Electron",
    "Framer Motion",
    "CSS Modules, Tailwind",
    "MUI, shadcn/ui",
  ],
  backend: [
    "Node.js, Fastify",
    "Python, FastAPI",
    "MongoDB, MySQL, Firebase",
    "BullMQ, Redis",
  ],
  infrastructure: [
    "AWS S3, CloudFront",
    "Vercel, Render",
    "Docker, CI/CD",
    "Cloudflare",
  ],
  also: "WebRTC, Socket.IO, OpenAI, Razorpay, Capacitor, MCP Protocol, Clerk, Playwright",
} as const;

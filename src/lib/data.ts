/* ============================================================
   DATA LAYER — All portfolio content lives here.
   Single source of truth. No hardcoded strings in components.
   ============================================================ */

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  url?: string;
  github?: string;
  image: string;
  stack: string[];
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
  description: "I build products people actually use.",
  url: "https://luckysolanki.dev",
} as const;

export const socials = {
  github: "https://github.com/Luckysolanki902",
  linkedin: "https://linkedin.com/in/luckysolanki902",
  email: "luckysolanki902@gmail.com",
} as const;

export const experience: Experience[] = [
  {
    company: "Blitzit",
    role: "Full-Stack Engineer",
    period: "2025 — Now",
    current: true,
  },
  {
    company: "Spyll",
    role: "Co-Founder",
    period: "2024 — Now",
    current: true,
  },
  {
    company: "MaddyCustom",
    role: "Co-Founder",
    period: "2022 — 2026",
    current: false,
  },
];

export const projects: Project[] = [
  {
    slug: "spyll",
    name: "Spyll",
    tagline: "Social platform for real connections",
    description:
      "A social platform where conversations happen in real time — voice, video, and text. Built with WebRTC for peer-to-peer communication and Socket.IO for instant presence. Designed to feel like being in the same room.",
    url: "https://spyll.in",
    image: "/images/projects/spyll.png",
    stack: ["Next.js", "Socket.IO", "MongoDB", "WebRTC"],
    year: "2024",
    status: "active",
  },
  {
    slug: "maddycustom",
    name: "MaddyCustom",
    tagline: "Vehicle personalization eCommerce",
    description:
      "An eCommerce platform for vehicle personalization serving 50K+ monthly users. Built the entire stack from storefront to admin dashboard to payment pipeline. Ranked top 5 on Google for core product keywords.",
    url: "https://maddycustom.com",
    image: "/images/projects/maddycustom.png",
    stack: ["Next.js", "MongoDB", "Razorpay", "AWS S3"],
    year: "2022",
    status: "shipped",
  },
  {
    slug: "blitzit",
    name: "Blitzit — MCP Integration",
    tagline: "Unified productivity platform",
    description:
      "Engineering integrations that connect tools like Asana, Trello, and Notion into one unified product. Building the bridge layer that lets teams work across platforms without context-switching.",
    image: "/images/projects/blitzit.png",
    stack: ["Next.js", "Node.js", "REST APIs", "TypeScript"],
    year: "2025",
    status: "active",
  },
  {
    slug: "dailicle",
    name: "Dailicle",
    tagline: "Daily articles & perspectives",
    description:
      "A reading platform built around daily curated content. Shows product thinking beyond code — editorial design, content hierarchy, and reader experience at the center.",
    url: "https://dailicle.com",
    image: "/images/projects/dailicle.png",
    stack: ["Next.js", "MongoDB", "OpenAI"],
    year: "2024",
    status: "active",
  },
];

export const tools = {
  frontend: ["React, Next.js", "Framer Motion", "CSS Modules"],
  backend: ["Node.js, Express", "MongoDB, MySQL", "REST, WebSocket"],
  infrastructure: ["AWS, Vercel", "CI/CD", "Cloudflare, S3"],
  also: "Python, Firebase, Razorpay, Socket.IO, WebRTC, OpenAI",
} as const;

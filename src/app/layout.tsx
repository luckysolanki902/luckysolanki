import type { Metadata } from "next";
import { Fraunces, Inter, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, socials } from "@/lib/data";
import "./globals.css";

// Display serif — headings, the name, section titles.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Body — clean and quiet.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Handwriting — the playful bits: kickers, captions, little notes.
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "Lucky Solanki",
    "product engineer",
    "AI workflows",
    "MCP server developer",
    "integrations",
    "realtime systems",
    "payments",
    "Next.js",
    "founder",
    "Blitzit",
    "Spyll",
    "portfolio",
    "India",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.title,
    description:
      "Product engineering for AI workflows, integrations, payments, realtime systems, and internal tooling.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucky Solanki — Product Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description:
      "Product engineering for AI workflows, integrations, payments, realtime systems, and internal tooling.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
  metadataBase: new URL(siteConfig.url),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: "Lead Backend Engineer",
  url: siteConfig.url,
  email: socials.email,
  sameAs: [
    socials.github,
    socials.linkedin,
    socials.x,
  ],
  description: siteConfig.description,
  worksFor: {
    "@type": "Organization",
    name: "Blitzit",
    url: "https://www.blitzit.app",
  },
  knowsAbout: [
    "AI Workflows",
    "MCP Servers",
    "API Integrations",
    "Realtime Systems",
    "Payments",
    "Internal Tooling",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "WebRTC",
    "Socket.IO",
    "TypeScript",
    "Full-Stack Development",
  ],
  hasCreativeWork: [
    {
      "@type": "SoftwareApplication",
      name: "Spyll",
      url: "https://spyll.in",
      description:
        "Anonymous social platform for college students in India. Live across 1,300+ colleges.",
      applicationCategory: "SocialNetworkingApplication",
      operatingSystem: "Web, Android",
    },
    {
      "@type": "SoftwareApplication",
      name: "MaddyCustom",
      url: "https://maddycustom.vercel.app",
      description:
        "E-commerce platform for custom vehicle wraps and stickers. 100K+ monthly users, ₹60L annual revenue.",
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Web",
    },
    {
      "@type": "SoftwareApplication",
      name: "Blitzit",
      url: "https://www.blitzit.app",
      description:
        "AI-powered task management with MCP server, 13 AI-callable tools, and deep calendar integrations.",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web, Mac",
    },
    {
      "@type": "SoftwareApplication",
      name: "Avana",
      url: "https://avanaapp.ai/",
      description:
        "AI investment research platform for Bali real estate with multi-agent chat and realtime voice.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
    },
    {
      "@type": "SoftwareApplication",
      name: "Dailicle",
      url: "https://dailicle.com",
      description:
        "Daily essay platform with automated AI writing pipeline, TTS narration, and subscriber emails.",
      applicationCategory: "NewsApplication",
      operatingSystem: "Web",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');`,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${caveat.variable}`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}

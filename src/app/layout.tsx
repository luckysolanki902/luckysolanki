import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Weather } from "@/components/shared/Weather";
import { Buddy } from "@/components/Buddy/Buddy";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, socials } from "@/lib/data";
import "./globals.css";

const display = Inter({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: ["Lucky Solanki", "Backend Engineer", "AI Engineer", "Full Stack Developer", "MCP", "API Integrations", "TypeScript", "Node.js"],
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
      siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og?v=3",
        width: 1200,
        height: 630,
        alt: "Lucky Solanki, Backend and AI Engineer. Building products, systems, and the connections between them.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description:
      siteConfig.description,
    images: ["/og?v=3"],
    creator: "@luckysolanki902",
  },
  metadataBase: new URL(siteConfig.url),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  image: `${siteConfig.url}/og?v=3`,
  name: siteConfig.name,
  jobTitle: "Backend & AI Engineer",
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
    "Applied AI",
    "Backend Architecture",
    "Deployment",
    "Product Infrastructure",
    "AI Integrations",
    "Workflow Automation",
    "API Design",
    "Queue Systems",
    "Job Workers",
    "Fastify",
    "Node.js",
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
    "Agent Infrastructure",
  ],
  subjectOf: [
    {
      "@type": "SoftwareApplication",
      name: "Spyll",
      url: "https://spyll.in",
      description:
        "Anonymous social platform for college students in India. Built for verified campus communities.",
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
        "AI-powered task management with MCP-based AI-callable product tools and calendar integrations.",
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
        "Weekly publication for deeply researched essays, built around a calm reading archive and subscriber delivery.",
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
            __html: `
              (function() {
                try {
                  var stored = JSON.parse(localStorage.getItem('portfolio-theme') || '{}');
                  // Only use stored theme if user explicitly chose one (userOverride=true)
                  var theme = (stored.state && stored.state.userOverride && stored.state.theme);
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
                if (location.pathname === '/' && performance.getEntriesByType('navigation')[0]?.type === 'reload') {
                  history.scrollRestoration = 'manual';
                  history.replaceState(history.state, '', location.pathname + location.search);
                  window.scrollTo(0, 0);
                  window.addEventListener('load', function() {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    history.scrollRestoration = 'auto';
                  }, { once: true });
                }
                // Signal CSS that JS is active, enables bot-safe animations
                document.documentElement.classList.add('js');
              })();
            `,
          }}
        />
      </head>
      <body className={`${display.variable} ${inter.variable}`}>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <Weather />
          {children}
          <Buddy />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}

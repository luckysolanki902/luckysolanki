import type { Metadata } from "next";
import { Quicksand, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucky Solanki — Software Engineer & Founder",
  description:
    "Software engineer at Blitzit. Founder of Spyll. Building software that gets used.",
  keywords: [
    "Lucky Solanki",
    "software engineer",
    "founder",
    "Next.js",
    "full-stack developer",
    "Entrepreneur",
    "Blitzit",
    "Spyll",
    "portfolio",
    "India",
  ],
  authors: [{ name: "Lucky Solanki", url: "https://luckysolanki.com" }],
  creator: "Lucky Solanki",
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
    canonical: "https://luckysolanki.com",
  },
  openGraph: {
    title: "Lucky Solanki — Software Engineer & Founder",
    description: "I build products people actually use.",
    url: "https://luckysolanki.com",
    siteName: "Lucky Solanki",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucky Solanki — Software Engineer & Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Solanki — Software Engineer & Founder",
    description: "I build products people actually use.",
    images: ["/og-image.png"],
    creator: "@luckysolanki902",
  },
  metadataBase: new URL("https://luckysolanki.com"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucky Solanki",
  jobTitle: "Software Engineer & Founder",
  url: "https://luckysolanki.com",
  email: "luckysolanki902@gmail.com",
  sameAs: [
    "https://github.com/Luckysolanki902",
    "https://linkedin.com/in/luckysolanki902",
  ],
  description:
    "Software engineer at Blitzit. Founder of Spyll. Building software that gets used.",
  worksFor: {
    "@type": "Organization",
    name: "Blitzit",
    url: "https://www.blitzit.app",
  },
  knowsAbout: [
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
      url: "https://web.avanaapp.ai",
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
                // Signal CSS that JS is active — enables bot-safe animations
                document.documentElement.classList.add('js');
              })();
            `,
          }}
        />
      </head>
      <body className={`${quicksand.variable} ${inter.variable}`}>
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}

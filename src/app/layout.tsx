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
  openGraph: {
    title: "Lucky Solanki — Software Engineer & Founder",
    description: "I build products people actually use.",
    url: "https://luckysolanki.dev",
    siteName: "Lucky Solanki",
    type: "website",
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
  },
  metadataBase: new URL("https://luckysolanki.dev"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucky Solanki",
  jobTitle: "Software Engineer & Founder",
  url: "https://luckysolanki.dev",
  sameAs: [
    "https://github.com/Luckysolanki902",
    "https://linkedin.com/in/luckysolanki902",
  ],
  description:
    "Software engineer at Blitzit. Founder of Spyll. Building software that gets used.",
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

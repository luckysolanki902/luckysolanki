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
  title: "Lucky Solanki — Engineer & Founder",
  description:
    "I build products people actually use. Engineer at Blitzit, co-founder of Spyll. Full-stack development, from first line to first user.",
  openGraph: {
    title: "Lucky Solanki — Engineer & Founder",
    description: "I build products people actually use.",
    url: "https://luckysolanki.dev",
    siteName: "Lucky Solanki",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucky Solanki — Engineer & Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucky Solanki — Engineer & Founder",
    description: "I build products people actually use.",
    images: ["/og-image.png"],
  },
  metadataBase: new URL("https://luckysolanki.dev"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucky Solanki",
  jobTitle: "Engineer & Founder",
  url: "https://luckysolanki.dev",
  sameAs: [
    "https://github.com/Luckysolanki902",
    "https://linkedin.com/in/luckysolanki902",
  ],
  description:
    "I build products people actually use. Engineer at Blitzit, co-founder of Spyll.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = JSON.parse(localStorage.getItem('portfolio-theme') || '{}');
                  var theme = (stored.state && stored.state.theme) || 'light';
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

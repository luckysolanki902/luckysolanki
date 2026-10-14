import type { Metadata } from "next";
import { siteConfig } from "./data";

export const shareImage = "/images/social/lucky-solanki-v2.jpg";
export const shareAlt = "Lucky Solanki — The backend behind a better product. Backend and AI engineer, with a small pixel-art character typing on a laptop.";

export function pageMetadata({ title, description, path, card, article = false }: {
  title: string; description: string; path: string; card?: string; article?: boolean;
}): Metadata {
  const image = card ? `/og?post=${encodeURIComponent(card)}&v=5` : shareImage;
  const url = new URL(path, siteConfig.url).href;
  return {
    title, description, alternates: { canonical: url },
    openGraph: { title, description, url, siteName: siteConfig.name, locale: "en_US", type: article ? "article" : "website", images: [{ url: image, width: 1200, height: 630, alt: card ? `${title} — Lucky Solanki’s engineering field notes` : shareAlt }] },
    twitter: { card: "summary_large_image", title, description, creator: "@luckysolanki902", images: [{ url: image, alt: card ? title : shareAlt }] },
  };
}

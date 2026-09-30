/* Static semantic text; section motion is coordinated by PortfolioMotion.
   The existing API is retained for article and shared-component callers. */
"use client";
import type { CSSProperties } from "react";
type AsTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "li" | "a";
export type HoverTextVariant =
  | "heading"
  | "paragraph"
  | "cta"
  | "chip"
  | "card-heading"
  | "label"
  | "detail";

interface HoverTextProps {
  children: string;
  as?: AsTag;
  variant?: HoverTextVariant;
  className?: string;
  font?: string;
  style?: CSSProperties;
}

export function HoverText({ children, as: Tag = "span", className, style }: HoverTextProps) {
  return <Tag className={className} style={style}>{children}</Tag>;
}

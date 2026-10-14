"use client";
import { useEffect } from "react";

/**
 * In-page anchors (header nav, "See my work", room shortcuts) rely on CSS
 * `scroll-behavior: smooth`, which does not take effect for fragment
 * navigation here, so clicks land as instant jumps. This delegates those
 * clicks to an explicit smooth scroll on the viewport (window.scrollTo moves
 * reliably regardless of scroll-container quirks) while respecting reduced
 * motion and each section's scroll-margin.
 */
export function SmoothScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = decodeURIComponent((anchor.hash || "").slice(1));
      const target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const marginTop = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - marginTop;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      history.pushState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

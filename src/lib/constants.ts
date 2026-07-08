/* ============================================================
   CONSTANTS — Site-wide constants and section IDs
   ============================================================ */

export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  work: "work",
  blog: "blog",
  tools: "tools",
  contact: "contact",
} as const;

export const NAV_LINKS = [
  { label: "About", href: `/#${SECTION_IDS.about}` },
  { label: "Work", href: `/#${SECTION_IDS.work}` },
  { label: "Blog", href: `/#${SECTION_IDS.blog}` },
  { label: "Contact", href: `/#${SECTION_IDS.contact}` },
] as const;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  wide: 1400,
} as const;

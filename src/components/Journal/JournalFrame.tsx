import Link from "next/link";
import { Pixelify_Sans } from "next/font/google";
import type { ReactNode } from "react";
import styles from "./Journal.module.css";
const pixel = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

export function JournalFrame({ children }: { children: ReactNode }) {
  return (
    <div className={`${styles.world} ${pixel.variable}`}>
      <header className={styles.navigation}>
        <Link href="/">← Back to the room</Link>
        <Link href="/blog">Lucky’s field notes</Link>
        <Link href="/#contact">Say hello ↗</Link>
      </header>
      <div className={styles.readingTrail} aria-hidden="true">
        <span />
      </div>
      <div className={styles.paper}>{children}</div>
      <footer className={styles.footer}>
        <span>End of this page. More to explore.</span>
        <Link href="/blog">All field notes →</Link>
        <Link href="/">Return to the room ↗</Link>
      </footer>
    </div>
  );
}

export const notes = [
  {
    href: "/work/blitzit",
    number: "01",
    kind: "Engineering",
    title: "Building the backend at Blitzit",
    text: "The decisions behind the backend, integrations, and AI tools.",
    symbol: "⌘",
  },
  {
    href: "/work/maddycustom",
    number: "02",
    kind: "Building a business",
    title: "From bike wraps to software",
    text: "The storefront and operations software I built for MaddyCustom.",
    symbol: "◇",
  },
  {
    href: "/stories/journey",
    number: "03",
    kind: "Background",
    title: "How I got into software",
    text: "Games, design, a mechanical engineering degree, and learning by building.",
    symbol: "↗",
  },
  {
    href: "/stories/ai",
    number: "04",
    kind: "Perspective",
    title: "Working with AI",
    text: "Notes on how AI fits into the way I build software.",
    symbol: "✦",
  },
];
export function NotesIndex() {
  return (
    <JournalFrame>
      <main id="main-content" className={styles.index}>
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>THE BOOKSHELF / 4 ENTRIES</span>
          <h1>Field notes.</h1>
          <p>
            What I built, what I learned,
            <br />
            and how I got here.
          </p>
          <div className={styles.bookmark} aria-hidden="true">
            LS
          </div>
        </div>
        <div className={styles.notes}>
          {notes.map((note) => (
            <Link key={note.href} href={note.href} className={styles.note}>
              <span className={styles.number}>{note.number}</span>
              <span>
                <small>{note.kind}</small>
                <h2>{note.title}</h2>
                <p>{note.text}</p>
              </span>
              <span className={styles.symbol} aria-hidden="true">
                {note.symbol}
              </span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
        <p className={styles.colophon}>
          A small collection. Written from things I’ve actually worked on.
        </p>
      </main>
    </JournalFrame>
  );
}

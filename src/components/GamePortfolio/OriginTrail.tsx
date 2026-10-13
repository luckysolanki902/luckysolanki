"use client";
import { useState } from "react";
import { Gamepad2, Store, Braces } from "lucide-react";
import styles from "./Portfolio.module.css";
const chapters = [
  { label: "Games", icon: Gamepad2, text: "Game development was my way into code. The little room above is a nod to that beginning." },
  { label: "A business", icon: Store, text: "At MaddyCustom, I built the storefront and tools behind a business I co-founded." },
  { label: "Systems", icon: Braces, text: "Today, I build backend and AI systems at Blitzit. Still learning by making things work." },
];
export function OriginTrail() {
 const [chapter, setChapter] = useState(2);
 return <aside className={styles.origin} aria-label="A little of my story">
   <span className={styles.originLabel}>A FEW STEPS THAT GOT ME HERE</span>
   <div className={styles.originTrail}>{chapters.map(({label,icon:Icon},i)=><button key={label} onClick={()=>setChapter(i)} aria-pressed={chapter===i} aria-controls="origin-note"><Icon size={17}/><span>{label}</span></button>)}</div>
   <p id="origin-note" aria-live="polite">{chapters[chapter].text}</p>
   <a href="/stories/journey">The story so far ↗</a>
 </aside>;
}

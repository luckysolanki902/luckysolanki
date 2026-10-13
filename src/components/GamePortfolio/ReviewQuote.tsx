"use client";

import { useId, useState } from "react";
import styles from "./Portfolio.module.css";

export function ReviewQuote({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const long = text.length > 280;
  const boundary = text.lastIndexOf(" ", 240);
  const excerpt = `${text.slice(0, boundary > 0 ? boundary : 240)}…`;

  return <>
    <blockquote id={id}>{long && !expanded ? excerpt : text}</blockquote>
    {long && <button type="button" className={styles.reviewToggle} aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
      {expanded ? "Show less" : "Show more"}
    </button>}
  </>;
}

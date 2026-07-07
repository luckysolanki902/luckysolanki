/* PostBody — renders a post's blocks into a calm, readable page.
   Block-based today; drops in cleanly if we move to MDX later. */

import type { Block } from "@/lib/posts";
import styles from "./Blog.module.css";

export function PostBody({ body }: { body: Block[] }) {
  return (
    <div className={styles.prose}>
      {body.map((b, i) => {
        switch (b.type) {
          case "h2":
            return <h2 key={i}>{b.text}</h2>;
          case "p":
            return <p key={i}>{b.text}</p>;
          case "quote":
            return (
              <blockquote key={i}>
                <p>{b.text}</p>
              </blockquote>
            );
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre key={i} className={styles.code}>
                {b.lang && <span className={styles.codeLang}>{b.lang}</span>}
                <code>{b.code}</code>
              </pre>
            );
        }
      })}
    </div>
  );
}

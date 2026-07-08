"use client";

import { useEffect, useId, useState } from "react";
import mermaid from "mermaid";
import styles from "@/app/blog/blog.module.css";

interface MermaidDiagramProps {
  title: string;
  code: string;
}

export function MermaidDiagram({ title, code }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "dark",
      flowchart: {
        curve: "basis",
        htmlLabels: false,
      },
    });

    mermaid
      .render(`blog-diagram-${id}`, code)
      .then(({ svg: rendered }) => {
        if (!cancelled) setSvg(rendered);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  return (
    <figure className={styles.diagram}>
      <figcaption>{title}</figcaption>
      {svg && !failed ? (
        <div
          className={styles.diagramSvg}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <pre>{code}</pre>
      )}
    </figure>
  );
}

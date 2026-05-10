/* ============================================================
   ResumeCard — Creative resume download card.
   Two-layer stacked paper illusion.
   Hover: back card fans out, front card lifts.
   Click: arrow → checkmark confirmation.
   ============================================================ */

"use client";

import { useState } from "react";
import styles from "./ResumeCard.module.css";

export function ResumeCard() {
  const [status, setStatus] = useState<"idle" | "done">("idle");

  const handleClick = () => {
    setStatus("done");
    setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <div className={styles.stack}>
      {/* Shadow / back card */}
      <div className={styles.back} aria-hidden="true" />

      {/* Main card */}
      <div className={styles.card}>
        {/* Top-right folded corner */}
        <div className={styles.fold} aria-hidden="true" />

        {/* Header row */}
        <div className={styles.header}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className={styles.headerLabel}>RÉSUMÉ</span>
          <span className={styles.headerMeta}>· 2026</span>
        </div>

        {/* Identity */}
        <div className={styles.body}>
          <p className={styles.name}>Lucky Solanki</p>
          <p className={styles.role}>Product Engineer</p>
        </div>

        {/* Download action */}
        <div className={styles.footer}>
          <a
            href="/resume.pdf"
            download="Lucky_Solanki_Resume.pdf"
            className={`${styles.downloadBtn} ${status === "done" ? styles.done : ""}`}
            onClick={handleClick}
            aria-label="Download Lucky Solanki's resume as PDF"
          >
            {status === "done" ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.downloadIcon}
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download</span>
              </>
            )}
          </a>
          <span className={styles.fileBadge}>PDF</span>
        </div>
      </div>
    </div>
  );
}

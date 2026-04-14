/* ============================================================
   MarginNote — Superscript number that reveals a personal note.
   Desktop: note floats in the right margin.
   Mobile: note expands inline below the trigger.
   ============================================================ */

"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./MarginNote.module.css";

interface MarginNoteProps {
  number: number;
  children: React.ReactNode;
}

export function MarginNote({ number, children }: MarginNoteProps) {
  const [open, setOpen] = useState(false);
  const noteRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        noteRef.current &&
        !noteRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <span className={`${styles.wrapper} marginNote`}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Note ${number}`}
      >
        {number}
      </button>
      {open && (
        <span ref={noteRef} className={styles.note} role="note">
          <span className={styles.noteNumber}>{number}.</span>
          <span className={styles.noteContent}>{children}</span>
        </span>
      )}
    </span>
  );
}

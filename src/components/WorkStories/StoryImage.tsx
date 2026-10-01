"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { WorkMedia } from "@/lib/work-media";
import styles from "./StoryImage.module.css";

export function StoryImage({ image, priority = false }: { image: WorkMedia; priority?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  return <figure className={styles.figure}>
    <button className={styles.preview} type="button" data-story-image={image.id} aria-label={`Enlarge screenshot: ${image.title}`} onClick={() => { setOpen(true); dialog.current?.showModal(); }}>
      <Image src={image.src} alt={image.title} width={image.width} height={image.height} sizes={priority ? "(max-width: 767px) 92vw, 1200px" : "(max-width: 767px) 92vw, 820px"} priority={priority} />
      <span className={styles.expand} aria-hidden="true">View screenshot ↗</span>
    </button>
    <figcaption><strong>{image.title}.</strong> {image.caption}</figcaption>
    <dialog ref={dialog} className={styles.dialog} aria-label={image.title} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.dialogHeader}><p>{image.title}</p><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Close screenshot">Close ×</button></div>
      {/* The full-resolution asset loads only when the visitor opens it. */}
      {open && <Image src={image.src} alt={image.title} width={image.width} height={image.height} unoptimized />}
      <p className={styles.detailCaption}>{image.caption}</p>
    </dialog>
  </figure>;
}

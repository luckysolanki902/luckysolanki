"use client";

import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { PublicTestimonial } from "@/lib/testimonials";
import styles from "./Testimonials.module.css";

function excerpt(text: string) {
  if (text.length <= 160) return text;
  const sentences = text.match(/[^.!?]+[.!?]+(?:[”’"])?|[^.!?]+$/g)?.map((s) => s.trim()) ?? [text];
  const chosen = sentences.find((s) => s.length < 160 && /quality|recommend|efficient|dependable/i.test(s)) ?? sentences[0];
  return chosen.length <= 160 ? chosen : chosen.slice(0, 160).replace(/\s+\S*$/, "") + "…";
}

export function TestimonialGallery({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const [selected, setSelected] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const start = useRef<{x: number; y: number} | null>(null);
  const moved = useRef(false);
  const select = (index: number) => { setSelected(index); setFlipped(false); };
  const change = (direction: number) => select((selected + direction + testimonials.length) % testimonials.length);
  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    if (event.type !== "pointercancel" && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) change(dx < 0 ? 1 : -1);
    start.current = null;
    stage.current?.style.setProperty("--drag", "0px");
    stage.current?.removeAttribute("data-dragging");
  };

  return (
    <section id="testimonials" className={styles.section} aria-labelledby="testimonials-heading">
      <header className={styles.header}>
        <span className={styles.eyebrow}>People make the work worthwhile</span>
        <h2 id="testimonials-heading">Good people. <em>Kind words.</em></h2>
        <p>A few notes from the people on the other side of the build.</p>
      </header>
      <div ref={stage} className={styles.stage} data-count={testimonials.length} data-current={selected} role="region" aria-roledescription="carousel" aria-label="Collaborator testimonials" tabIndex={0}
        onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); change(event.key === "ArrowRight" ? 1 : -1); } }}
        onPointerDown={(event) => { if (event.button !== 0 || (event.target as HTMLElement).closest("button, a") || flipped) return; start.current = {x: event.clientX, y: event.clientY}; moved.current = false; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={(event) => { if (!start.current) return; const dx = event.clientX - start.current.x; if (Math.abs(dx) > 8) { moved.current = true; stage.current?.setAttribute("data-dragging", "true"); stage.current?.style.setProperty("--drag", `${Math.max(-100, Math.min(100, dx)) * .45}px`); } }}
        onPointerUp={release} onPointerCancel={release}
        onClickCapture={(event) => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false; } }}>
        {testimonials.map((item, index) => {
          let offset = index - selected;
          if (testimonials.length > 2) {
            if (offset > testimonials.length / 2) offset -= testimonials.length;
            if (offset < -testimonials.length / 2) offset += testimonials.length;
          }
          const active = index === selected;
          const quote = excerpt(item.testimonial);
          return <article key={item.id} className={styles.card} data-active={active} style={{ "--offset": offset, "--depth": Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties} aria-label={`${item.name}, ${index + 1} of ${testimonials.length}`} aria-roledescription="slide">
            <div className={styles.turn} data-flipped={active && flipped}>
              <div className={`${styles.face} ${styles.front}`} inert={!active || flipped} aria-hidden={!active || flipped}>
                <div className={styles.cardTop}><span>{item.company}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
                <span className={styles.quoteMark} aria-hidden="true">“</span>
                <blockquote>{quote}</blockquote>
                <div className={styles.author}><span className={styles.avatar} aria-hidden="true">{item.name.split(/\s+/).slice(0,2).map((part) => part[0]).join("")}</span><span><strong>{item.name}</strong><small>{item.role} · {item.company}</small></span></div>
                {quote !== item.testimonial && <button className={styles.read} onClick={() => setFlipped(true)}><span>Read full recommendation</span><span className={styles.flipIcon} aria-hidden="true">↶</span></button>}
              </div>
              <div className={`${styles.face} ${styles.back}`} inert={!active || !flipped} aria-hidden={!active || !flipped}>
                <div className={styles.cardTop}><span>A note from {item.name}</span><button onClick={() => setFlipped(false)} aria-label="Turn back to quote">↶</button></div>
                <div className={styles.fullNote} tabIndex={active && flipped ? 0 : -1}><blockquote>{item.testimonial}</blockquote>{item.project && <p>{item.project}</p>}</div>
                <strong className={styles.signature}>{item.name}</strong>
              </div>
            </div>
            {!active && <button className={styles.choose} aria-label={`Bring ${item.name}'s testimonial forward`} onClick={() => select(index)} />}
          </article>;
        })}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => change(-1)} aria-label="Previous testimonial" disabled={testimonials.length < 2}>←</button>
        <span>Drag to explore <span aria-hidden="true">↔</span></span>
        <button type="button" onClick={() => change(1)} aria-label="Next testimonial" disabled={testimonials.length < 2}>→</button>
      </div>
      <p className={styles.srOnly} aria-live="polite">{testimonials[selected]?.name}, testimonial {selected + 1} of {testimonials.length}</p>
    </section>
  );
}

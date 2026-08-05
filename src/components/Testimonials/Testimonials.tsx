import { getApprovedTestimonials } from "@/lib/testimonials";
import { SectionLabel } from "@/components/shared/SectionLabel";
import styles from "./Testimonials.module.css";

export async function Testimonials() {
  const testimonials = await getApprovedTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className={styles.container}>
        <SectionLabel label="Kind words" />
        <div className={styles.headingRow}>
          <h2 id="testimonials-heading">Trusted by people I have built alongside.</h2>
          <p>What collaborators say after the work ships.</p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((item) => (
            <figure className={styles.card} key={item.id}>
              <span className={styles.quoteMark} aria-hidden="true">“</span>
              <blockquote>{item.testimonial}</blockquote>
              <figcaption>
                <span className={styles.avatar} aria-hidden="true">
                  {item.name.charAt(0).toUpperCase()}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.role} · {item.company}</small>
                  {item.project && <small className={styles.project}>{item.project}</small>}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

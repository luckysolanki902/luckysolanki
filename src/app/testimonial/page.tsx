import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialForm } from "@/components/Testimonials/TestimonialForm";
import styles from "./testimonial.module.css";

export const metadata: Metadata = {
  title: "Share a testimonial — Lucky Solanki",
  description: "Share a few words about your experience working with Lucky Solanki.",
  robots: { index: false, follow: false },
};

export default function TestimonialPage() {
  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}>← Lucky Solanki</Link>
          <span className={styles.private}>A private request</span>
        </header>

        <section className={styles.intro}>
          <p className={styles.eyebrow}>A small favour</p>
          <h1>Your perspective means more than a polished pitch.</h1>
          <p className={styles.lead}>
            If we have built something together, I would be grateful for a few
            honest words about the experience. Your note helps future founders
            and teams understand what working with me is actually like.
          </p>
          <div className={styles.reassurance}>
            <span>02 min</span>
            <p>Nothing is published automatically. I review every response first.</p>
          </div>
        </section>

        <TestimonialForm />

        <footer className={styles.footer}>
          <p>Thank you for trusting me with your words.</p>
        </footer>
      </div>
    </main>
  );
}

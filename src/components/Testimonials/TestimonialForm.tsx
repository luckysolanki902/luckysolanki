"use client";

import { FormEvent, useState } from "react";
import styles from "./TestimonialForm.module.css";

type FormState = "idle" | "submitting" | "success" | "error";

export function TestimonialForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      role: formData.get("role"),
      company: formData.get("company"),
      project: formData.get("project"),
      testimonial: formData.get("testimonial"),
      email: formData.get("email"),
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message);

      form.reset();
      setState("success");
    } catch (error) {
      setMessage(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successMark} aria-hidden="true">✓</span>
        <p className={styles.successEyebrow}>Received with gratitude</p>
        <h2>Thank you for taking the time.</h2>
        <p>
          Your words are safely submitted and will only appear after a manual
          review. I genuinely appreciate your support.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Your name <b>*</b></span>
          <input name="name" type="text" placeholder="e.g. Alex Morgan" maxLength={100} required />
        </label>
        <label className={styles.field}>
          <span>Your role <b>*</b></span>
          <input name="role" type="text" placeholder="e.g. Founder & CTO" maxLength={120} required />
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span>Company or startup <b>*</b></span>
          <input name="company" type="text" placeholder="e.g. Acme Labs" maxLength={120} required />
        </label>
        <label className={styles.field}>
          <span>Project we worked on <em>optional</em></span>
          <input name="project" type="text" placeholder="e.g. Product launch" maxLength={160} />
        </label>
      </div>

      <label className={styles.field}>
        <span>Your testimonial <b>*</b></span>
        <textarea
          name="testimonial"
          placeholder="What was it like working together? You might mention the problem, how I helped, and the outcome. A few honest sentences are perfect."
          rows={7}
          minLength={20}
          maxLength={1200}
          required
        />
        <small>No need to make it formal—specific and honest is wonderful.</small>
      </label>

      <label className={styles.field}>
        <span>Email <b>*</b></span>
        <input name="email" type="email" placeholder="you@company.com" maxLength={254} required />
        <small>This is only for verification. It will never be shown publicly.</small>
      </label>

      <label className={styles.honeypot} aria-hidden="true">
        Website
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <label className={styles.consent}>
        <input name="consent" type="checkbox" required />
        <span>
          Yes, you may display my testimonial, name, role, and company on your
          portfolio. I understand it will be reviewed before publishing.
        </span>
      </label>

      {state === "error" && <p className={styles.error} role="alert">{message}</p>}

      <div className={styles.submitRow}>
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Sending…" : "Share testimonial"}
          {state !== "submitting" && <span aria-hidden="true">→</span>}
        </button>
        <p>About two minutes. Thank you.</p>
      </div>
    </form>
  );
}

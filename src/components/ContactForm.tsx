"use client";

import { FormEvent, useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqeyevdb";
const FALLBACK_EMAIL = "hello@glowwithvani.com";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (FORMSPREE_ENDPOINT.includes("your-form-id")) {
      const name = String(formData.get("name") ?? "");
      const email = String(formData.get("email") ?? "");
      const eventDate = String(formData.get("eventDate") ?? "");
      const message = String(formData.get("message") ?? "");
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nEvent Date: ${eventDate || "Not provided"}\n\nMessage:\n${message}`
      );
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=GlowWithVani Inquiry&body=${body}`;
      return;
    }

    try {
      setState("submitting");
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Formspree request failed");
      }

      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form card">
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <label>
        Event Date (optional)
        <input type="date" name="eventDate" />
      </label>
      <label>
        Message
        <textarea name="message" rows={6} required />
      </label>
      <button type="submit" className="button" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
      {state === "success" ? <p className="status ok">Thanks, your inquiry was sent.</p> : null}
      {state === "error" ? <p className="status err">Something went wrong. Please use email fallback.</p> : null}
      <p className="status">
        Fallback: <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>
      </p>
    </form>
  );
}

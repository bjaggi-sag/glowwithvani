"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xqeyevdb";
const FALLBACK_EMAIL = "glowwithvani@gmail.com";

type FormStatus = "idle" | "submitting" | "success" | "error";
type InquirySnapshot = {
  name: string;
  email: string;
  eventDate: string;
  message: string;
};

function getTodayLocalDate() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().split("T")[0] ?? "";
}

export function ContactForm() {
  const [state, setState] = useState<FormStatus>("idle");
  const [minEventDate, setMinEventDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [snapshot, setSnapshot] = useState<InquirySnapshot>({
    name: "",
    email: "",
    eventDate: "",
    message: ""
  });

  useEffect(() => {
    // Compute from the user's local timezone so mobile date pickers enforce the correct minimum date.
    setMinEventDate(getTodayLocalDate());
  }, []);

  const fallbackMailtoHref = useMemo(() => {
    const body = encodeURIComponent(
      `Name: ${snapshot.name}\nEmail: ${snapshot.email}\nEvent Date: ${snapshot.eventDate || "Not provided"}\n\nMessage:\n${snapshot.message}`
    );
    return `mailto:${FALLBACK_EMAIL}?subject=GlowWithVani Inquiry&body=${body}`;
  }, [snapshot]);

  function resetFormState() {
    setState("idle");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextSnapshot = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      eventDate: String(formData.get("eventDate") ?? ""),
      message: String(formData.get("message") ?? "")
    };
    const eventDate = nextSnapshot.eventDate;

    setSnapshot(nextSnapshot);
    setErrorMessage("");

    if (eventDate && minEventDate && eventDate < minEventDate) {
      setState("error");
      setErrorMessage("Please choose today or a future event date.");
      return;
    }

    if (FORMSPREE_ENDPOINT.includes("your-form-id")) {
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=GlowWithVani Inquiry&body=${encodeURIComponent(
        `Name: ${nextSnapshot.name}\nEmail: ${nextSnapshot.email}\nEvent Date: ${eventDate || "Not provided"}\n\nMessage:\n${nextSnapshot.message}`
      )}`;
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
      setErrorMessage("");
    } catch {
      setState("error");
      setErrorMessage("The form could not be sent right now. You can try again or send the same inquiry by email instead.");
    }
  }

  if (state === "success") {
    return (
      <div className="contact-form card contact-feedback-card">
        <p className="status ok">Thanks, your inquiry was sent.</p>
        <p className="contact-feedback-copy">
          We&apos;ll review your details and reply within 24-48 hours. If your booking is time-sensitive, you can also email directly.
        </p>
        <div className="contact-feedback-actions">
          <button type="button" className="button" onClick={() => setState("idle")}>
            Send Another Inquiry
          </button>
          <a href={`mailto:${FALLBACK_EMAIL}`} className="button secondary">
            Email Directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form card">
      <label>
        Name
        <input type="text" name="name" required defaultValue={snapshot.name} onChange={() => state !== "idle" && resetFormState()} />
      </label>
      <label>
        Email
        <input type="email" name="email" required defaultValue={snapshot.email} onChange={() => state !== "idle" && resetFormState()} />
      </label>
      <label>
        Event Date (optional)
        <input type="date" name="eventDate" min={minEventDate} defaultValue={snapshot.eventDate} onChange={() => state !== "idle" && resetFormState()} />
      </label>
      <label>
        Message
        <textarea name="message" rows={6} required defaultValue={snapshot.message} onChange={() => state !== "idle" && resetFormState()} />
      </label>
      <button type="submit" className="button" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>
      {state === "error" ? (
        <div className="contact-feedback-card contact-error-panel">
          <p className="status err">{errorMessage}</p>
          <div className="contact-feedback-actions">
            <button type="submit" className="button secondary">
              Try Again
            </button>
            <a href={fallbackMailtoHref} className="button secondary">
              Email Instead
            </a>
          </div>
        </div>
      ) : null}
      <p className="status">
        Fallback: <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>
      </p>
    </form>
  );
}

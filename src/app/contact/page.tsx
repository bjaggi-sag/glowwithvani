import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book your GlowWithVani makeup session in Toronto, the GTA, or for destination weddings worldwide.",
  alternates: {
    canonical: "/contact/"
  }
};

export default function ContactPage() {
  return (
    <main className="section">
      <div className="container contact-layout">
        <div>
          <SectionHeading
            kicker="Contact"
            title="Book your glam session"
            copy="Share your event details and desired look. Replies are typically sent within 24-48 hours."
          />
          <p className="section-copy">
            Serving Toronto and the GTA. Bridal, editorial/photoshoots, party glam, and SFX bookings available.
          </p>
          <p className="section-copy">Available for destination weddings and open to worldwide travel.</p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}

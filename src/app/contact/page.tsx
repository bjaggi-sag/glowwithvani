import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact GlowWithVani to book bridal makeup, event glam, editorial makeup, or destination wedding makeup in Toronto, the GTA, and worldwide.",
  keywords: [
    "book makeup artist Toronto",
    "contact bridal makeup artist Toronto",
    "destination wedding makeup booking",
    "GTA makeup artist inquiry",
    "GlowWithVani contact"
  ],
  alternates: {
    canonical: "/contact/"
  }
};

export default function ContactPage() {
  return (
    <main className="section">
      <Reveal className="container contact-layout">
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
      </Reveal>
    </main>
  );
}

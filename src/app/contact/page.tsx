import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Toronto makeup artist Gurvani Kaur for film, music video, editorial, theatre, SFX, bridal, and event makeup. Share your production brief or booking details.",
  keywords: [
    "book makeup artist Toronto",
    "contact bridal makeup artist Toronto",
    "destination wedding makeup booking",
    "GTA makeup artist inquiry",
    "GlowWithVani contact",
  ],
  alternates: {
    canonical: "/contact/",
  },
};

export default function ContactPage() {
  return (
    <main id="main-content" className="section">
      <div className="container contact-layout">
        <div>
          <SectionHeading
            kicker="Contact"
            title="Let's create something memorable."
            copy="A creative brief, a character, or a special occasion. Tell Gurvani what you have in mind. Replies are typically sent within 24-48 hours."
          />
          <p className="section-copy">
            Serving Toronto and the GTA. Editorial, film and video, theatre,
            SFX, bridal, and event bookings. Production quotes are tailored to
            your project.
          </p>
          <p className="section-copy">
            Available for destination weddings and open to worldwide travel.
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}

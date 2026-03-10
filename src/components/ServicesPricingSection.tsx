import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { services, servicePricingNotes } from "@/data/services";
import { Reveal } from "@/components/Reveal";

export function ServicesPricingSection() {
  return (
    <section className="section" id="services">
      <Reveal className="container">
        <SectionHeading
          kicker="Services"
          title="Services"
          copy="Luxury makeup services designed for bridal, event, and editorial beauty."
        />

        <div className="pricing-grid">
          {services.map((service) => (
            <article key={service.id} className="pricing-card card">
              <h3>{service.title}</h3>
              <p className="price-value">{service.startingPrice}</p>
              <p className="pricing-description">{service.description}</p>
              <Link href="/contact" className="button pricing-cta">
                {service.cta}
              </Link>
            </article>
          ))}
        </div>

        <div className="pricing-notes card">
          <p className="pricing-note-title">Pricing Notes</p>
          <ul>
            {servicePricingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          <p className="pricing-meta-note">
            Final pricing may vary based on look, location, and custom requirements.
          </p>
          <p className="pricing-meta-note">
            For custom bookings, bridal parties, or special requests, please get in touch.
          </p>
          <Link href="/contact" className="button">
            Request Booking
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

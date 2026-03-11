import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Indian Bridal Makeup Toronto",
  description:
    "GlowWithVani offers Indian bridal makeup in Toronto with polished glam, skin-focused artistry, and bridal looks designed for weddings, ceremonies, and destination events.",
  keywords: [
    "Indian bridal makeup Toronto",
    "South Asian bridal makeup Toronto",
    "Indian makeup artist Toronto",
    "Indian wedding makeup Toronto",
    "bridal makeup Toronto Indian",
    "South Asian wedding makeup GTA"
  ],
  alternates: {
    canonical: "/indian-bridal-makeup-toronto/"
  }
};

export default function IndianBridalMakeupTorontoPage() {
  return (
    <>
      <ServiceLandingPage
        pageClassName="landing-page-bridal"
        kicker="Indian Bridal Makeup Toronto"
        title="Indian bridal makeup with a polished, elevated finish"
        intro="GlowWithVani creates bridal looks for Indian and South Asian weddings that balance skin, structure, and glam in a way that feels luxurious, camera-ready, and true to the bride."
        supportingCopy="From ceremony makeup to reception glam, each bridal look is tailored around outfit tones, jewelry, event timing, and the level of definition you want for your wedding celebrations."
        benefitsTitle="Designed For Indian Bridal Events"
        benefits={[
          "Looks tailored for bridal lehengas, sarees, jewelry, and multi-event wedding styling",
          "Complexion balancing and long-wear glam suited for photography, video, and extended celebrations",
          "Soft glam to fuller bridal glam based on your features, comfort, and event vision",
          "A luxury beauty experience that keeps the final look polished rather than heavy"
        ]}
        idealForTitle="Common Bookings"
        idealFor={[
          "Roka, engagement, sangeet, haldi, ceremony, reception, and bridal portraits",
          "Brides who want intentional glam that complements traditional and modern styling",
          "Clients looking for Toronto-based Indian bridal makeup with destination flexibility",
          "Brides who want a trial session before the wedding day"
        ]}
        coverageTitle="Toronto-based, serving the GTA and destination weddings"
        coverage={[
          "Available for Indian bridal bookings across Toronto and the GTA",
          "Suitable for single-event bridal bookings as well as multi-event wedding schedules",
          "Open to worldwide travel for destination weddings based on availability and event requirements"
        ]}
        ctaLabel="Request Bridal Booking"
        ctaHref="/contact"
        secondaryCtaLabel="View Portfolio"
        secondaryCtaHref="/portfolio"
      >
        <section className="section">
          <Reveal className="container">
            <article className="card landing-page-card bridal-story-card">
              <div>
                <p className="section-kicker">Bridal Direction</p>
                <h2 className="section-title">Rooted in bridal richness, finished with restraint</h2>
                <p className="section-copy">
                  The Indian bridal page uses warmer saffron, maroon, and muted gold accents so it feels connected to wedding styling without becoming loud or decorative for the sake of it.
                </p>
              </div>
              <div className="bridal-story-tags">
                <span>Haldi</span>
                <span>Sangeet</span>
                <span>Ceremony</span>
                <span>Reception</span>
              </div>
            </article>
          </Reveal>
        </section>

        <section className="section">
          <Reveal className="container">
            <SectionHeading
              kicker="Bridal Gallery"
              title="Placeholder bridal looks"
              copy="These are temporary placeholders for ceremony, reception, and bridal portrait styling until final bridal work is added."
            />
            <div className="bridal-placeholder-grid">
              {[
                { src: "/portfolio/bridal/bridal-1.jpg", alt: "Bridal ceremony placeholder", label: "Ceremony" },
                { src: "/portfolio/bridal/bridal-2.jpg", alt: "Bridal reception placeholder", label: "Reception" },
                { src: "/portfolio/bridal/bridal-3.jpg", alt: "Bridal portrait placeholder", label: "Portraits" }
              ].map((item) => (
                <article key={item.src} className="card bridal-placeholder-card">
                  <div className="bridal-placeholder-media">
                    <Image src={item.src} alt={item.alt} width={900} height={1200} className="bridal-placeholder-image" />
                  </div>
                  <div className="bridal-placeholder-meta">
                    <p>{item.label}</p>
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>
      </ServiceLandingPage>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Indian Bridal Makeup Toronto",
            serviceType: "Indian Bridal Makeup",
            provider: {
              "@type": "BeautySalon",
              name: "GlowWithVani",
              url: "https://glowwithvani.com"
            },
            areaServed: ["Toronto", "GTA", "Worldwide"],
            url: "https://glowwithvani.com/indian-bridal-makeup-toronto/"
          })
        }}
      />
    </>
  );
}

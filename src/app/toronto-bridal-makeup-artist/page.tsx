import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceLandingPage } from "@/components/ServiceLandingPage";

export const metadata: Metadata = {
  title: "Toronto Bridal Makeup Artist",
  description:
    "GlowWithVani is a Toronto bridal makeup artist offering polished, long-wear bridal glam across Toronto, the GTA, and destination weddings worldwide.",
  keywords: [
    "Toronto bridal makeup artist",
    "bridal makeup artist Toronto",
    "luxury bridal makeup Toronto",
    "wedding makeup artist Toronto",
    "bridal glam GTA",
    "destination wedding makeup artist Toronto"
  ],
  alternates: {
    canonical: "/toronto-bridal-makeup-artist/"
  }
};

export default function TorontoBridalMakeupArtistPage() {
  return (
    <>
      <ServiceLandingPage
        pageClassName="landing-page-bridal"
        kicker="Toronto Bridal Makeup Artist"
        title="Refined bridal makeup for Toronto weddings"
        intro="GlowWithVani provides bridal makeup artistry designed for long wear, soft definition, and a polished finish that photographs beautifully throughout your wedding day."
        supportingCopy="Based in Toronto and serving the GTA, GlowWithVani works with brides who want timeless glam, elevated skin, and a calm luxury experience from first inquiry to final touch-up."
        benefitsTitle="What Bridal Makeup Includes"
        benefits={[
          "Personalized bridal glam tailored to your dress, jewelry, and overall wedding aesthetic",
          "Skin-focused prep and complexion balancing for a smooth, luminous finish",
          "Long-wear makeup application built for ceremony, photography, and reception coverage",
          "A polished luxury approach that stays elegant in person and on camera"
        ]}
        idealForTitle="Ideal For"
        idealFor={[
          'Toronto brides looking for modern, timeless bridal makeup',
          "Civil ceremonies, receptions, engagement events, and full wedding-day glam",
          "Clients who want soft glam, fuller bridal glam, or a custom in-between finish",
          "Brides booking early and wanting a dependable artist for a premium beauty experience"
        ]}
        coverageTitle="Serving Toronto, the GTA, and destination weddings"
        coverage={[
          "Available across Toronto, Mississauga, Brampton, Vaughan, Markham, Scarborough, and the wider GTA",
          "Bridal trial sessions available in advance to finalize your wedding-day look",
          "Travel available for destination weddings worldwide based on schedule and booking scope"
        ]}
        ctaLabel="Request Bridal Booking"
        ctaHref="/contact"
        secondaryCtaLabel="View Portfolio"
        secondaryCtaHref="/portfolio"
        heroAside={
          <article className="card landing-page-hero-image-wrap">
            <Image
              src="/portfolio/bridal/bridal-2.jpg"
              alt="Bridal placeholder image for Toronto bridal makeup"
              width={900}
              height={1200}
              className="landing-page-hero-image"
              priority
            />
          </article>
        }
      >
        <section className="section">
          <Reveal className="container">
            <article className="card landing-page-card bridal-story-card">
              <div>
                <p className="section-kicker">Bridal Direction</p>
                <h2 className="section-title">Toronto bridal makeup with Indian bridal warmth</h2>
                <p className="section-copy">
                  This page now carries the same warmer Indian bridal cues as the dedicated Indian bridal page, so Toronto bridal visitors still see a richer wedding-focused presentation rather than a plain service layout.
                </p>
              </div>
              <div className="bridal-story-tags">
                <span>Ceremony</span>
                <span>Reception</span>
                <span>Portraits</span>
                <span>Destination</span>
              </div>
            </article>
          </Reveal>
        </section>

        <section className="section">
          <Reveal className="container">
            <SectionHeading
              kicker="Bridal Gallery"
              title="Placeholder bridal looks"
              copy="Temporary bridal placeholders are shown here until final Toronto bridal imagery is added."
            />
            <div className="bridal-placeholder-grid">
              {[
                { src: "/portfolio/bridal/bridal-1.jpg", alt: "Toronto bridal ceremony placeholder", label: "Ceremony" },
                { src: "/portfolio/bridal/bridal-2.jpg", alt: "Toronto bridal reception placeholder", label: "Reception" },
                { src: "/portfolio/bridal/bridal-3.jpg", alt: "Toronto bridal portrait placeholder", label: "Portraits" }
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
            name: "Toronto Bridal Makeup Artist",
            serviceType: "Bridal Makeup",
            provider: {
              "@type": "BeautySalon",
              name: "GlowWithVani",
              url: "https://glowwithvani.com"
            },
            areaServed: ["Toronto", "GTA", "Worldwide"],
            url: "https://glowwithvani.com/toronto-bridal-makeup-artist/"
          })
        }}
      />
    </>
  );
}

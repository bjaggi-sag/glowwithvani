import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { ServicesPricingSection } from "@/components/ServicesPricingSection";
import { InstagramIcon } from "@/components/InstagramIcon";
import { getPortfolioCategories, getPortfolioItems } from "@/data/portfolio";
import { services } from "@/data/services";

const processSteps = [
  "Share your event details and preferred look.",
  "Receive a personalized booking confirmation and prep notes.",
  "Glow-ready makeup session on your event day."
];

export const metadata: Metadata = {
  title: "Toronto Bridal Makeup Artist",
  description:
    "GlowWithVani is a Toronto-based luxury makeup artist serving the GTA for bridal makeup, event glam, editorial beauty, SFX looks, and destination weddings worldwide.",
  keywords: [
    "bridal makeup artist Toronto",
    "Toronto bridal makeup",
    "GTA makeup artist",
    "luxury makeup artist GTA",
    "destination wedding makeup artist",
    "event makeup Toronto",
    "editorial makeup artist Toronto",
    "GlowWithVani"
  ],
  alternates: {
    canonical: "/"
  }
};

export default function HomePage() {
  const portfolioItems = getPortfolioItems();
  const portfolioCategories = getPortfolioCategories();

  return (
    <main>
      <section className="hero section">
        <div className="container">
          <div className="hero-shell card">
            <div className="hero-logo-wrap" aria-hidden="true">
              <Image src="/brand/logo.png" alt="GlowWithVani brand mark" width={520} height={520} className="hero-logo" />
            </div>
            <div className="hero-copy-block">
              <p className="hero-tag">Toronto + GTA Makeup Artist</p>
              <h1 className="hero-brand-title">GlowWithVani</h1>
              <p className="hero-byline">By Gurvani Kaur</p>
              <p className="hero-summary">
                Toronto bridal makeup artist services for weddings, events, editorial photoshoots, and soft glam with a polished, camera-ready finish.
              </p>
              <p className="hero-credentials">Founder-led artistry with a polished, modern, and timeless finish.</p>
              <div className="hero-actions">
                <Link href="/contact" className="button">
                  Book Your Date
                </Link>
                <Link href="/portfolio" className="button secondary">
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="portfolio-preview">
        <div className="container">
          <SectionHeading
            kicker="Featured Work"
            title="Portfolio Preview"
            copy="A quick look across bridal, editorial, soft glam, and SFX styles."
          />
          <PortfolioGrid items={portfolioItems} categories={portfolioCategories} preview />
          <div className="section-cta">
            <Link href="/portfolio" className="button secondary">
              Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      <ServicesPricingSection />

      <section className="section" id="about">
        <div className="container split card about-card">
          <div>
            <SectionHeading
              kicker="About"
              title="Intentional beauty, elevated"
              copy="Every look begins with skin prep, tone balance, and feature-forward detailing so you feel refined in person and on camera."
            />
          </div>
          <div>
            <p className="section-kicker">Credentials</p>
            <ul className="clean-list">
              <li>CMU Student</li>
              <li>Toronto & GTA luxury makeup services for bridal, events, and photoshoots</li>
              <li>Open to travel worldwide for destination weddings</li>
            </ul>
            <div className="founder-block">
              <Image
                src="/brand/gurvani.png"
                alt="Gurvani Kaur, founder of GlowWithVani"
                width={180}
                height={180}
                className="founder-photo"
              />
              <div>
                <p className="founder-name">Gurvani Kaur</p>
                <p className="founder-role">Founder, GlowWithVani</p>
                <p className="founder-credential">Professionally trained by celebrity artist Sara Khan (India).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading kicker="How It Works" title="Simple booking process" />
          <ol className="steps">
            {processSteps.map((step) => (
              <li key={step} className="card">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section instagram">
        <div className="container card instagram-card">
          <SectionHeading
            kicker="Instagram"
            title="Follow the latest glam"
            copy="Fresh looks, behind-the-scenes moments, and client transformations."
          />
          <a
            href="https://instagram.com/GlowWithVanii"
            target="_blank"
            rel="noreferrer"
            className="button instagram-button-link"
          >
            <InstagramIcon className="instagram-icon" />
            <span>Visit GlowWithVanii</span>
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BeautySalon",
                "@id": "https://glowwithvani.com/#business",
                name: "GlowWithVani",
                url: "https://glowwithvani.com",
                image: "https://glowwithvani.com/icon.png",
                description:
                  "Toronto-based luxury makeup artist serving the GTA for bridal beauty, event glam, editorial shoots, and destination weddings.",
                areaServed: ["Toronto", "GTA", "Worldwide"],
                sameAs: ["https://instagram.com/GlowWithVanii"],
                brand: {
                  "@type": "Brand",
                  name: "GlowWithVani"
                }
              },
              {
                "@type": "Person",
                "@id": "https://glowwithvani.com/#gurvani-kaur",
                name: "Gurvani Kaur",
                jobTitle: "Makeup Artist",
                worksFor: {
                  "@id": "https://glowwithvani.com/#business"
                },
                sameAs: ["https://instagram.com/GlowWithVanii"]
              },
              {
                "@type": "OfferCatalog",
                "@id": "https://glowwithvani.com/#services",
                name: "GlowWithVani Makeup Services",
                itemListElement: services.map((service) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: service.title,
                    description: service.description,
                    provider: {
                      "@id": "https://glowwithvani.com/#business"
                    }
                  },
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    priceCurrency: "CAD",
                    price: service.startingPrice.replace(/[^0-9]/g, "")
                  }
                }))
              }
            ]
          })
        }}
      />
    </main>
  );
}

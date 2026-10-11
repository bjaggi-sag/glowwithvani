import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { ServicesPricingSection } from "@/components/ServicesPricingSection";
import { InstagramIcon } from "@/components/InstagramIcon";
import {
  getHomepagePortfolioItems,
  getPortfolioCategoriesForItems,
  getPortfolioItems,
} from "@/data/portfolio";
import { services } from "@/data/services";
import { Reveal } from "@/components/Reveal";
import { getWorkProjects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";

const processSteps = [
  "Share your brief, date, location, and creative direction.",
  "Discuss the look, scope of work, and a tailored quote.",
  "Bring the vision to life, on set or on your special day.",
];

export const metadata: Metadata = {
  title: "Toronto Makeup Artist | Editorial, Film & Bridal",
  description:
    "Makeup artistry by Gurvani Kaur in Toronto and the GTA. Explore editorial beauty, film and music video work, theatre, SFX, and refined bridal makeup.",
  keywords: [
    "Toronto makeup artist",
    "bridal makeup artist Toronto",
    "Toronto bridal makeup",
    "luxury makeup artist Toronto",
    "Toronto editorial makeup artist",
    "Toronto event makeup artist",
    "Toronto theatre makeup artist",
    "Toronto creative makeup artist",
    "GTA makeup artist",
    "destination wedding makeup artist",
    "GlowWithVani",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const featuredPortfolioItems = getHomepagePortfolioItems();
  const portfolioItems = getPortfolioItems();
  const portfolioCategories = getPortfolioCategoriesForItems(portfolioItems);

  const projects = getWorkProjects().filter((project) => project.featured);
  const heroPhoto =
    portfolioItems.find((photo) => photo.id === "editorial-4") ??
    portfolioItems[0];

  return (
    <main id="main-content">
      <section className="studio-hero container">
        <div className="studio-hero-copy">
          <p className="section-kicker">Gurvani Kaur / Toronto Makeup Artist</p>
          <h1>
            Makeup with
            <br />a <em>point of view.</em>
          </h1>
          <p className="studio-hero-description">
            From the subtle to the extraordinary. Considered makeup artistry for
            fashion, film, character, and life&apos;s defining moments.
          </p>
          <div className="hero-actions">
            <Link href="/portfolio" className="button button-solid">
              Explore the work <span aria-hidden="true">&#8599;</span>
            </Link>
            <Link href="/contact" className="text-link">
              Let&apos;s collaborate <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
          <div className="studio-signature">
            <span>GlowWithVani</span>
            <p>Beauty. Character. Possibility.</p>
          </div>
        </div>
        {heroPhoto && (
          <figure className="studio-hero-image">
            <Image
              src={heroPhoto.image}
              alt={heroPhoto.alt}
              width={1000}
              height={1250}
              priority
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{
                objectPosition: heroPhoto.objectPosition ?? "center 24%",
              }}
            />
            <figcaption>
              <span>Selected artistry</span>
              <span>Editorial / Beauty</span>
            </figcaption>
          </figure>
        )}
      </section>
      <nav
        className="discipline-index container"
        aria-label="Explore makeup disciplines"
      >
        <Link href="/portfolio?discipline=editorial">
          <span>Editorial & fashion</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        <Link href="/portfolio?discipline=screen">
          <span>Film & video</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        <Link href="/portfolio?discipline=character">
          <span>Theatre & SFX</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
        <Link href="/portfolio?discipline=beauty">
          <span>Bridal & beauty</span>
          <span aria-hidden="true">&#8599;</span>
        </Link>
      </nav>

      <section className="section" id="portfolio-preview">
        <div className="container selected-work">
          <SectionHeading
            kicker="Selected work"
            title="One artist. Many expressions."
            copy="Beauty with intention, characters with a story. Explore a selection across Gurvani’s practice, or find the work that speaks to your brief."
          />
          <PortfolioGrid
            items={portfolioItems}
            categories={portfolioCategories}
            preview
            featuredItems={featuredPortfolioItems}
            allHref="/portfolio"
          />
          <div className="section-cta">
            <Link href="/portfolio" className="button secondary">
              Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section screen-print-section" id="screen-print">
        <div className="container screen-print-layout">
          <div className="screen-print-intro">
            <SectionHeading
              kicker="Beyond the still"
              title="On screen. In print."
              copy="A closer look at the projects behind the artistry. Discover released videos, published stories, and Gurvani's role in each."
            />
            <Link href="/portfolio?format=video" className="text-link">
              Explore videos <span aria-hidden="true">&#8599;</span>
            </Link>
            <Link href="/portfolio?format=publication" className="text-link">
              Published editorials <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
          <div>
            {projects.length ? (
              projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))
            ) : (
              <p className="section-copy">
                Project stories will be shared here as approved work becomes
                available.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="productions">
        <div className="container production-note">
          <p className="section-kicker">For creative teams & productions</p>
          <h2>
            A shared vision.
            <br />
            <em>A considered finish.</em>
          </h2>
          <div>
            <p className="section-copy">
              Casting a creative team for a shoot, music video, film, or stage
              production? Find relevant work by discipline, then share your
              concept, schedule, and makeup requirements.
            </p>
            <Link
              href="/contact?type=production"
              className="button button-solid"
            >
              Send a project brief <span aria-hidden="true">&#8599;</span>
            </Link>
            <p className="production-smallprint">
              Project-specific quotes / Toronto & GTA
            </p>
          </div>
        </div>
      </section>

      <ServicesPricingSection />

      <section className="section" id="about">
        <Reveal className="container split card about-card">
          <div>
            <SectionHeading
              kicker="Meet the artist"
              title="Artistry without a single definition."
              copy="Every look begins with skin prep, tone balance, and feature-forward detailing so you feel refined in person and on camera."
            />
          </div>
          <div>
            <p className="section-kicker">Gurvani Kaur / GlowWithVani</p>
            <ul className="clean-list">
              <li>
                Makeup for editorial, film and video, theatre, SFX, bridal, and
                events
              </li>
              <li>Based in Toronto, working across the GTA</li>
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
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="container">
          <SectionHeading
            kicker="How It Works"
            title="From your vision to the final look"
          />
          <ol className="steps">
            {processSteps.map((step) => (
              <li key={step} className="card">
                {step}
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section className="section instagram">
        <Reveal className="container card instagram-card">
          <SectionHeading
            kicker="Instagram"
            title="The work, in the making."
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
        </Reveal>
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
                  "Toronto makeup artist for editorial, film, music videos, theatre, SFX, bridal beauty, and events.",
                areaServed: ["Toronto", "GTA", "Worldwide"],
                sameAs: ["https://instagram.com/GlowWithVanii"],
                brand: {
                  "@type": "Brand",
                  name: "GlowWithVani",
                },
              },
              {
                "@type": "Person",
                "@id": "https://glowwithvani.com/#gurvani-kaur",
                name: "Gurvani Kaur",
                jobTitle: "Makeup Artist",
                worksFor: {
                  "@id": "https://glowwithvani.com/#business",
                },
                sameAs: ["https://instagram.com/GlowWithVanii"],
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
                      "@id": "https://glowwithvani.com/#business",
                    },
                  },
                  priceSpecification: {
                    "@type": "PriceSpecification",
                    priceCurrency: "CAD",
                    price: service.startingPrice.replace(/[^0-9]/g, ""),
                  },
                })),
              },
            ],
          }),
        }}
      />
    </main>
  );
}

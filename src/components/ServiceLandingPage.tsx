import Link from "next/link";
import type { ReactNode } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

type ServiceLandingPageProps = {
  kicker: string;
  title: string;
  intro: string;
  supportingCopy: string;
  benefitsTitle: string;
  benefits: string[];
  idealForTitle: string;
  idealFor: string[];
  coverageTitle: string;
  coverage: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  pageClassName?: string;
  heroAside?: ReactNode;
  children?: ReactNode;
};

export function ServiceLandingPage({
  kicker,
  title,
  intro,
  supportingCopy,
  benefitsTitle,
  benefits,
  idealForTitle,
  idealFor,
  coverageTitle,
  coverage,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  pageClassName,
  heroAside,
  children
}: ServiceLandingPageProps) {
  return (
    <main className={pageClassName}>
      <section className="section landing-page-hero">
        <div className="container">
          <Reveal className="landing-page-shell card">
            <div>
              <p className="hero-tag">{kicker}</p>
              <h1 className="landing-page-title">{title}</h1>
              <p className="landing-page-intro">{intro}</p>
              <p className="landing-page-supporting">{supportingCopy}</p>
              <div className="hero-actions">
                <Link href={ctaHref} className="button">
                  {ctaLabel}
                </Link>
                {secondaryCtaLabel && secondaryCtaHref ? (
                  <Link href={secondaryCtaHref} className="button secondary">
                    {secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>
            {heroAside ? <div className="landing-page-hero-aside">{heroAside}</div> : null}
          </Reveal>
        </div>
      </section>

      {children}

      <section className="section">
        <Reveal className="container">
          <div className="landing-page-grid">
            <article className="card landing-page-card">
              <SectionHeading kicker="Service" title={benefitsTitle} />
              <ul className="clean-list landing-page-list">
                {benefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="card landing-page-card">
              <SectionHeading kicker="Best For" title={idealForTitle} />
              <ul className="clean-list landing-page-list">
                {idealFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </Reveal>
      </section>

      <section className="section">
        <Reveal className="container">
          <article className="card landing-page-card landing-page-coverage">
            <SectionHeading
              kicker="Coverage"
              title={coverageTitle}
              copy="GlowWithVani offers a polished, calm, and client-first booking experience from inquiry through event day."
            />
            <ul className="clean-list landing-page-list">
              {coverage.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="section-cta">
              <Link href={ctaHref} className="button">
                {ctaLabel}
              </Link>
            </div>
          </article>
        </Reveal>
      </section>
    </main>
  );
}

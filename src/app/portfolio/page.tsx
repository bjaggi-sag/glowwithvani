import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { WorkExplorer } from "@/components/WorkExplorer";
import { getPortfolioItems } from "@/data/portfolio";
import { getWorkProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "The Work | Editorial, Film, SFX & Bridal Portfolio",
  description:
    "Explore Gurvani Kaur's makeup portfolio by discipline: editorial and fashion, film and video, theatre and SFX, bridal and beauty. Watch videos and discover published editorials.",
  alternates: { canonical: "/portfolio/" },
};

export default function PortfolioPage() {
  const photos = getPortfolioItems();
  return (
    <main id="main-content" className="section work-page">
      <div className="container">
        <header className="work-page-heading">
          <div>
            <p className="section-kicker">The portfolio / Gurvani Kaur</p>
            <h1>
              The art of <em>transformation.</em>
            </h1>
          </div>
          <div>
            <p className="section-copy">
              Different stories. The same attention to detail. Find the work
              that fits your vision, from an editorial close-up to a character
              on screen.
            </p>
            <Link href="/contact?type=production" className="text-link">
              Have a brief? Let&apos;s talk{" "}
              <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </header>
        <Suspense
          fallback={
            <PortfolioGrid items={photos} categories={[]} hideFilters />
          }
        >
          <WorkExplorer photos={photos} projects={getWorkProjects()} />
        </Suspense>
      </div>
    </main>
  );
}

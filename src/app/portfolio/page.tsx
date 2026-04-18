import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getPortfolioCategories, getPortfolioItems } from "@/data/portfolio";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse GlowWithVani makeup portfolio featuring bridal makeup, editorial beauty, soft glam, SFX, and theatre looks in Toronto and the GTA.",
  keywords: [
    "makeup artist portfolio Toronto",
    "bridal makeup portfolio Toronto",
    "editorial makeup portfolio",
    "soft glam makeup portfolio",
    "SFX makeup portfolio",
    "theatre makeup portfolio"
  ],
  alternates: {
    canonical: "/portfolio/"
  }
};

export default function PortfolioPage() {
  const portfolioItems = getPortfolioItems();
  const portfolioCategories = getPortfolioCategories();

  return (
    <main className="section">
      <Reveal className="container" threshold={0.01} rootMargin="22% 0px -4% 0px">
        <SectionHeading
          kicker="Portfolio"
          title="Curated makeup looks"
          copy="Use filters to browse by style category."
        />
        <PortfolioGrid items={portfolioItems} categories={portfolioCategories} />
      </Reveal>
    </main>
  );
}

import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PortfolioGrid } from "@/components/PortfolioGrid";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Bridal, editorial, soft glam, and SFX makeup portfolio by GlowWithVani.",
  alternates: {
    canonical: "/portfolio/"
  }
};

export default function PortfolioPage() {
  return (
    <main className="section">
      <div className="container">
        <SectionHeading
          kicker="Portfolio"
          title="Curated makeup looks"
          copy="Use filters to browse by style category."
        />
        <PortfolioGrid />
      </div>
    </main>
  );
}

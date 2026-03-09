"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { portfolioCategories, portfolioItems, type PortfolioCategory } from "@/data/portfolio";

type FilterKey = "All" | PortfolioCategory;

export function PortfolioGrid({ preview = false }: { preview?: boolean }) {
  const [active, setActive] = useState<FilterKey>("All");

  const filtered = useMemo(() => {
    const items = active === "All" ? portfolioItems : portfolioItems.filter((item) => item.category === active);
    return preview ? items.slice(0, 4) : items;
  }, [active, preview]);

  return (
    <div>
      <div className="filters" role="tablist" aria-label="Portfolio categories">
        {portfolioCategories.map((category) => {
          const isActive = active === category;
          return (
            <button
              key={category}
              type="button"
              className={`pill ${isActive ? "active" : ""}`}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          );
        })}
      </div>
      <div className="portfolio-grid">
        {filtered.map((item) => (
          <article key={item.id} className="portfolio-card card">
            <Image src={item.image} alt={item.alt} width={900} height={1100} />
            <div className="portfolio-meta">
              <p>{item.category}</p>
              <h3>{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

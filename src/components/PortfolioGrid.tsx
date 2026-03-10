"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { PortfolioCategory, PortfolioItem } from "@/data/portfolio";

type FilterKey = "All" | PortfolioCategory;

export function PortfolioGrid({
  items,
  categories,
  preview = false
}: {
  items: PortfolioItem[];
  categories: FilterKey[];
  preview?: boolean;
}) {
  const [active, setActive] = useState<FilterKey>("All");

  const filtered = useMemo(() => {
    const visibleItems = active === "All" ? items : items.filter((item) => item.category === active);
    return preview ? visibleItems.slice(0, 4) : visibleItems;
  }, [active, items, preview]);

  return (
    <div>
      <div className="filters" role="tablist" aria-label="Portfolio categories">
        {categories.map((category) => {
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
            <div className="portfolio-media">
              <Image
                src={item.image}
                alt={item.alt}
                width={900}
                height={1100}
                className="portfolio-image"
                style={{ objectPosition: item.objectPosition ?? "center" }}
              />
            </div>
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

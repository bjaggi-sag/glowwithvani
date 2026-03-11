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
        {filtered.map((item, index) => (
          <article key={item.id} className="portfolio-card card">
            <div className="portfolio-media">
              <Image
                src={item.image}
                alt={item.alt}
                width={900}
                height={1100}
                quality={92}
                sizes={preview ? "(max-width: 767px) 100vw, 50vw" : "(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                priority={index < (preview ? 2 : 1)}
                className="portfolio-image"
                style={{ objectPosition: item.objectPosition ?? "center" }}
              />
            </div>
            <div className="portfolio-meta">
              <p>{item.category}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

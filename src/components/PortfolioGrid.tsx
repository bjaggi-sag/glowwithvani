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
    if (active === "All") {
      if (!preview) {
        return items;
      }

      const previewCategories = categories.filter((category): category is PortfolioCategory => category !== "All");
      const pickedIds = new Set<string>();

      return previewCategories
        .map((category) => {
          const primaryMatch = items.find((item) => !pickedIds.has(item.id) && item.primaryTag === category);
          const fallbackMatch = items.find((item) => !pickedIds.has(item.id) && item.displayTags.includes(category));
          const selected = primaryMatch ?? fallbackMatch;

          if (selected) {
            pickedIds.add(selected.id);
          }

          return selected ?? null;
        })
        .filter((item): item is PortfolioItem => item !== null);
    }

    return items.filter((item) => item.displayTags.includes(active));
  }, [active, categories, items, preview]);

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
                priority={preview || index < 1}
                className="portfolio-image"
                style={{ objectPosition: item.objectPosition ?? "center" }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

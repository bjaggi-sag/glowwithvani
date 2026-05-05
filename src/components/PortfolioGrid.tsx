"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import type { PortfolioCategory, PortfolioItem } from "@/data/portfolio";

type FilterKey = "All" | PortfolioCategory;

export function PortfolioGrid({
  items,
  categories,
  preview = false,
  featuredItems,
  allHref
}: {
  items: PortfolioItem[];
  categories: FilterKey[];
  preview?: boolean;
  featuredItems?: PortfolioItem[];
  allHref?: string;
}) {
  const [active, setActive] = useState<FilterKey>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    if (active === "All") {
      return featuredItems ?? items;
    }

    return items.filter((item) => item.displayTags.includes(active));
  }, [active, featuredItems, items]);

  const lightboxItem = lightboxIndex === null ? null : filtered[lightboxIndex] ?? null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (lightboxItem === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => {
          if (current === null || filtered.length === 0) {
            return current;
          }

          return (current + 1) % filtered.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => {
          if (current === null || filtered.length === 0) {
            return current;
          }

          return (current - 1 + filtered.length) % filtered.length;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      lightboxRef.current?.scrollTo({ top: 0, behavior: "auto" });
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtered, lightboxItem]);

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function showPrevious() {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (current - 1 + filtered.length) % filtered.length;
    });
  }

  function showNext() {
    setLightboxIndex((current) => {
      if (current === null || filtered.length === 0) {
        return current;
      }

      return (current + 1) % filtered.length;
    });
  }

  return (
    <div>
      <div className="filters" aria-label="Portfolio categories">
        {categories.map((category) => {
          const isActive = active === category;
          if (category === "All" && allHref) {
            return (
              <Link key={category} href={allHref} className={`pill ${isActive ? "active" : ""}`}>
                {category}
              </Link>
            );
          }

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
            <button type="button" className="portfolio-media-button" onClick={() => openLightbox(index)} aria-label={`Open ${item.alt}`}>
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
            </button>
          </article>
        ))}
      </div>

      {isMounted && lightboxItem
        ? createPortal(
            <div
              ref={lightboxRef}
              className="portfolio-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio image viewer"
              onClick={closeLightbox}
            >
              <div className="portfolio-lightbox-shell" onClick={(event) => event.stopPropagation()}>
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="portfolio-lightbox-close"
                  onClick={closeLightbox}
                  aria-label="Close image viewer"
                >
                  Close
                </button>
                <button type="button" className="portfolio-lightbox-nav prev" onClick={showPrevious} aria-label="Previous image">
                  Previous
                </button>
                <div className="portfolio-lightbox-media">
                  <Image
                    src={lightboxItem.image}
                    alt={lightboxItem.alt}
                    width={1400}
                    height={1700}
                    quality={96}
                    sizes="100vw"
                    className="portfolio-lightbox-image"
                    style={{ objectPosition: lightboxItem.objectPosition ?? "center" }}
                  />
                  <p className="portfolio-lightbox-caption">{lightboxItem.alt}</p>
                </div>
                <button type="button" className="portfolio-lightbox-nav next" onClick={showNext} aria-label="Next image">
                  Next
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

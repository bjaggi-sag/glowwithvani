"use client";

import { useState } from "react";
import Image from "next/image";
import type { WorkProject } from "@/data/work";

export function PublicationReader({
  title,
  pages,
}: {
  title: string;
  pages: WorkProject["pages"];
}) {
  const [active, setActive] = useState(0);
  const page = pages[active];
  if (!page) return null;
  return (
    <section
      className="publication-reader"
      aria-label={`${title} published pages`}
    >
      <div className="publication-reader-controls">
        <button
          className="button"
          type="button"
          disabled={active === 0}
          onClick={() => setActive(active - 1)}
          aria-label="Previous publication page"
        >
          Previous
        </button>
        <span role="status" aria-live="polite">
          {active + 1} / {pages.length}
        </span>
        <button
          className="button"
          type="button"
          disabled={active === pages.length - 1}
          onClick={() => setActive(active + 1)}
          aria-label="Next publication page"
        >
          Next
        </button>
      </div>
      <a
        className="publication-reader-page"
        href={page.image}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size page ${active + 1} in a new tab`}
      >
        <Image
          key={page.image}
          src={page.image}
          alt={page.alt}
          width={1200}
          height={1600}
          sizes="(max-width: 767px) 90vw, 820px"
          loading="eager"
        />
      </a>
      <p className="publication-reader-caption">{page.alt}</p>
      <a
        className="text-link"
        href={page.image}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open full-size page <span aria-hidden="true">&#8599;</span>
      </a>
    </section>
  );
}

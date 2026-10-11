"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  disciplines,
  formats,
  matchesDiscipline,
  type WorkFormat,
  type WorkProject,
} from "@/data/work";
import type { PortfolioItem } from "@/data/portfolio";
import { PortfolioGrid } from "./PortfolioGrid";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";

type FilterState = {
  discipline: string;
  format: WorkFormat;
  query: string;
  project: string;
};
const defaults: FilterState = {
  discipline: "all",
  format: "all",
  query: "",
  project: "",
};

function fromSearch(search: string): FilterState {
  const params = new URLSearchParams(search);
  const discipline = params.get("discipline") ?? "all";
  const format = params.get("format") ?? "all";
  return {
    discipline: disciplines.some((d) => d.id === discipline)
      ? discipline
      : "all",
    format: formats.some((f) => f.id === format)
      ? (format as WorkFormat)
      : "all",
    query: params.get("q") ?? "",
    project: params.get("project") ?? "",
  };
}

export function WorkExplorer({
  photos,
  projects,
}: {
  photos: PortfolioItem[];
  projects: WorkProject[];
}) {
  const search = useSearchParams().toString();
  const [filters, setFilters] = useState<FilterState>(defaults);
  useEffect(() => {
    setFilters(fromSearch(search));
  }, [search]);

  function update(patch: Partial<FilterState>, replace = false) {
    const next = { ...filters, ...patch };
    const url = new URL(window.location.href);
    for (const [key, value] of Object.entries({
      discipline: next.discipline,
      format: next.format,
      q: next.query,
      project: next.project,
    })) {
      if (value && value !== "all") url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history[replace ? "replaceState" : "pushState"](null, "", url);
    setFilters(next);
  }

  const results = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const matchingPhotos =
      filters.format === "all" || filters.format === "photos"
        ? photos.filter(
            (photo) =>
              matchesDiscipline(photo.displayTags, filters.discipline) &&
              [
                photo.title,
                photo.alt,
                ...photo.displayTags,
                ...photo.internalTags,
              ]
                .join(" ")
                .toLowerCase()
                .includes(query),
          )
        : [];
    const matchingProjects =
      filters.format !== "photos"
        ? projects.filter(
            (project) =>
              (filters.format === "all" || project.format === filters.format) &&
              (filters.discipline === "all" ||
                project.disciplines.some((d) => d === filters.discipline)) &&
              [
                project.title,
                project.role,
                project.description,
                project.client,
                project.publication,
                ...project.credits.map((c) => c.name),
              ]
                .join(" ")
                .toLowerCase()
                .includes(query),
          )
        : [];
    return { photos: matchingPhotos, projects: matchingProjects };
  }, [filters, photos, projects]);
  const total = results.photos.length + results.projects.length;
  const selectedProject = projects.find(
    (project) => project.slug === filters.project,
  );

  return (
    <div className="work-explorer">
      <div className="work-controls">
        <div
          className="work-discipline-filters"
          role="group"
          aria-label="Filter work by discipline"
        >
          {disciplines.map((d) => (
            <button
              type="button"
              className={`work-filter ${filters.discipline === d.id ? "selected" : ""}`}
              key={d.id}
              aria-pressed={filters.discipline === d.id}
              onClick={() => update({ discipline: d.id })}
            >
              {d.label}
            </button>
          ))}
        </div>
        <div className="work-controls-bottom">
          <div
            className="work-format-filters"
            role="group"
            aria-label="Filter work by format"
          >
            {formats.map((f) => (
              <button
                type="button"
                key={f.id}
                aria-pressed={filters.format === f.id}
                onClick={() => update({ format: f.id })}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="work-search">
            <span className="sr-only">
              Search work, publication or technique
            </span>
            <input
              type="search"
              placeholder="Search work or technique"
              value={filters.query}
              onChange={(event) => update({ query: event.target.value }, true)}
            />
          </label>
        </div>
      </div>
      <div className="work-result-line">
        <p role="status">
          {total} {total === 1 ? "result" : "results"}
          {filters.discipline !== "all"
            ? ` / ${disciplines.find((d) => d.id === filters.discipline)?.label}`
            : " / Explore the range"}
        </p>
        {(filters.discipline !== "all" ||
          filters.format !== "all" ||
          filters.query) && (
          <button
            className="text-link"
            type="button"
            onClick={() => update(defaults)}
          >
            Clear filters
          </button>
        )}
      </div>
      {results.projects.length > 0 && (
        <section
          aria-label="Projects and publications"
          className="project-grid"
        >
          {results.projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onOpen={() => update({ project: project.slug })}
            />
          ))}
        </section>
      )}
      {results.photos.length > 0 && (
        <PortfolioGrid
          key={`${filters.discipline}-${filters.query}`}
          items={results.photos}
          categories={[]}
          hideFilters
        />
      )}
      {total === 0 && (
        <div className="work-empty">
          <p className="section-kicker">Let&apos;s find the right reference</p>
          <h2>
            {filters.query
              ? "No matching work."
              : "Looking for something specific?"}
          </h2>
          <p>
            Try another selection, or share your brief with Gurvani to request
            work relevant to your project.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="button"
              onClick={() => update(defaults)}
            >
              Explore all work
            </button>
            <Link
              className="button button-solid"
              href="/contact?type=production"
            >
              Request relevant work
            </Link>
          </div>
        </div>
      )}
      {filters.project && !selectedProject && (
        <p className="status" role="status">
          This project is not currently available.{" "}
          <button
            className="text-link"
            onClick={() => update({ project: "" }, true)}
          >
            Dismiss
          </button>
        </p>
      )}
      {selectedProject && (
        <ProjectDialog
          key={selectedProject.slug}
          project={selectedProject}
          photos={selectedProject.portfolioIds.flatMap(
            (id) => photos.find((photo) => photo.id === id) ?? [],
          )}
          onClose={() => update({ project: "" }, true)}
        />
      )}
    </div>
  );
}

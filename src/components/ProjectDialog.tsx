"use client";

import { ArrowIcon } from "@/components/ArrowIcon";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { WorkProject } from "@/data/work";
import type { PortfolioItem } from "@/data/portfolio";
import { YouTubePlayer } from "./YouTubePlayer";
import { PublicationReader } from "./PublicationReader";

export function ProjectDialog({
  project,
  photos,
  onClose,
}: {
  project: WorkProject;
  photos: PortfolioItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    const previous = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previous;
      if (trigger instanceof HTMLElement && trigger.isConnected)
        trigger.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="project-dialog"
      aria-labelledby="project-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-dialog-inner">
        <div className="project-dialog-top">
          <p className="section-kicker">
            {project.format === "video" ? "On screen" : "In print"}
          </p>
          <button className="button" onClick={onClose} autoFocus>
            Close project
          </button>
        </div>
        <h2 id="project-title">{project.title}</h2>
        <p className="project-byline">
          {[project.publication ?? project.client, project.issue, project.year]
            .filter(Boolean)
            .join(" / ")}
        </p>
        {project.releaseStatus === "upcoming" && (
          <p className="project-release-note">
            Upcoming project. Release details will be shared when available.
          </p>
        )}
        {project.format === "video" && project.url ? (
          <YouTubePlayer
            url={project.url}
            title={project.title}
            poster={project.coverImage}
          />
        ) : project.format === "publication" &&
          (project.coverImage || project.pages.length > 0) ? (
          <PublicationReader
            title={project.title}
            pages={[
              ...(project.coverImage
                ? [
                    {
                      image: project.coverImage,
                      alt: project.coverAlt ?? project.title,
                    },
                  ]
                : []),
              ...project.pages,
            ]}
          />
        ) : project.coverImage ? (
          <Image
            className="publication-cover"
            src={project.coverImage}
            alt={project.coverAlt ?? project.title}
            width={1200}
            height={1600}
            sizes="(max-width: 767px) 90vw, 720px"
          />
        ) : null}
        <div className="project-detail-grid">
          <div>
            <p className="section-kicker">The work</p>
            <p className="section-copy">{project.description}</p>
            {project.url && (
              <a
                href={project.url}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.format === "video"
                  ? "Watch on YouTube"
                  : "View publication"}{" "}
                <ArrowIcon />
              </a>
            )}
          </div>
          <div>
            <p className="section-kicker">Credits</p>
            <dl className="project-credits">
              <div>
                <dt>{project.role}</dt>
                <dd>Gurvani Kaur</dd>
              </div>
              {project.credits.map((credit, index) => (
                <div key={`${credit.role}-${index}`}>
                  <dt>{credit.role}</dt>
                  <dd>{credit.name}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {photos.length > 0 && (
          <div className="project-stills">
            {photos.map((photo) => (
              <Image
                key={photo.id}
                src={photo.image}
                alt={photo.alt}
                width={900}
                height={1200}
                sizes="(max-width: 767px) 90vw, 45vw"
              />
            ))}
          </div>
        )}
        <Link className="button button-solid" href="/contact?type=production">
          Discuss a similar project <ArrowIcon />
        </Link>
      </div>
    </dialog>
  );
}

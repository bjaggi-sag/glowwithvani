import Image from "next/image";
import Link from "next/link";
import type { WorkProject } from "@/data/work";

export function ProjectCard({
  project,
  onOpen,
}: {
  project: WorkProject;
  onOpen?: () => void;
}) {
  return (
    <article className={`project-card project-card-${project.format}`}>
      <Link
        href={`/portfolio?project=${encodeURIComponent(project.slug)}`}
        className="project-card-link"
        onClick={
          onOpen
            ? (event) => {
                if (
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey &&
                  event.button === 0
                ) {
                  event.preventDefault();
                  onOpen();
                }
              }
            : undefined
        }
      >
        <div className="project-card-art">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.coverAlt ?? project.title}
              width={960}
              height={720}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          ) : (
            <div className="project-card-lettering" aria-hidden="true">
              {project.format === "video"
                ? project.releaseStatus === "upcoming"
                  ? "Coming soon"
                  : "In motion."
                : project.publication}
            </div>
          )}
          <span className="project-format">
            {project.releaseStatus === "upcoming"
              ? "Upcoming"
              : project.format === "video"
                ? "Film & video"
                : "Published editorial"}
          </span>
          <span className="project-card-arrow" aria-hidden="true">
            &#8599;
          </span>
        </div>
        <div className="project-card-copy">
          <p className="section-kicker">
            {[project.publication ?? project.client, project.year]
              .filter(Boolean)
              .join(" / ")}
          </p>
          <h3>{project.title}</h3>
          <p>
            {project.role} <span aria-hidden="true">/</span> Gurvani Kaur
          </p>
          <span className="text-link">
            View project & credits <span aria-hidden="true">&#8599;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

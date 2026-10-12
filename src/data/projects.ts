import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseProject, type WorkProject } from "./work";
import { getPortfolioItems } from "./portfolio";

export function getWorkProjects(): WorkProject[] {
  const directory = path.join(process.cwd(), "content/projects");
  if (!existsSync(directory)) return [];
  const photoIds = new Set(getPortfolioItems().map((item) => item.id));
  const slugs = new Set<string>();
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      const record = JSON.parse(
        readFileSync(path.join(directory, file), "utf8"),
      );
      if (record.published === false || record.published === undefined)
        return [];
      const project = parseProject(record, file);
      if (slugs.has(project.slug))
        throw new Error(`Duplicate project slug: ${project.slug}`);
      slugs.add(project.slug);
      for (const id of project.portfolioIds) {
        if (!photoIds.has(id))
          throw new Error(`${file}: unknown portfolio image ${id}`);
      }
      if (project.coverImage) {
        if (!existsSync(path.join(process.cwd(), "public", project.coverImage)))
          throw new Error(`${file}: cover image is missing`);
        project.coverImage = `/projects/optimized/${project.slug}.webp`;
      }
      project.pages = project.pages.map((page, index) => {
        if (!existsSync(path.join(process.cwd(), "public", page.image)))
          throw new Error(`${file}: publication page ${index + 1} is missing`);
        return {
          ...page,
          image: `/projects/optimized/${project.slug}-page-${index + 1}.webp`,
        };
      });
      return [project];
    })
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title),
    );
}

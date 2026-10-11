export const disciplines = [
  { id: "all", label: "All disciplines" },
  { id: "editorial", label: "Editorial & fashion" },
  { id: "screen", label: "Film & video" },
  { id: "character", label: "Theatre & SFX" },
  { id: "beauty", label: "Bridal & beauty" },
] as const;

export type Discipline = Exclude<(typeof disciplines)[number]["id"], "all">;
export const formats = [
  { id: "all", label: "All work" },
  { id: "photos", label: "Photography" },
  { id: "video", label: "Videos" },
  { id: "publication", label: "Published editorials" },
] as const;
export type WorkFormat = (typeof formats)[number]["id"];

export type WorkProject = {
  slug: string;
  title: string;
  format: "video" | "publication";
  disciplines: Discipline[];
  role: string;
  description: string;
  client?: string;
  publication?: string;
  issue?: string;
  year?: string;
  url?: string;
  releaseStatus: "released" | "upcoming";
  coverImage?: string;
  coverAlt?: string;
  credits: { role: string; name: string }[];
  portfolioIds: string[];
  sortOrder: number;
  featured: boolean;
  published: boolean;
};

export function getYouTubeId(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return null;
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else
        id =
          url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/)?.[1] ??
          null;
    }
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function isPublicHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function matchesDiscipline(
  tags: readonly string[],
  discipline: string,
): boolean {
  if (discipline === "all") return true;
  const matches: Record<string, readonly string[]> = {
    editorial: ["Editorial"],
    screen: ["Film & Video"],
    character: ["Theatre", "SFX", "Prosthetics", "Creature"],
    beauty: ["Bridal", "Reception", "Soft Glam"],
  };
  return (matches[discipline] ?? []).some((tag) => tags.includes(tag));
}

// Fail a build on invalid published credits instead of silently dropping a project.
export function parseProject(input: unknown, source: string): WorkProject {
  const fail = (field: string): never => {
    throw new Error(`${source}: invalid or missing ${field}`);
  };
  if (!input || typeof input !== "object" || Array.isArray(input))
    return fail("project");
  const record = input as Record<string, unknown>;
  const required = (key: string) =>
    typeof record[key] === "string" && record[key].trim()
      ? (record[key] as string).trim()
      : fail(key);
  const optional = (key: string) =>
    record[key] == null || record[key] === "" ? undefined : required(key);
  const slug = required("slug");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("slug (use kebab-case)");
  const format = record.format;
  if (format !== "video" && format !== "publication") return fail("format");
  const releaseStatus = record.releaseStatus ?? "released";
  if (releaseStatus !== "released" && releaseStatus !== "upcoming")
    return fail("releaseStatus");
  const url = optional("url");
  if (
    url &&
    (!isPublicHttpsUrl(url) || (format === "video" && !getYouTubeId(url)))
  )
    fail("HTTPS project URL");
  if (format === "video" && releaseStatus === "released" && !url)
    fail("YouTube URL for released video");
  const selected = record.disciplines;
  if (
    !Array.isArray(selected) ||
    !selected.length ||
    selected.some(
      (value) => !disciplines.some((d) => d.id !== "all" && d.id === value),
    )
  )
    fail("disciplines");
  const coverImage = optional("coverImage");
  if (
    coverImage &&
    (!/^\/portfolio\/originals\/[a-zA-Z0-9_./ -]+\.(png|jpe?g|webp)$/i.test(
      coverImage,
    ) ||
      coverImage.includes(".."))
  )
    fail("coverImage (local image in /portfolio/originals/)");
  const coverAlt = optional("coverAlt");
  if (coverImage && !coverAlt) fail("coverAlt");
  const publication = optional("publication");
  if (format === "publication" && !publication) fail("publication");
  const credits = record.credits ?? [];
  if (
    !Array.isArray(credits) ||
    credits.some(
      (c) =>
        !c ||
        typeof c.role !== "string" ||
        !c.role.trim() ||
        typeof c.name !== "string" ||
        !c.name.trim(),
    )
  )
    fail("credits");
  const portfolioIds = record.portfolioIds ?? [];
  if (
    !Array.isArray(portfolioIds) ||
    portfolioIds.some((id) => typeof id !== "string")
  )
    fail("portfolioIds");
  if (
    format === "publication" &&
    releaseStatus === "released" &&
    !url &&
    !coverImage &&
    !(portfolioIds as string[]).length
  )
    fail("publication image or link");
  for (const field of ["published", "featured"]) {
    if (record[field] !== undefined && typeof record[field] !== "boolean")
      fail(field);
  }
  if (
    record.sortOrder !== undefined &&
    (typeof record.sortOrder !== "number" || !Number.isFinite(record.sortOrder))
  )
    fail("sortOrder");
  return {
    slug,
    title: required("title"),
    format,
    url,
    releaseStatus,
    disciplines: selected as Discipline[],
    role: required("role"),
    description: required("description"),
    client: optional("client"),
    publication,
    issue: optional("issue"),
    year: optional("year"),
    coverImage,
    coverAlt,
    credits: credits as WorkProject["credits"],
    portfolioIds: portfolioIds as string[],
    sortOrder: (record.sortOrder as number | undefined) ?? 100,
    featured: record.featured === true,
    published: record.published === true,
  };
}

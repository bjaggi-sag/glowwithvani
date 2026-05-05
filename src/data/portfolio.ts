import { readdirSync, readFileSync } from "fs";
import path from "path";

const visiblePortfolioTags = ["Bridal", "Reception", "Soft Glam", "Editorial", "Theatre", "Prosthetics", "SFX", "Creature"] as const;

export type PortfolioCategory = (typeof visiblePortfolioTags)[number];
export type PortfolioInternalTag = string;

type PortfolioEntryRecord = {
  slug: string;
  title: string;
  sourceImage: string;
  alt: string;
  displayTags: PortfolioCategory[];
  internalTags?: PortfolioInternalTag[];
  primaryTag: PortfolioCategory;
  objectPosition?: string;
  sortOrder: number;
};

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
  displayTags: PortfolioCategory[];
  internalTags: PortfolioInternalTag[];
  primaryTag: PortfolioCategory;
  objectPosition?: string;
  sortOrder: number;
  sourceImage: string;
};

function getPortfolioContentDirectory() {
  return path.join(process.cwd(), "content", "portfolio");
}

function getOptimizedImagePath(slug: string) {
  return `/portfolio/optimized/${slug}.webp`;
}

function compareItems(left: PortfolioItem, right: PortfolioItem) {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  return left.title.localeCompare(right.title, undefined, { numeric: true, sensitivity: "base" });
}

function readPortfolioEntries(): PortfolioItem[] {
  const contentDirectory = getPortfolioContentDirectory();

  try {
    return readdirSync(contentDirectory)
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) => {
        const filePath = path.join(contentDirectory, fileName);
        const record = JSON.parse(readFileSync(filePath, "utf8")) as PortfolioEntryRecord;

        return {
          id: record.slug,
          title: record.title,
          image: getOptimizedImagePath(record.slug),
          alt: record.alt,
          displayTags: record.displayTags,
          internalTags: record.internalTags ?? [],
          primaryTag: record.primaryTag,
          objectPosition: record.objectPosition,
          sortOrder: record.sortOrder,
          sourceImage: record.sourceImage
        } satisfies PortfolioItem;
      })
      .sort(compareItems);
  } catch {
    return [];
  }
}

export function getPortfolioItems(): PortfolioItem[] {
  return readPortfolioEntries();
}

export function getPortfolioCategories(): ("All" | PortfolioCategory)[] {
  const availableTags = new Set<PortfolioCategory>();

  for (const item of readPortfolioEntries()) {
    for (const tag of item.displayTags) {
      if (visiblePortfolioTags.includes(tag)) {
        availableTags.add(tag);
      }
    }
  }

  return ["All", ...visiblePortfolioTags.filter((tag) => availableTags.has(tag))];
}

import { readdirSync, readFileSync } from "fs";
import path from "path";

const visiblePortfolioTags = ["Bridal", "Reception", "Soft Glam", "Editorial", "Theatre", "Prosthetics", "SFX", "Creature"] as const;
const balancedAllFeedOrder: PortfolioCategory[] = ["Editorial", "Theatre", "SFX", "Bridal", "Reception", "Prosthetics", "Creature"];

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
  homepageFeature?: boolean;
  homepageOrder?: number;
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
  homepageFeature: boolean;
  homepageOrder?: number;
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

function compareHomepageItems(left: PortfolioItem, right: PortfolioItem) {
  const leftOrder = left.homepageOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.homepageOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return compareItems(left, right);
}

function balancePortfolioItems(items: PortfolioItem[], categoryOrder: PortfolioCategory[] = balancedAllFeedOrder): PortfolioItem[] {
  const queues = new Map<PortfolioCategory, PortfolioItem[]>();
  const balancedItems: PortfolioItem[] = [];

  for (const category of categoryOrder) {
    queues.set(category, []);
  }

  for (const item of items) {
    const queue = queues.get(item.primaryTag);

    if (queue) {
      queue.push(item);
      continue;
    }

    balancedItems.push(item);
  }

  let appended = true;

  while (appended) {
    appended = false;

    for (const category of categoryOrder) {
      const queue = queues.get(category);
      const nextItem = queue?.shift();

      if (!nextItem) {
        continue;
      }

      balancedItems.push(nextItem);
      appended = true;
    }
  }

  return balancedItems;
}

function readPortfolioEntriesSorted(): PortfolioItem[] {
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
          sourceImage: record.sourceImage,
          homepageFeature: record.homepageFeature ?? false,
          homepageOrder: record.homepageOrder
        } satisfies PortfolioItem;
      })
      .sort(compareItems);
  } catch {
    return [];
  }
}

export function getPortfolioItems(): PortfolioItem[] {
  return balancePortfolioItems(readPortfolioEntriesSorted());
}

export function getHomepagePortfolioItems(): PortfolioItem[] {
  const items = readPortfolioEntriesSorted();
  const featuredItems = items.filter((item) => item.homepageFeature).sort(compareHomepageItems);

  if (featuredItems.length > 0) {
    return balancePortfolioItems(featuredItems);
  }

  const previewCategoryOrder: PortfolioCategory[] = ["Bridal", "Reception", "Editorial", "Theatre", "Prosthetics", "SFX", "Creature"];
  const pickedIds = new Set<string>();

  return previewCategoryOrder
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

export function getPortfolioCategories(): ("All" | PortfolioCategory)[] {
  return getPortfolioCategoriesForItems(readPortfolioEntriesSorted());
}

export function getPortfolioCategoriesForItems(items: PortfolioItem[]): ("All" | PortfolioCategory)[] {
  const availableTags = new Set<PortfolioCategory>();

  for (const item of items) {
    for (const tag of item.displayTags) {
      if (visiblePortfolioTags.includes(tag)) {
        availableTags.add(tag);
      }
    }
  }

  return ["All", ...visiblePortfolioTags.filter((tag) => availableTags.has(tag))];
}

import { readdirSync, statSync } from "fs";
import path from "path";
export type PortfolioCategory = string;

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  alt: string;
  objectPosition?: string;
};

const supportedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"] as const;
const extensionPriority = [".webp", ".jpg", ".jpeg", ".png"] as const;
const preferredCategoryOrder = ["bridal", "editorial", "soft-glam", "theatre", "sfx"] as const;
const categoryDisplayNames: Record<string, string> = {
  sfx: "SFX"
};
const portfolioObjectPositions: Record<string, string> = {
  "editorial/editorial-1": "center 22%",
  "editorial/editorial-2": "center 18%",
  "editorial/editorial-3": "center center",
  "editorial/editorial4": "center center",
  "theatre/theatre-2": "68% center"
};
const portfolioItemOrder: Record<string, number> = {
  "editorial/editorial-1": 1,
  "editorial/editorial-2": 2,
  "editorial/editorial-3": 3,
  "theatre/theare-1": 1,
  "theatre/theatre-2": 2
};

function toTitleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function compareNaturally(left: string, right: string) {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

function getCategoryLabel(folder: string) {
  return categoryDisplayNames[folder] ?? toTitleCase(folder);
}

function compareCategoryFolders(left: string, right: string) {
  const leftOrder = preferredCategoryOrder.indexOf(left as (typeof preferredCategoryOrder)[number]);
  const rightOrder = preferredCategoryOrder.indexOf(right as (typeof preferredCategoryOrder)[number]);

  if (leftOrder !== -1 || rightOrder !== -1) {
    if (leftOrder === -1) {
      return 1;
    }

    if (rightOrder === -1) {
      return -1;
    }

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }

  return compareNaturally(left, right);
}

function getExtensionPriority(fileName: string) {
  const extension = path.extname(fileName).toLowerCase() as (typeof extensionPriority)[number];
  const index = extensionPriority.indexOf(extension);
  return index === -1 ? extensionPriority.length : index;
}

function normalizeBaseName(baseName: string, folder: string) {
  const normalizedBaseName = baseName.toLowerCase();
  const prefixes = [folder.toLowerCase()];

  if (folder.toLowerCase() === "theatre") {
    prefixes.push("theare");
  }

  for (const prefix of prefixes) {
    if (normalizedBaseName.startsWith(prefix)) {
      const slicedValue = baseName.slice(prefix.length).replace(/^[-_\s]+/, "").trim();
      return slicedValue || baseName;
    }
  }

  return baseName;
}

function getPortfolioFolders() {
  const rootDirectory = path.join(process.cwd(), "public", "portfolio");

  try {
    return readdirSync(rootDirectory)
      .filter((folderName) => {
        const folderPath = path.join(rootDirectory, folderName);
        return statSync(folderPath).isDirectory();
      })
      .sort(compareCategoryFolders);
  } catch {
    return [];
  }
}

function readCategoryItems(category: PortfolioCategory, folder: string): PortfolioItem[] {
  const directory = path.join(process.cwd(), "public", "portfolio", folder);

  let fileNames: string[] = [];

  try {
    const dedupedFileNames = new Map<string, string>();

    const discoveredFileNames = readdirSync(directory)
      .filter((fileName) => supportedImageExtensions.some((extension) => fileName.toLowerCase().endsWith(extension)))
      .sort((left, right) => {
        const leftBaseName = left.replace(/\.(jpg|jpeg|png|webp)$/i, "");
        const rightBaseName = right.replace(/\.(jpg|jpeg|png|webp)$/i, "");

        if (leftBaseName !== rightBaseName) {
          return compareNaturally(leftBaseName, rightBaseName);
        }

        return getExtensionPriority(left) - getExtensionPriority(right);
      });

    for (const fileName of discoveredFileNames) {
      const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "").toLowerCase();
      if (!dedupedFileNames.has(baseName)) {
        dedupedFileNames.set(baseName, fileName);
      }
    }

    fileNames = Array.from(dedupedFileNames.values()).sort((left, right) => {
      const leftBaseName = left.replace(/\.(jpg|jpeg|png|webp)$/i, "");
      const rightBaseName = right.replace(/\.(jpg|jpeg|png|webp)$/i, "");
      const leftOrder = portfolioItemOrder[`${folder}/${leftBaseName}`] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = portfolioItemOrder[`${folder}/${rightBaseName}`] ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return compareNaturally(leftBaseName, rightBaseName);
    });
  } catch {
    return [];
  }

  return fileNames.map((fileName, index) => {
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const objectPosition = portfolioObjectPositions[`${folder}/${baseName}`];
    const normalizedTitle = normalizeBaseName(baseName, folder);

    return {
      id: `${folder}-${baseName.toLowerCase()}`,
      title: toTitleCase(normalizedTitle),
      category,
      image: `/portfolio/${folder}/${fileName}`,
      alt: `${category} makeup look ${index + 1}`,
      objectPosition
    };
  });
}

export function getPortfolioItems(): PortfolioItem[] {
  return getPortfolioFolders().flatMap((folder) => readCategoryItems(getCategoryLabel(folder), folder));
}

export function getPortfolioCategories(): ("All" | PortfolioCategory)[] {
  return ["All", ...getPortfolioFolders().map((folder) => getCategoryLabel(folder))];
}

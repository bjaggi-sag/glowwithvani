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
const portfolioObjectPositions: Record<string, string> = {
  "editorial/editorial-1": "center 22%",
  "editorial/editorial-2": "center 18%",
  "editorial/editorial-3": "center center",
  "editorial/editorial4": "center center",
  "theatre/theatre-2": "68% center"
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

function getPortfolioFolders() {
  const rootDirectory = path.join(process.cwd(), "public", "portfolio");

  try {
    return readdirSync(rootDirectory)
      .filter((folderName) => {
        const folderPath = path.join(rootDirectory, folderName);
        return statSync(folderPath).isDirectory();
      })
      .sort(compareNaturally);
  } catch {
    return [];
  }
}

function readCategoryItems(category: PortfolioCategory, folder: string): PortfolioItem[] {
  const directory = path.join(process.cwd(), "public", "portfolio", folder);

  let fileNames: string[] = [];

  try {
    fileNames = readdirSync(directory)
      .filter((fileName) => supportedImageExtensions.some((extension) => fileName.toLowerCase().endsWith(extension)))
      .sort(compareNaturally);
  } catch {
    return [];
  }

  return fileNames.map((fileName, index) => {
    const baseName = fileName.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    const objectPosition = portfolioObjectPositions[`${folder}/${baseName}`];

    return {
      id: `${folder}-${index + 1}`,
      title: toTitleCase(baseName),
      category,
      image: `/portfolio/${folder}/${fileName}`,
      alt: `${category} portfolio image ${index + 1}`,
      objectPosition
    };
  });
}

export function getPortfolioItems(): PortfolioItem[] {
  return getPortfolioFolders().flatMap((folder) => readCategoryItems(toTitleCase(folder), folder));
}

export function getPortfolioCategories(): ("All" | PortfolioCategory)[] {
  return ["All", ...getPortfolioFolders().map((folder) => toTitleCase(folder))];
}

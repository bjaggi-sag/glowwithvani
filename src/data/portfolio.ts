export type PortfolioCategory = "Bridal" | "Editorial" | "Soft Glam" | "SFX";

export type PortfolioItem = {
  id: string;
  title: string;
  category: PortfolioCategory;
  image: string;
  alt: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "bridal-1",
    title: "Classic Bridal Glow",
    category: "Bridal",
    image: "/portfolio/bridal/bridal-1.svg",
    alt: "Bridal makeup look with warm nude tones"
  },
  {
    id: "bridal-2",
    title: "Soft Reception Glam",
    category: "Bridal",
    image: "/portfolio/bridal/bridal-2.svg",
    alt: "Soft bridal reception glam"
  },
  {
    id: "editorial-1",
    title: "Bronzed Editorial",
    category: "Editorial",
    image: "/portfolio/editorial/editorial-1.svg",
    alt: "Editorial makeup with bronzed finish"
  },
  {
    id: "editorial-2",
    title: "Studio Beauty Shot",
    category: "Editorial",
    image: "/portfolio/editorial/editorial-2.svg",
    alt: "Photoshoot makeup for studio portrait"
  },
  {
    id: "soft-glam-1",
    title: "Evening Soft Glam",
    category: "Soft Glam",
    image: "/portfolio/soft-glam/soft-glam-1.svg",
    alt: "Party soft glam makeup"
  },
  {
    id: "soft-glam-2",
    title: "Radiant Event Look",
    category: "Soft Glam",
    image: "/portfolio/soft-glam/soft-glam-2.svg",
    alt: "Event makeup look with radiant skin"
  },
  {
    id: "sfx-1",
    title: "Fantasy SFX",
    category: "SFX",
    image: "/portfolio/sfx/sfx-1.svg",
    alt: "Creative fantasy SFX makeup look"
  },
  {
    id: "sfx-2",
    title: "Character SFX",
    category: "SFX",
    image: "/portfolio/sfx/sfx-2.svg",
    alt: "Character makeup effects look"
  }
];

export const portfolioCategories: ("All" | PortfolioCategory)[] = [
  "All",
  "Bridal",
  "Editorial",
  "Soft Glam",
  "SFX"
];

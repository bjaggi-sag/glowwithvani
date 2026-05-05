export type PortfolioTag = string;

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  alt: string;
  tags: PortfolioTag[];
  primaryTag: PortfolioTag;
  objectPosition?: string;
  sortOrder: number;
};

const visiblePortfolioTags = ["Bridal", "Reception", "Soft Glam", "Editorial", "Theatre", "Prosthetics", "SFX", "Creature"] as const;

export type PortfolioCategory = (typeof visiblePortfolioTags)[number];

const portfolioItems: PortfolioItem[] = [
  {
    id: "bridal-raw-464",
    title: "Bridal Portrait",
    image: "/portfolio/bridal/RAW-464.jpg",
    alt: "Bridal portrait with dupatta, jewelry, and soft glam makeup",
    tags: ["Bridal", "Soft Glam", "Indian Bridal"],
    primaryTag: "Bridal",
    objectPosition: "center 18%",
    sortOrder: 10
  },
  {
    id: "bridal-priyanshi-8",
    title: "Priyanshi Bridal",
    image: "/portfolio/bridal/priyanshi 8.jpeg",
    alt: "Bridal makeup portrait for Priyanshi",
    tags: ["Bridal", "Indian Bridal", "Soft Glam"],
    primaryTag: "Bridal",
    sortOrder: 20
  },
  {
    id: "bridal-priyanshi-11",
    title: "Priyanshi Bridal Detail",
    image: "/portfolio/bridal/priyanshi 11.jpeg",
    alt: "Bridal makeup detail portrait for Priyanshi",
    tags: ["Bridal", "Indian Bridal", "Soft Glam"],
    primaryTag: "Bridal",
    sortOrder: 30
  },
  {
    id: "reception-kajal-4",
    title: "Kajal Reception",
    image: "/portfolio/reception/kajal 4.jpeg",
    alt: "Reception glam makeup portrait for Kajal",
    tags: ["Reception", "Soft Glam", "Indian Bridal"],
    primaryTag: "Reception",
    sortOrder: 40
  },
  {
    id: "reception-kajal-5",
    title: "Kajal Reception Detail",
    image: "/portfolio/reception/kajal 5.jpeg",
    alt: "Reception glam makeup detail portrait for Kajal",
    tags: ["Reception", "Soft Glam", "Indian Bridal"],
    primaryTag: "Reception",
    sortOrder: 50
  },
  {
    id: "editorial-1",
    title: "Editorial 1",
    image: "/portfolio/editorial/editorial-1.jpg",
    alt: "Editorial makeup look 1",
    tags: ["Editorial"],
    primaryTag: "Editorial",
    objectPosition: "center 22%",
    sortOrder: 60
  },
  {
    id: "editorial-2",
    title: "Editorial 2",
    image: "/portfolio/editorial/editorial-2.jpg",
    alt: "Editorial makeup look 2",
    tags: ["Editorial"],
    primaryTag: "Editorial",
    objectPosition: "center 18%",
    sortOrder: 70
  },
  {
    id: "editorial-3",
    title: "Editorial 3",
    image: "/portfolio/editorial/editorial-3.jpg",
    alt: "Editorial makeup look 3",
    tags: ["Editorial"],
    primaryTag: "Editorial",
    objectPosition: "center center",
    sortOrder: 80
  },
  {
    id: "theatre-1",
    title: "Theatre 1",
    image: "/portfolio/theatre/theare-1.jpg",
    alt: "Theatre makeup look 1",
    tags: ["Theatre"],
    primaryTag: "Theatre",
    sortOrder: 90
  },
  {
    id: "theatre-2",
    title: "Theatre 2",
    image: "/portfolio/theatre/theatre-2.jpg",
    alt: "Theatre makeup look 2",
    tags: ["Theatre"],
    primaryTag: "Theatre",
    objectPosition: "68% center",
    sortOrder: 100
  },
  {
    id: "prosthetics-1",
    title: "Prosthetics",
    image: "/portfolio/prosthetics/Prosthetic.jpg",
    alt: "Prosthetic makeup transformation",
    tags: ["Prosthetics", "SFX"],
    primaryTag: "Prosthetics",
    sortOrder: 110
  },
  {
    id: "sfx-1",
    title: "SFX 1",
    image: "/portfolio/sfx/Sfx1.jpg",
    alt: "SFX makeup look 1",
    tags: ["SFX"],
    primaryTag: "SFX",
    sortOrder: 120
  },
  {
    id: "sfx-2",
    title: "SFX 2",
    image: "/portfolio/sfx/sfx2.jpg",
    alt: "SFX makeup look 2",
    tags: ["SFX"],
    primaryTag: "SFX",
    sortOrder: 130
  },
  {
    id: "creature-1",
    title: "Creature Design",
    image: "/portfolio/creature/CREATURE_DESIGN_TWINKLE_KAUR-1168.jpg",
    alt: "Creature design makeup look",
    tags: ["Creature", "Prosthetics", "SFX"],
    primaryTag: "Creature",
    sortOrder: 140
  }
];

function compareItems(left: PortfolioItem, right: PortfolioItem) {
  if (left.sortOrder !== right.sortOrder) {
    return left.sortOrder - right.sortOrder;
  }

  return left.title.localeCompare(right.title, undefined, { numeric: true, sensitivity: "base" });
}

export function getPortfolioItems(): PortfolioItem[] {
  return [...portfolioItems].sort(compareItems);
}

export function getPortfolioCategories(): ("All" | PortfolioCategory)[] {
  const availableTags = new Set<PortfolioCategory>();

  for (const item of portfolioItems) {
    for (const tag of item.tags) {
      if (visiblePortfolioTags.includes(tag as PortfolioCategory)) {
        availableTags.add(tag as PortfolioCategory);
      }
    }
  }

  return ["All", ...visiblePortfolioTags.filter((tag) => availableTags.has(tag))];
}

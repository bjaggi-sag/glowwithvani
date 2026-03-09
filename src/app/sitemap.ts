import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://glowwithvani.com";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/portfolio/`,
      lastModified: new Date()
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: new Date()
    }
  ];
}

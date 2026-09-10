import type { MetadataRoute } from "next";
import { getWriting } from "@/lib/writing";
import { publicProducts, siteUrl } from "@/lib/public-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/about",
    "/client-work",
    "/client-work/logically",
    "/client-work/peppy-health",
    "/client-work/eruptiv",
    "/products",
    "/writing",
    "/agents",
  ];
  return [
    ...pages.map((page) => ({ url: `${siteUrl}${page}` })),
    ...publicProducts.map(({ url }) => ({ url })),
    ...getWriting({ includeDrafts: false }).map((entry) => ({
      url: `${siteUrl}/writing/${entry.slug}`,
      lastModified: entry.updated ?? entry.date,
    })),
  ];
}

import type { MetadataRoute } from "next";
import { getWriting } from "@/lib/writing";
import { publicProducts, siteUrl } from "@/lib/public-catalog";
import { profileUrl } from "@/lib/site-identity";
import { getSiteIdentity } from "@/lib/site-identity.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteIdentity();
  if (site === "profile")
    return [
      ...[
        "",
        "/about",
        "/client-work",
        "/client-work/peppy-health",
        "/client-work/eruptiv",
        "/writing",
        "/agents",
      ].map((path) => ({ url: `${profileUrl}${path}` })),
      ...getWriting({ includeDrafts: false }).map((entry) => ({
        url: `${profileUrl}/writing/${entry.slug}`,
        lastModified: entry.updated ?? entry.date,
      })),
    ];
  const pages = [
    "",
    "/client-work/logically",
    "/products",
    "/agents",
    "/privacy",
  ];
  return [
    ...pages.map((page) => ({ url: `${siteUrl}${page}` })),
    ...publicProducts.map(({ url }) => ({ url })),
  ];
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/public-catalog";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/contact/review/", "/writing/preview/", "/api/contact/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/public-catalog";

// This site's entire premise is agent discoverability, so every named
// AI crawler gets the same access as everyone else: answer/search
// crawlers that cite this content, and training crawlers, alike. The
// disallowed paths are private routes and preview content, not an
// attempt to differentiate crawler intent.
const disallow = ["/contact/review/", "/writing/preview/", "/api/contact/"];

const namedAiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...namedAiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow,
        other: { "Content-Signal": "search=yes, ai-train=yes" },
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/public-catalog";

// This site's premise is agent discoverability, so answer and search
// crawlers that cite this content back to a reader are welcome. Crawlers
// that only scrape for model training, with no citation or attribution
// back to this site, are declined. The disallowed paths below are private
// routes and preview content, not part of that distinction.
const disallow = ["/contact/review/", "/writing/preview/", "/api/contact/"];

// Answer/search crawlers: feed responses that cite or link back here.
const answerAndSearchCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

// Training-only crawlers: scrape for model training with no attribution.
const trainingOnlyCrawlers = ["CCBot", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...answerAndSearchCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
      ...trainingOnlyCrawlers.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
      {
        userAgent: "*",
        allow: "/",
        disallow,
        other: { "Content-Signal": "search=yes, ai-train=no" },
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

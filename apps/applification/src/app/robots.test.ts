import { describe, expect, it } from "vitest";
import robots from "./robots";
import { siteUrl } from "@/lib/public-catalog";

const TRAINING_ONLY_CRAWLERS = ["CCBot", "Bytespider"];
const ANSWER_AND_SEARCH_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
];

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it("points to the sitemap", () => {
    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });

  it("allows the wildcard user agent and declares an ai-train=no Content Signal", () => {
    const wildcard = rules.find((rule) => rule.userAgent === "*");
    expect(wildcard?.allow).toBe("/");
    expect(wildcard?.other).toMatchObject({
      "Content-Signal": "search=yes, ai-train=no",
    });
  });

  it("gives answer and search crawlers the same allow/disallow rules as the wildcard", () => {
    const wildcard = rules.find((rule) => rule.userAgent === "*");
    for (const userAgent of ANSWER_AND_SEARCH_CRAWLERS) {
      const rule = rules.find((r) => r.userAgent === userAgent);
      expect(rule?.allow).toBe(wildcard?.allow);
      expect(rule?.disallow).toEqual(wildcard?.disallow);
    }
  });

  it("disallows training-only crawlers entirely", () => {
    for (const userAgent of TRAINING_ONLY_CRAWLERS) {
      const rule = rules.find((r) => r.userAgent === userAgent);
      expect(rule).toBeDefined();
      expect(rule?.disallow).toBe("/");
      expect(rule?.allow).toBeUndefined();
    }
  });

  it("keeps private and preview routes disallowed for every non-training rule", () => {
    const trainingOnly = new Set(TRAINING_ONLY_CRAWLERS);
    for (const rule of rules) {
      if (typeof rule.userAgent === "string" && trainingOnly.has(rule.userAgent)) {
        continue;
      }
      expect(rule.disallow).toEqual(
        expect.arrayContaining([
          "/contact/review/",
          "/writing/preview/",
          "/api/contact/",
        ]),
      );
    }
  });
});

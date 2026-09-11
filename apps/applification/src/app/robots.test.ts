import { describe, expect, it } from "vitest";
import robots from "./robots";
import { siteUrl } from "@/lib/public-catalog";

describe("robots", () => {
  const result = robots();
  const rules = Array.isArray(result.rules) ? result.rules : [result.rules];

  it("points to the sitemap", () => {
    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });

  it("allows the wildcard user agent and declares a Content Signal", () => {
    const wildcard = rules.find((rule) => rule.userAgent === "*");
    expect(wildcard?.allow).toBe("/");
    expect(wildcard?.other).toMatchObject({
      "Content-Signal": "search=yes, ai-train=yes",
    });
  });

  it("gives every named AI crawler the same allow and disallow rules as the wildcard", () => {
    const wildcard = rules.find((rule) => rule.userAgent === "*");
    const named = rules.filter((rule) => rule.userAgent !== "*");
    expect(named.length).toBeGreaterThan(0);
    for (const rule of named) {
      expect(rule.allow).toBe(wildcard?.allow);
      expect(rule.disallow).toEqual(wildcard?.disallow);
    }
  });

  it("names the major answer, search and training crawlers explicitly", () => {
    const agents = rules.map((rule) => rule.userAgent);
    for (const expected of [
      "GPTBot",
      "ClaudeBot",
      "PerplexityBot",
      "OAI-SearchBot",
      "CCBot",
      "Bytespider",
    ]) {
      expect(agents).toContain(expected);
    }
  });

  it("keeps private and preview routes disallowed everywhere", () => {
    for (const rule of rules) {
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

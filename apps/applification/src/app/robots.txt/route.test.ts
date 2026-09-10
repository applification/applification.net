import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("robots.txt", () => {
  it("keeps public crawling open, tiers AI crawlers and hides private routes", async () => {
    const response = GET();
    const text = await response.text();
    expect(response.headers.get("content-type")).toContain("text/plain");
    const groups = text.trim().split("\n\n");
    expect(groups[0]).toContain("User-agent: *\nAllow: /");
    expect(groups[0]).toContain("Content-Signal: search=yes, ai-input=yes");
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"]) {
      expect(groups[1]).toContain(`User-agent: ${bot}`);
    }
    expect(groups[1]).toContain("Allow: /");
    expect(groups[2]).toBe("User-agent: CCBot\nUser-agent: Bytespider\nDisallow: /");
    for (const path of ["/contact/review/", "/writing/preview/", "/api/contact/"]) {
      expect(groups[0]).toContain(`Disallow: ${path}`);
      expect(groups[1]).toContain(`Disallow: ${path}`);
    }
    expect(text).toContain("Sitemap: https://www.applification.net/sitemap.xml");
  });
});

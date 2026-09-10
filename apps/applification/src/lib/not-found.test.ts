import { describe, expect, it } from "vitest";
import { notFoundMarkdown, notFoundResponse } from "./not-found";

describe("notFoundMarkdown", () => {
  it("names the path and points at the sitemap, llms.txt and search", () => {
    const body = notFoundMarkdown("/missing/page");
    expect(body.startsWith("# 404: Not found")).toBe(true);
    expect(body).toContain("/missing/page");
    expect(body).toContain("https://www.applification.net/sitemap.xml");
    expect(body).toContain("https://www.applification.net/llms.txt");
    expect(body).toContain("https://www.applification.net/api/v1/search");
    expect(body.split("\n").length).toBeLessThan(20);
  });

  it("does not echo unsafe or oversized paths", () => {
    expect(notFoundMarkdown("/<script>")).toContain("the requested path");
    expect(notFoundMarkdown(`/${"a".repeat(300)}`)).toContain(
      "the requested path",
    );
  });
});

describe("notFoundResponse", () => {
  it("returns a 404 Markdown response", async () => {
    const response = notFoundResponse("/nope");
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(response.headers.get("x-robots-tag")).toBe("noindex");
    expect(await response.text()).toContain("/nope");
  });
});

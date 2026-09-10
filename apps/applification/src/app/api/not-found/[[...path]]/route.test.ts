import { describe, expect, it } from "vitest";
import { GET, HEAD, originalPath } from "./route";

const origin = "https://www.applification.net";

describe("originalPath", () => {
  it("recovers the requested path from the rewritten URL", () => {
    expect(originalPath(`${origin}/api/not-found/some/missing/page`)).toBe(
      "/some/missing/page",
    );
    expect(originalPath(`${origin}/api/not-found`)).toBe("/");
    expect(originalPath(`${origin}/elsewhere`)).toBe("/elsewhere");
  });
});

describe("GET /api/not-found", () => {
  it("serves a Markdown 404 naming the original path", async () => {
    const response = await GET(
      new Request(`${origin}/api/not-found/some/missing/page`),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    const body = await response.text();
    expect(body).toContain("Nothing is published at /some/missing/page");
    expect(body).toContain(`${origin}/llms.txt`);
    expect(body).toContain(`${origin}/sitemap.xml`);
  });

  it("answers HEAD with the same status", async () => {
    const response = await HEAD(new Request(`${origin}/api/not-found/x`));
    expect(response.status).toBe(404);
  });
});

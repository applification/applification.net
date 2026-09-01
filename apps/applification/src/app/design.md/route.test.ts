import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /design.md", () => {
  it("serves the current design guidance as Markdown", async () => {
    const response = await GET();
    const source = await readFile(new URL("../../../design.md", import.meta.url), "utf8");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("public, max-age=3600");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await response.text()).toBe(source);
  });
});

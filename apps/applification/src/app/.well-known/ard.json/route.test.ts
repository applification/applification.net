import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("ARD catalog", () => {
  it("serves valid ARD entries with CORS and caching", async () => {
    const response = GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(Array.isArray(body.entries)).toBe(true);
    expect(body.entries.length).toBeGreaterThan(0);
    const identifiers = new Set<string>();
    for (const entry of body.entries) {
      expect(entry.identifier).toMatch(/^urn:air:applification\.net:[a-z-]+:[a-z-]+$/);
      expect(identifiers.has(entry.identifier)).toBe(false);
      identifiers.add(entry.identifier);
      expect(typeof entry.displayName).toBe("string");
      expect(typeof entry.type).toBe("string");
      expect("url" in entry !== "data" in entry).toBe(true);
      expect(entry.representativeQueries.length).toBeGreaterThanOrEqual(2);
    }
    expect(body.entries.map((entry: { type: string }) => entry.type)).toContain(
      "application/mcp-server-card+json",
    );
    expect(JSON.stringify(body)).not.toMatch(
      /mailto:|[\w.+-]+@applification\.net/i,
    );
  });
});

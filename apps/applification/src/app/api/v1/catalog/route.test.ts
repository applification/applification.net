import { describe, expect, it } from "vitest";
import { catalogSections } from "@/lib/public-catalog";
import {
  catalogErrorSchema,
  catalogResponseSchema,
} from "@/lib/public-api-schema";
import { GET, OPTIONS } from "./route";

describe("public catalog API", () => {
  it.each(catalogSections)(
    "returns the documented %s section without authentication",
    async (section) => {
      const response = GET(
        new Request(`https://example.com/api/v1/catalog?section=${section}`),
      );
      const body = await response.json();
      expect(response.status).toBe(200);
      expect(catalogResponseSchema.safeParse(body).success).toBe(true);
      expect(body.section).toBe(section);
      expect(Object.keys(body.data)).toEqual(
        section === "all" ? ["profile", "products", "pricing"] : [section],
      );
      expect(response.headers.get("access-control-allow-origin")).toBe("*");
      expect(response.headers.get("cache-control")).toBe("public, max-age=300");
    },
  );

  it("defaults to all and distinguishes unpublished rates from free API access", async () => {
    const body = await GET(
      new Request("https://example.com/api/v1/catalog"),
    ).json();
    expect(body.section).toBe("all");
    expect(body.data.pricing.contract.publishedRate).toBeNull();
    expect(body.data.pricing.api.price).toBe(0);
    expect(body.data.products).toHaveLength(4);
    expect(JSON.stringify(body)).not.toMatch(
      /mailto:|[\w.+-]+@applification\.net/i,
    );
  });

  it.each([
    "section=private",
    "section=",
    "section=profile&section=pricing",
    "secret=x",
    "section=__proto__",
    "section=constructor",
  ])("rejects %s with a documented error", async (query) => {
    const response = GET(
      new Request(`https://example.com/api/v1/catalog?${query}`),
    );
    expect(response.status).toBe(400);
    expect(catalogErrorSchema.safeParse(await response.json()).success).toBe(
      true,
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("allows cross-origin read preflight without credentials or write methods", () => {
    const response = OPTIONS();
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toBe(
      "GET, HEAD, OPTIONS",
    );
    expect(response.headers.has("access-control-allow-credentials")).toBe(
      false,
    );
  });
});

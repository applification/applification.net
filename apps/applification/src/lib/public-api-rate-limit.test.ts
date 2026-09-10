import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPublicApiRateLimiter } from "./public-api-rate-limit";
import { publicOpenApi } from "./public-api-schema";
import { GET as catalog, OPTIONS } from "@/app/api/v1/catalog/route";
import { GET as search } from "@/app/api/v1/search/route";
import { GET as content } from "@/app/api/v1/content/route";
import { GET as openapi } from "@/app/api/openapi.json/route";

function request(path = "/api/v1/catalog", ip = "192.0.2.1", method = "GET") {
  return new Request(`https://example.com${path}`, {
    method,
    headers: { "x-forwarded-for": ip },
  });
}

beforeEach(() => vi.stubEnv("VERCEL", ""));
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("public API rate limit", () => {
  it("counts accepted requests, rejects excess, and resets at the advertised boundary", () => {
    const check = createPublicApiRateLimiter({ limit: 2 });
    expect(check(request(), 10_100).headers).toMatchObject({
      "RateLimit-Policy": '"public-read";q=2;w=60',
      RateLimit: '"public-read";r=1;t=50',
      "RateLimit-Remaining": "1",
      "RateLimit-Reset": "50",
    });
    expect(check(request(), 20_000).allowed).toBe(true);
    expect(check(request(), 59_001)).toMatchObject({ allowed: false, resetSeconds: 1 });
    expect(check(request(), 59_999).headers["RateLimit-Remaining"]).toBe("0");
    expect(check(request(), 60_000)).toMatchObject({
      allowed: true, resetSeconds: 60, headers: { "RateLimit-Remaining": "1" },
    });
  });

  it("isolates clients and lets OPTIONS through without consuming exhausted quota", () => {
    const check = createPublicApiRateLimiter({ limit: 1 });
    expect(check(request(), 1000).allowed).toBe(true);
    expect(check(request("/api/v1/search"), 1000).allowed).toBe(false);
    expect(check(request("/api/v1/search", "192.0.2.2"), 1000).allowed).toBe(true);
    expect(check(request(undefined, undefined, "OPTIONS"), 1000)).toMatchObject({
      allowed: true, headers: { "RateLimit-Remaining": "0" },
    });
    expect(check(request(undefined, undefined, "HEAD"), 1000).allowed).toBe(false);
  });

  it("bounds client storage without restoring existing allowances under churn", () => {
    const check = createPublicApiRateLimiter({ limit: 1, maxClients: 1 });
    expect(check(request(), 1000).allowed).toBe(true);
    expect(check(request(undefined, "192.0.2.2"), 1000).allowed).toBe(true);
    expect(check(request(undefined, "192.0.2.3"), 1000).allowed).toBe(false);
    expect(check(request(), 1000).allowed).toBe(false);
    expect(check(request(undefined, "192.0.2.3"), 60_000).allowed).toBe(true);
  });

  it("uses Vercel's trusted address rather than a spoofable forwarding header", () => {
    vi.stubEnv("VERCEL", "1");
    const check = createPublicApiRateLimiter({ limit: 1 });
    const first = request();
    first.headers.set("x-vercel-forwarded-for", "192.0.2.50");
    const second = request(undefined, "192.0.2.200");
    second.headers.set("x-vercel-forwarded-for", "192.0.2.50");
    expect(check(first, 1000).allowed).toBe(true);
    expect(check(second, 1000).allowed).toBe(false);
  });

  it("groups missing or invalid addresses rather than issuing unlimited buckets", () => {
    const check = createPublicApiRateLimiter({ limit: 1 });
    expect(check(request(undefined, ""), 1000).allowed).toBe(true);
    expect(check(request(undefined, "arbitrary-client"), 1000).allowed).toBe(false);
  });
});

describe("public response quota contract", () => {
  it("shares the allowance across routes and reports it on successes and errors", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-10T10:00:10.100Z"));
    const cases = [
      [catalog, "/api/v1/catalog", 200],
      [search, "/api/v1/search?limit=0", 400],
      [content, "/api/v1/content?type=products&slug=missing", 404],
      [openapi, "/api/openapi.json", 200],
    ] as const;
    for (const [index, [get, path, status]] of cases.entries()) {
      const response = get(request(path, "192.0.2.90"));
      expect(response.status).toBe(status);
      expect(response.headers.get("RateLimit-Remaining")).toBe(String(119 - index));
      expect(response.headers.get("RateLimit-Limit")).toBe("120");
      expect(response.headers.get("RateLimit-Reset")).toBe("50");
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Expose-Headers")).toContain("RateLimit-Remaining");
      expect(response.headers.get("Access-Control-Expose-Headers")).toContain("Retry-After");
      expect(response.headers.has("Retry-After")).toBe(false);
    }
    for (let i = cases.length; i < 120; i++) catalog(request(undefined, "192.0.2.90"));
    for (const [get, path] of cases) {
      const response = get(request(path, "192.0.2.90"));
      expect(response.status).toBe(429);
      expect(await response.json()).toMatchObject({ error: { code: "RATE_LIMITED" } });
      expect(response.headers.get("RateLimit")).toBe('"public-read";r=0;t=50');
      expect(response.headers.get("Retry-After")).toBe("50");
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    }
    const preflight = OPTIONS(request(undefined, "192.0.2.90", "OPTIONS"));
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("RateLimit-Remaining")).toBe("0");
    vi.setSystemTime(new Date("2026-09-10T10:01:00.000Z"));
    expect(catalog(request(undefined, "192.0.2.90")).headers.get("RateLimit-Remaining")).toBe("119");
  });

  it("documents quota headers and the 429 contract for every public operation", () => {
    type Operation = {
      tags?: string[];
      responses: Record<string, { headers?: Record<string, unknown> }>;
    };
    const operations = Object.values(publicOpenApi.paths).map(
      ({ get }) => get as Operation,
    );
    // The contact status poll is browser-gated and outside the public quota.
    const publicOperations = operations.filter((get) => !get.tags?.includes("contact"));
    expect(publicOperations.length).toBeGreaterThan(0);
    for (const get of publicOperations) {
      for (const response of Object.values(get.responses)) {
        expect(response.headers).toHaveProperty("RateLimit");
        expect(response.headers).toHaveProperty("RateLimit-Remaining");
      }
      expect(get.responses["429"].headers).toHaveProperty("Retry-After");
    }
  });
});

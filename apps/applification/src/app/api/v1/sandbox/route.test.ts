import { describe, expect, it } from "vitest";
import { publicContentErrorSchema } from "@/lib/content-schema";
import { sandboxResponseSchema } from "@/lib/public-api-schema";
import { GET, OPTIONS } from "./route";

describe("public sandbox API", () => {
  it("confirms a first call without authentication", async () => {
    const response = GET(new Request("https://example.com/api/v1/sandbox"));
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(sandboxResponseSchema.safeParse(body).success).toBe(true);
    expect(body.environment).toBe("sandbox");
    expect(body.onboarding.freeTier.available).toBe(true);
    expect(body.onboarding.apiKeys.required).toBe(false);
    expect(body.onboarding.sandbox.url).toBe(body.onboarding.firstCall.url);
    expect(body.tryNext.length).toBeGreaterThan(0);
    for (const step of body.tryNext)
      expect(step.url.startsWith(body.url)).toBe(true);
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("ratelimit-policy")).toBeTruthy();
    expect(JSON.stringify(body)).not.toMatch(
      /mailto:|[\w.+-]+@applification\.net/i,
    );
  });

  it("ignores credentials and rejects unknown parameters", async () => {
    const withAuth = GET(
      new Request("https://example.com/api/v1/sandbox", {
        headers: { Authorization: "Bearer not-needed" },
      }),
    );
    expect(withAuth.status).toBe(200);
    const response = GET(
      new Request("https://example.com/api/v1/sandbox?key=abc"),
    );
    expect(response.status).toBe(400);
    expect(
      publicContentErrorSchema.safeParse(await response.json()).success,
    ).toBe(true);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("allows cross-origin read preflight without write methods", () => {
    const response = OPTIONS(
      new Request("https://example.com/api/v1/sandbox", { method: "OPTIONS" }),
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-methods")).toBe(
      "GET, HEAD, OPTIONS",
    );
  });
});

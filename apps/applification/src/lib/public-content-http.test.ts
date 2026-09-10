import { afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { publicContentErrorSchema } from "./content-schema";
import {
  publicApiLifecycle,
  publicApiLifecycleHeaders,
  publicRead,
  publicReadMethodNotAllowed,
  publicReadOptions,
} from "./public-content-http";

const schema = z.strictObject({ q: z.string().optional() });

describe("public API HTTP helpers", () => {
  afterEach(() => {
    publicApiLifecycle.deprecation = null;
  });

  it("returns structured JSON errors with a code, message, hint and docs link", async () => {
    const response = publicRead(
      new Request("https://example.com/api/v1/search?nope=1"),
      schema,
      () => ({}),
    );
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(publicContentErrorSchema.safeParse(body).success).toBe(true);
    expect(body.error.code).toBe("INVALID_QUERY");
    expect(body.error.hint).toMatch(/OpenAPI/);
    expect(body.error.docs).toBe("https://www.applification.net/agents");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns a JSON 404 with recovery guidance when the handler finds nothing", async () => {
    const response = publicRead(
      new Request("https://example.com/api/v1/content"),
      schema,
      () => null,
    );
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
    expect(body.error.hint).toMatch(/\/api\/v1\/search/);
  });

  it("returns a JSON 405 with an Allow header for write methods", async () => {
    const response = publicReadMethodNotAllowed(
      new Request("https://example.com/api/v1/catalog", { method: "POST" }),
    );
    const body = await response.json();
    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET, HEAD, OPTIONS");
    expect(body.error.code).toBe("METHOD_NOT_ALLOWED");
    expect(body.error.message).toMatch(/POST/);
    expect(publicContentErrorSchema.safeParse(body).success).toBe(true);
  });

  it("advertises the OpenAPI document and docs through RFC 8288 Link headers", () => {
    const options = () =>
      publicReadOptions(
        new Request("https://example.com/api/v1/catalog", { method: "OPTIONS" }),
      );
    const link = options().headers.get("link") ?? "";
    expect(link).toContain('rel="service-desc"');
    expect(link).toContain("/api/openapi.json");
    expect(link).toContain('rel="service-doc"');
    expect(link).not.toContain('rel="deprecation"');
    expect(options().headers.has("deprecation")).toBe(false);
    expect(options().headers.has("sunset")).toBe(false);
  });

  it("emits Deprecation, Sunset and a deprecation link once a version is deprecated", async () => {
    publicApiLifecycle.deprecation = {
      deprecatedAt: new Date("2027-01-01T00:00:00Z"),
      sunsetAt: new Date("2027-07-01T00:00:00Z"),
    };
    const headers = publicApiLifecycleHeaders();
    expect(headers.Deprecation).toBe("@1798761600");
    expect(headers.Sunset).toBe("Thu, 01 Jul 2027 00:00:00 GMT");
    expect(headers.Link).toContain('/agents#versioning>; rel="deprecation"');
    const response = publicRead(
      new Request("https://example.com/api/v1/search"),
      schema,
      () => ({ ok: true }),
    );
    expect(response.headers.get("sunset")).toBe("Thu, 01 Jul 2027 00:00:00 GMT");
    expect(await response.json()).toEqual({ ok: true });
  });
});

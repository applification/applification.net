import { describe, expect, test } from "bun:test";
import {
  Applification,
  ApplificationError,
  MCP_CLIENT_CONFIG,
  MCP_ENDPOINT,
  SITE_URL,
} from "./index";

function fakeFetch(
  handler: (url: URL) => { status?: number; body: unknown; headers?: Record<string, string> },
) {
  const calls: URL[] = [];
  const fetchImpl = (async (input: URL | RequestInfo) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    calls.push(url);
    const { status = 200, body, headers } = handler(url);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...headers },
    });
  }) as typeof fetch;
  return { fetchImpl, calls };
}

describe("Applification SDK", () => {
  test("targets the production origin with no credentials by default", async () => {
    const { fetchImpl, calls } = fakeFetch(() => ({
      body: { apiVersion: "1.0.0", url: SITE_URL, section: "pricing", data: {} },
    }));
    const client = new Applification({ fetch: fetchImpl });
    const catalog = await client.catalog("pricing");
    expect(catalog.section).toBe("pricing");
    expect(calls[0].toString()).toBe(`${SITE_URL}/api/v1/catalog?section=pricing`);
    expect(MCP_ENDPOINT).toBe(`${SITE_URL}/api/mcp`);
    expect(MCP_CLIENT_CONFIG.mcpServers.applification.url).toBe(MCP_ENDPOINT);
  });

  test("builds search queries and omits undefined parameters", async () => {
    const { fetchImpl, calls } = fakeFetch(() => ({
      body: { results: [], total: 0, nextOffset: null },
    }));
    const client = new Applification({ fetch: fetchImpl, baseUrl: "http://localhost:3333/" });
    await client.search({ query: "production AI", type: "client-work", limit: 3 });
    expect(calls[0].origin).toBe("http://localhost:3333");
    expect(calls[0].pathname).toBe("/api/v1/search");
    expect(Object.fromEntries(calls[0].searchParams)).toEqual({
      query: "production AI",
      type: "client-work",
      limit: "3",
    });
  });

  test("searchAll follows nextOffset and readAll follows nextSection", async () => {
    const { fetchImpl } = fakeFetch((url) => {
      if (url.pathname.endsWith("/search")) {
        const offset = Number(url.searchParams.get("offset") ?? 0);
        return {
          body: {
            results: [{ type: "writing", slug: `post-${offset}`, title: "", summary: "", url: SITE_URL, topics: [] }],
            total: 2,
            nextOffset: offset === 0 ? 1 : null,
          },
        };
      }
      const section = Number(url.searchParams.get("section") ?? 0);
      return {
        body: {
          type: "writing",
          slug: "post-0",
          title: "Post",
          summary: "",
          url: SITE_URL,
          topics: [],
          sections: [{ index: 0, title: "Post" }, { index: 1, title: "Post (continued 2)" }],
          section,
          content: `part ${section}`,
          format: "markdown",
          nextSection: section === 0 ? 1 : null,
          links: [],
        },
      };
    });
    const client = new Applification({ fetch: fetchImpl });
    const slugs: string[] = [];
    for await (const result of client.searchAll({ type: "writing" })) slugs.push(result.slug);
    expect(slugs).toEqual(["post-0", "post-1"]);
    expect(await client.readAll({ type: "writing", slug: "post-0" })).toBe("part 0\n\npart 1");
  });

  test("raises ApplificationError with the API's code and message", async () => {
    const { fetchImpl } = fakeFetch((url) =>
      url.pathname.endsWith("/content")
        ? { status: 404, body: { error: { code: "NOT_FOUND", message: "Published content or section not found." } } }
        : { status: 429, body: { error: "throttled" }, headers: { "Retry-After": "7" } },
    );
    const client = new Applification({ fetch: fetchImpl });
    const missing = await client.read({ type: "writing", slug: "nope" }).catch((e) => e);
    expect(missing).toBeInstanceOf(ApplificationError);
    expect(missing.status).toBe(404);
    expect(missing.code).toBe("NOT_FOUND");
    const throttled = await client.search().catch((e) => e);
    expect(throttled.code).toBe("UNAVAILABLE");
    expect(throttled.retryAfter).toBe(7);
  });
});

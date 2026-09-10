import { describe, expect, it } from "vitest";
import { mcpServerCard, mcpTools } from "@/lib/mcp-server";
import { readContentResponseSchema, searchSiteResponseSchema } from "@/lib/content-schema";
import { catalogResponseSchema } from "@/lib/public-api-schema";
import { DELETE, GET, OPTIONS, POST } from "./route";

const endpoint = "https://example.com/api/mcp";
const protocolVersion = "2025-11-25";

function rpc(method: string, params: unknown = {}, id: number | null = 1) {
  return new Request(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "Mcp-Protocol-Version": protocolVersion,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      ...(id === null ? {} : { id }),
      method,
      params,
    }),
  });
}

async function call(name: string, args: Record<string, unknown>) {
  const response = await POST(rpc("tools/call", { name, arguments: args }));
  const body = await response.json();
  return { response, body };
}

describe("remote MCP server over Streamable HTTP", () => {
  it("initialises statelessly with JSON responses, no session and no authentication", async () => {
    const response = await POST(
      rpc("initialize", {
        protocolVersion,
        capabilities: {},
        clientInfo: { name: "vitest", version: "1.0.0" },
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.get("mcp-session-id")).toBeNull();
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("ratelimit-policy")).toMatch(/^"public-read";q=\d+;w=\d+$/);
    expect(response.headers.get("ratelimit-remaining")).toMatch(/^\d+$/);
    const body = await response.json();
    expect(body.result.serverInfo.name).toBe(mcpServerCard.name);
    expect(body.result.capabilities.tools).toBeDefined();
    expect(body.result.instructions).toMatch(/No account, API key/);
  });

  it("lists exactly the tools advertised in the server card, all read-only", async () => {
    const response = await POST(rpc("tools/list"));
    const body = await response.json();
    const tools = body.result.tools as Array<{
      name: string;
      description: string;
      inputSchema: { type: string; properties?: Record<string, unknown> };
      annotations: { readOnlyHint: boolean };
    }>;
    expect(tools.map((tool) => tool.name).sort()).toEqual(
      mcpTools.map((tool) => tool.name).sort(),
    );
    for (const tool of tools) {
      expect(tool.annotations.readOnlyHint).toBe(true);
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.description.length).toBeGreaterThan(40);
    }
    expect(
      tools.find((tool) => tool.name === "search_site")?.inputSchema.properties,
    ).toHaveProperty("query");
  });

  it("searches, reads and returns the catalog with the documented shapes", async () => {
    const search = await call("search_site", {
      query: "production AI",
      type: "client-work",
    });
    expect(search.response.status).toBe(200);
    expect(search.body.result.isError).toBeUndefined();
    const searchResult = searchSiteResponseSchema.parse(
      search.body.result.structuredContent,
    );
    expect(searchResult.results.length).toBeGreaterThan(0);
    expect(JSON.parse(search.body.result.content[0].text)).toEqual(
      search.body.result.structuredContent,
    );

    const first = searchResult.results[0];
    const read = await call("read_content", {
      type: first.type,
      slug: first.slug,
    });
    const readResult = readContentResponseSchema.parse(
      read.body.result.structuredContent,
    );
    expect(readResult.slug).toBe(first.slug);
    expect(readResult.content.length).toBeLessThanOrEqual(4000);

    const catalog = await call("get_applification_info", {
      section: "pricing",
    });
    const catalogResult = catalogResponseSchema.parse(
      catalog.body.result.structuredContent,
    );
    expect(catalogResult.section).toBe("pricing");
    expect(JSON.stringify(catalogResult)).not.toMatch(
      /mailto:|[\w.+-]+@applification\.net/i,
    );
  });

  it("reports invalid input and missing content as tool errors, not transport failures", async () => {
    const invalid = await call("search_site", { limit: 50 });
    expect(invalid.response.status).toBe(200);
    expect(invalid.body.error ?? invalid.body.result.isError).toBeTruthy();

    const missing = await call("read_content", {
      type: "client-work",
      slug: "does-not-exist",
    });
    expect(missing.response.status).toBe(200);
    expect(missing.body.result.isError).toBe(true);
    expect(missing.body.result.content[0].text).toMatch(/search_site/);
  });

  it("rejects non-JSON-RPC bodies with a JSON error", async () => {
    const response = await POST(
      new Request(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: "not json",
      }),
    );
    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = await response.json();
    expect(body.jsonrpc).toBe("2.0");
    expect(body.error.code).toBeTypeOf("number");
  });

  it("answers CORS preflight and does not manage sessions", async () => {
    const preflight = OPTIONS();
    expect(preflight.status).toBe(204);
    expect(preflight.headers.get("access-control-allow-methods")).toContain(
      "POST",
    );
    expect(preflight.headers.get("access-control-allow-headers")).toContain(
      "Mcp-Session-Id",
    );

    const del = await DELETE(new Request(endpoint, { method: "DELETE" }));
    expect(del.status).toBe(405);

    const get = await GET(
      new Request(endpoint, {
        method: "GET",
        headers: { Accept: "text/event-stream" },
      }),
    );
    expect(get.status).toBe(405);
    expect(get.headers.get("allow")).toBe("POST, OPTIONS");
    expect((await get.json()).error.message).toMatch(/POST/);
  });
});

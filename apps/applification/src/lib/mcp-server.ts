// Remote MCP server exposing the same read-only public information as the
// HTTP API and the in-browser WebMCP tools. Content access stays server-side.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import {
  readContentInputSchema,
  searchSiteInputSchema,
} from "./content-schema";
import {
  mcpInstructions,
  mcpServerName,
  mcpServerVersion,
  mcpTools,
} from "./mcp-metadata";
import {
  catalogInputSchema,
  catalogSections,
  getPublicCatalog,
  siteUrl,
} from "./public-catalog";
import { readContent, searchSite } from "./public-content.server";
import { catalogTool, readContentTool, searchSiteTool } from "./webmcp";

export {
  mcpEndpoint,
  mcpServerCard,
  mcpServerName,
  mcpServerVersion,
  mcpTools,
} from "./mcp-metadata";

function toolResult(payload: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    structuredContent: payload as Record<string, unknown>,
  };
}

export function createMcpServer() {
  const server = new McpServer(
    { name: mcpServerName, version: mcpServerVersion },
    { instructions: mcpInstructions },
  );

  server.registerTool(
    searchSiteTool.name,
    {
      title: "Search published content",
      description: searchSiteTool.description,
      inputSchema: searchSiteInputSchema,
      annotations: mcpTools[0].annotations,
    },
    async (input) => toolResult(searchSite(input)),
  );

  server.registerTool(
    readContentTool.name,
    {
      title: "Read a content section",
      description: readContentTool.description,
      inputSchema: readContentInputSchema,
      annotations: mcpTools[1].annotations,
    },
    async (input) => {
      const result = readContent(input);
      if (result === null)
        return {
          isError: true,
          content: [
            {
              type: "text" as const,
              text: "Published content or section not found. Use search_site to find available content.",
            },
          ],
        };
      return toolResult(result);
    },
  );

  server.registerTool(
    catalogTool.name,
    {
      title: "Read the public catalog",
      description: catalogTool.description,
      inputSchema: catalogInputSchema.extend({
        section: z
          .enum(catalogSections)
          .optional()
          .describe("The public catalog section to read. Defaults to all."),
      }),
      annotations: mcpTools[2].annotations,
    },
    async (input) => toolResult(getPublicCatalog(input)),
  );

  server.registerResource(
    "site-guide",
    `${siteUrl}/llms.txt`,
    {
      title: "Applification site guide",
      description: "Every public URL and tool, in plain text for agents.",
      mimeType: "text/plain",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: `Fetch ${siteUrl}/llms.txt for the current site guide. Developer documentation: ${siteUrl}/developers. OpenAPI: ${siteUrl}/api/openapi.json.`,
        },
      ],
    }),
  );

  return server;
}

const mcpHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
  "X-Content-Type-Options": "nosniff",
};

export function mcpOptions() {
  return new Response(null, {
    status: 204,
    headers: { ...mcpHeaders, "Access-Control-Max-Age": "86400" },
  });
}

// Stateless: every request builds a fresh server and transport, which suits
// serverless hosting and needs no shared session store. Without sessions there
// is no server-initiated stream to open (GET) or session to end (DELETE), and
// the specification allows 405 for both.
export async function handleMcpRequest(request: Request) {
  if (request.method === "GET" || request.method === "DELETE")
    return Response.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message:
            "This stateless server only accepts POST. Send JSON-RPC requests to this URL.",
        },
        id: null,
      },
      { status: 405, headers: { ...mcpHeaders, Allow: "POST, OPTIONS" } },
    );
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(mcpHeaders))
      headers.set(key, value);
    headers.set("Cache-Control", "no-store");
    return new Response(response.body, { status: response.status, headers });
  } finally {
    transport.close().catch(() => {
      /* Closing after a completed JSON response never affects the client. */
    });
  }
}

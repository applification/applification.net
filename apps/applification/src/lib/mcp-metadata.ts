// Client-safe MCP metadata: endpoint, tool list and server card. Imported by
// pages and Storybook, so it must not touch server-only content loaders.
import { publicProfile, siteUrl } from "./public-catalog";
import { catalogTool, readContentTool, searchSiteTool } from "./webmcp";

export const mcpEndpoint = `${siteUrl}/api/mcp`;
export const mcpServerVersion = "1.0.0";
export const mcpServerName = "applification";

export const mcpInstructions = `Read-only public information about Dave Hudson and Applification Ltd. No account, API key or payment is needed. Start with get_applification_info for the profile, products and commercial terms. Use search_site to find published client work, writing and products, then read_content with the returned type and slug to read one Markdown section at a time; follow nextSection until it is null. Nothing here sends enquiries or changes data. Contract rates are quoted per engagement and are not published.`;

export const mcpTools = [
  {
    name: searchSiteTool.name,
    description: searchSiteTool.description,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: readContentTool.name,
    description: readContentTool.description,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
  {
    name: catalogTool.name,
    description: catalogTool.description,
    annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  },
] as const;

// Published at /.well-known/mcp/server-card.json so clients can discover the
// endpoint and tool list without opening a session.
export const mcpServerCard = {
  name: mcpServerName,
  version: mcpServerVersion,
  kind: "product",
  description:
    "Public profile, products, commercial terms and published writing of Dave Hudson and Applification Ltd, a UK contract AI product engineering business. Read-only; no authentication.",
  icon: `${siteUrl}/brand/applification-mark-light.svg`,
  url: mcpEndpoint,
  transport: "streamable-http",
  protocolVersion: "2025-11-25",
  authentication: { type: "none" },
  instructions: mcpInstructions,
  capabilities: { tools: true, resources: true },
  tools: mcpTools,
  resources: [
    {
      uri: `${siteUrl}/llms.txt`,
      name: "llms.txt",
      description: "Site guide for agents with every public URL.",
      mimeType: "text/plain",
    },
    {
      uri: `${siteUrl}/api/openapi.json`,
      name: "openapi",
      description: "OpenAPI 3.1 description of the HTTP API behind these tools.",
      mimeType: "application/vnd.oai.openapi+json",
    },
  ],
  documentation: `${siteUrl}/developers`,
  homepage: siteUrl,
  contact: publicProfile.contactUrl,
};


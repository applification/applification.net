// Agentic Resource Discovery (ARD) catalog for agents. Every entry points at a
// surface that already exists; none grant new access. The Agent Skills index
// and SKILL.md live in ./agent-skills.
import {
  agentSkillsIndex,
  siteSkillDescription,
  siteSkillPath,
} from "./agent-skills";
import { mcpServerCard, mcpTools } from "./mcp-metadata";
import { siteUrl } from "./public-catalog";

export const discoveryHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
  "X-Content-Type-Options": "nosniff",
};

const trustManifest = {
  identity: "did:web:www.applification.net",
  identityType: "did",
};

export const ardCatalog = {
  specVersion: "1.0",
  host: {
    displayName: "Applification",
    identifier: "did:web:www.applification.net",
    documentationUrl: `${siteUrl}/developers`,
  },
  entries: [
    {
      identifier: "urn:air:applification.net:mcp:applification",
      displayName: "Applification MCP server",
      type: "application/mcp-server-card+json",
      url: `${siteUrl}/.well-known/mcp/server-card.json`,
      description: mcpServerCard.description,
      tags: ["contract-engineering", "portfolio", "products", "mcp", "read-only"],
      capabilities: mcpTools.map((tool) => tool.name),
      representativeQueries: [
        "who is Dave Hudson and is he available for a contract",
        "find Applification client work involving production AI",
        "what does Applification charge for a contract",
        "what products does Applification build",
      ],
      version: mcpServerCard.version,
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:skill:applification-site",
      displayName: "Applification site skill",
      type: "application/ai-skill+md",
      url: `${siteUrl}${siteSkillPath}`,
      description: siteSkillDescription,
      tags: ["skill", "portfolio", "contract-engineering"],
      representativeQueries: [
        "look up Dave Hudson's experience",
        "read an Applification case study",
      ],
      metadata: { digest: agentSkillsIndex.skills[0].digest },
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:api:public-information",
      displayName: "Applification Public Information API",
      type: "application/vnd.oai.openapi+json;version=3.1",
      url: `${siteUrl}/api/openapi.json`,
      description:
        "Free, read-only REST API for the public catalog, content search and section reads. No API key.",
      tags: ["api", "rest", "openapi", "read-only"],
      capabilities: ["searchSite", "readContent", "getApplificationCatalog"],
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:docs:developers",
      displayName: "Applification developer documentation",
      type: "text/html",
      url: `${siteUrl}/developers`,
      description:
        "Human-readable documentation for the MCP server, HTTP API, SDKs and CLI, with authentication, error and rate-limit guidance.",
      tags: ["documentation", "developers"],
      trustManifest,
    },
    {
      identifier: "urn:air:applification.net:guide:llms-txt",
      displayName: "Applification site guide for agents",
      type: "text/plain",
      url: `${siteUrl}/llms.txt`,
      description: "Every public page, endpoint and tool in one plain-text file.",
      tags: ["llms.txt", "discovery"],
      trustManifest,
    },
  ],
};
